const geojsonTypes = {
    FEATURE: 'Feature',
    POLYGON: 'Polygon',
    LINE_STRING: 'LineString',
    POINT: 'Point',
    FEATURE_COLLECTION: 'FeatureCollection',
    MULTI_PREFIX: 'Multi',
    MULTI_POINT: 'MultiPoint',
    MULTI_LINE_STRING: 'MultiLineString',
    MULTI_POLYGON: 'MultiPolygon'
};

const types = {
    POLYGON: 'polygon',
    LINE: 'line_string',
    POINT: 'point'
};

const cursors = {
    ADD: 'add',
    MOVE: 'move',
    DRAG: 'drag',
    POINTER: 'pointer',
    NONE: 'none'
};

const activeStates = {
    ACTIVE: 'true',
    INACTIVE: 'false'
};

const meta = {
    FEATURE: 'feature',
    MIDPOINT: 'midpoint',
    VERTEX: 'vertex'
};

const modes = {
    DRAW_LINE_STRING: 'draw_line_string',
    DRAW_POLYGON: 'draw_polygon',
    DRAW_POINT: 'draw_point',
    SIMPLE_SELECT: 'simple_select',
    DIRECT_SELECT: 'direct_select',
    STATIC: 'static'
};

const events = {
    CREATE: 'draw.create',
    DELETE: 'draw.delete',
    UPDATE: 'draw.update',
    SELECTION_CHANGE: 'draw.selectionchange',
    MODE_CHANGE: 'draw.modechange',
    ACTIONABLE: 'draw.actionable',
    RENDER: 'draw.render',
    COMBINE_FEATURES: 'draw.combine',
    UNCOMBINE_FEATURES: 'draw.uncombine'
};

const doubleClickZoom = {
    enable: function enable(ctx) {
        setTimeout(function () {
            // First check we've got a map and some context.
            if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) { 
                return; 
            }

            // Now check initial state wasn't false (we leave it disabled if so)
            if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) { 
                return; 
            }
            ctx.map.doubleClickZoom.enable();
        }, 0);
    },
    disable: function disable(ctx) {
        setTimeout(function () {
            if (!ctx.map || !ctx.map.doubleClickZoom) { 
                return; 
            }

            // Always disable here, as it's necessary in some cases.
            ctx.map.doubleClickZoom.disable();
        }, 0);
    }
};

function isVertex(e) {
    var featureTarget = e.featureTarget;
    if (!featureTarget) { return false; }
    if (!featureTarget.properties) { return false; }
    return featureTarget.properties.meta === meta.VERTEX;
}

function isEventAtCoordinates(event, coordinates) {
    if (!event.lngLat) { return false; }
    return event.lngLat.lng === coordinates[0] && event.lngLat.lat === coordinates[1];
}

function isEscapeKey(e) {
    return e.keyCode === 27;
}
  
function isEnterKey(e) {
    return e.keyCode === 13;
}

function createVertex(parentId, coordinates, path, selected) {
    return {
        type: geojsonTypes.FEATURE,
        properties: {
            meta: meta.VERTEX,
            parent: parentId,
            coord_path: path,
            active: (selected) ? activeStates.ACTIVE : activeStates.INACTIVE
        },
        geometry: {
            type: geojsonTypes.POINT,
            coordinates: coordinates
        }
    };
}

export {
    geojsonTypes, cursors, activeStates, meta, modes, types, events, doubleClickZoom,
    isVertex, isEventAtCoordinates, isEscapeKey, isEnterKey, createVertex
};