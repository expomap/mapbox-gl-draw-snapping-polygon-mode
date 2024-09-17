# mapbox-gl-draw-snapping-polygon-mode
Modo personalizado para o Mapbox GL Draw que adiciona a funcionalidade de desenhar polígonos com snaping

Esse modo é uma melhoria do já conhecido `snap_polygon` do [mhsattarian/mapbox-gl-draw-snap-mode](https://github.com/mhsattarian/mapbox-gl-draw-snap-mode), adicionando guias para vértices do polígono que você está desenhando atualmente, o que deixa mais fácil a criação de ângulos retos em um polígono.

## Demo

### HTML
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mapbox GL Draw Snapping Polygon</title>
  </head>
  <body>
    <div id="map"></div>

    <style>
        body { margin:0; padding:0; }
        #map { position:absolute; top:0; bottom:0; width:100%; }
    </style>
  </body>
</html>

```

### Js
```
import { Map } from 'mapbox-gl'
import mapboxGlDraw from '@mapbox/mapbox-gl-draw'
import DrawPolygonCustom, { CustomDrawPolygonModeStyles } from '@expomap/mapbox-gl-draw-snapping-polygon-mode';

var map = new Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 3.54883,
    center: [-56, -16],
    bearing: 0,
    accessToken: 'pk.eyJ1IjoidGhlZ2lzZGV2IiwiYSI6ImNqdGQ5dmd2MTEyaWk0YXF0NzZ1amhtOWMifQ.GuFE28BPyzAcHWejNLzuyw'
});

var modes = mapboxGlDraw.modes;

modes.draw_polygon_snap = DrawPolygonCustom;

var draw = new mapboxGlDraw({
    modes: modes,
    userProperties: true,
    styles: CustomDrawPolygonModeStyles
});

map.addControl(draw);

draw.changeMode('draw_polygon_snap');

```

Você pode ver essa demo no ar [nesse link](https://codepen.io/fatorius/pen/oNrrWzM)