import { cursors, geojsonTypes, activeStates, meta, modes, isVertex, isEventAtCoordinates, types, isEscapeKey, isEnterKey, createVertex, events, doubleClickZoom } from "./modeConsts";

import { snap, findGuidesFromFeatures, generateGuideFeature, IDS, shouldHideGuide, roundLngLatTo1Cm, addPointToGuides } from "./snapUtils";
import { lib } from "@mapbox/mapbox-gl-draw";

//----------------DrawPolygonCustom--------------------
const DrawPolygonSnap = {
    onSetup: function() {
        const polygon = this.newFeature({
            type: geojsonTypes.FEATURE,
            properties: {},
            geometry: {
                type: geojsonTypes.POLYGON,
                coordinates: [[]]
            }
        });
    
        const verticalGuide = this.newFeature(generateGuideFeature(IDS.VERTICAL_GUIDE));
        const horizontalGuide = this.newFeature(generateGuideFeature(IDS.HORIZONTAL_GUIDE));

        this.addFeature(polygon);

        this.addFeature(verticalGuide);
        this.addFeature(horizontalGuide);
    
        doubleClickZoom.disable(this);
        
        this.clearSelectedFeatures();
        this.updateUIClasses({ mouse: cursors.ADD });
        this.activateUIButton(types.POLYGON);
        this.setActionableState({
            trash: true
        });
    
        const state = {
            polygon: polygon,
            currentVertexPosition: 0,
            guides: findGuidesFromFeatures(this.map, this._ctx.api, polygon),
            snapPx: 10, // Esse valor pode ser alterado
            map: this.map,
            verticalGuide: verticalGuide,
            horizontalGuide: horizontalGuide
        }

        this.map.on('moveend', () => {
            // Update the guide locations after zoom, pan, rotate, or resize
            state.guides = findGuidesFromFeatures(this.map, this._ctx.api, polygon);
        });

        return state;
    },

    clickAnywhere: function(state, e) {
        const lng = roundLngLatTo1Cm(state.snappedLng);
        const lat = roundLngLatTo1Cm(state.snappedLat);

        if (state.currentVertexPosition > 0 && isEventAtCoordinates(e, state.polygon.coordinates[0][state.currentVertexPosition - 1])) {
            return this.changeMode(modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
        }
    
        this.updateUIClasses({ mouse: cursors.ADD });

        const point = state.map.project({lng: lng, lat: lat});
        addPointToGuides(state.guides, point);

        state.polygon.updateCoordinate(("0." + (state.currentVertexPosition)), lng, lat);
        state.currentVertexPosition++;
        state.polygon.updateCoordinate(("0." + (state.currentVertexPosition)), lng, lat);
    },

    clickOnVertex: function(state) {
        return this.changeMode(modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
    },

    onMouseMove: function(state, e) {
        const {lng, lat} = snap(state, e);

        state.polygon.updateCoordinate(("0." + (state.currentVertexPosition)), lng, lat);

        state.snappedLng = lng;
        state.snappedLat = lat;

        if (isVertex(e)) {
            this.updateUIClasses({ mouse: cursors.POINTER });
        }
    },

    onClick: function(state, e) {
        if (isVertex(e)) { return this.clickOnVertex(state, e); }
        return this.clickAnywhere(state, e);
    },

    onTap: function(state, e) {
        if (isVertex(e)) { return this.clickOnVertex(state, e); }
        return this.clickAnywhere(state, e);
    },
    
    onKeyUp: function(state, e) {
        if (isEscapeKey(e)) {
            this.deleteFeature([state.polygon.id], { silent: true });
            this.changeMode(modes.SIMPLE_SELECT);
        } else if (isEnterKey(e)) {
            this.changeMode(modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
        }
    },

    onStop: function(state) {
        this.deleteFeature(IDS.VERTICAL_GUIDE, { silent: true });
        this.deleteFeature(IDS.HORIZONTAL_GUIDE, { silent: true });

        this.updateUIClasses({ mouse: cursors.NONE });
        doubleClickZoom.enable(this);
        this.activateUIButton();
    
        // check to see if we've deleted this feature
        if (this.getFeature(state.polygon.id) === undefined) { return; }
    
        //remove last added coordinate
        state.polygon.removeCoordinate(("0." + (state.currentVertexPosition)));
        if (state.polygon.isValid()) {
            this.map.fire(events.CREATE, {
                features: [state.polygon.toGeoJSON()]
            });
        } else {
            this.deleteFeature([state.polygon.id], { silent: true });
            this.changeMode(modes.SIMPLE_SELECT, {}, { silent: true });
        }
    },

    toDisplayFeatures: function(state, geojson, display) {
        if (shouldHideGuide(state, geojson)) return;

        var isActivePolygon = geojson.properties.id === state.polygon.id;
        geojson.properties.active = (isActivePolygon) ? activeStates.ACTIVE : activeStates.INACTIVE;
        
        if (!isActivePolygon) { 
            return display(geojson); 
        }
    
        // Don't render a polygon until it has two positions
        // (and a 3rd which is just the first repeated)
        if (geojson.geometry.coordinates.length === 0) { 
            return; 
        }
    
        var coordinateCount = geojson.geometry.coordinates[0].length;
    
        // 2 coordinates after selecting a draw type
        // 3 after creating the first point
        if (coordinateCount < 3) {
            return;
        }
    
        geojson.properties.meta = meta.FEATURE;
    
        display(createVertex(state.polygon.id, geojson.geometry.coordinates[0][0], '0.0', false));
        
        if (coordinateCount > 3) {
            // Add a start position marker to the map, clicking on this will finish the feature
            // This should only be shown when we're in a valid spot
            var endPos = geojson.geometry.coordinates[0].length - 3;
            display(createVertex(state.polygon.id, geojson.geometry.coordinates[0][endPos], ("0." + endPos), false));
        }
    
        if (coordinateCount <= 4) {
            // If we've only drawn two positions (plus the closer),
            // make a LineString instead of a Polygon
            var lineCoordinates = [
                [geojson.geometry.coordinates[0][0][0], geojson.geometry.coordinates[0][0][1]], [geojson.geometry.coordinates[0][1][0], geojson.geometry.coordinates[0][1][1]]
            ];
            
            // create an initial vertex so that we can track the first point on mobile devices
            display({
                type: geojsonTypes.FEATURE,
                properties: geojson.properties,
                geometry: {
                    coordinates: lineCoordinates,
                    type: geojsonTypes.LINE_STRING
                }
            });
            if (coordinateCount === 3) {
                return;
            }
        }
    
        // render the Polygon
        return display(geojson);
    },

    onTrash: function(state) {
        this.deleteFeature([state.polygon.id], { silent: true });
        this.changeMode(modes.SIMPLE_SELECT);
    }
};

const modifiedDefaultStyles = lib.theme.map(defaultStyle => {
    if (defaultStyle.id === 'gl-draw-line-inactive') {
        return {
            ...defaultStyle,
            filter: [
                ...defaultStyle.filter,
                ['!=', 'user_isSnapGuide', 'true'],
            ],
        };
    }
    
    return defaultStyle;
});

const DrawPolygonSnapModeStyles = [
    ...modifiedDefaultStyles,
    {
        'id': 'guide',
        'type': 'line',
        'filter': ['all',
            ['==', '$type', 'LineString'],
            ['==', 'user_isSnapGuide', 'true'],
        ],
        'layout': {
            'line-cap': 'round',
            'line-join': 'round'
        },
        'paint': {
            'line-color': '#ff0000',
            'line-width': 1,
            'line-dasharray': [5, 5],
        },
    },
];

export default DrawPolygonSnap;
export {DrawPolygonSnapModeStyles};