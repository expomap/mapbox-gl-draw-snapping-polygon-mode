# mapbox-gl-draw-snapping-polygon-mode
Modo personalizado para o Mapbox GL Draw que adiciona a funcionalidade de desenhar polígonos com snaping

Esse modo é uma melhoria do já conhecido `snap_polygon` do [mhsattarian/mapbox-gl-draw-snap-mode](https://github.com/mhsattarian/mapbox-gl-draw-snap-mode), adicionando guias para vértices do polígono que você está desenhando atualmente, o que deixa mais fácil a criação de ângulos retos em um polígono.

## Instalação
`npm i @expomap/mapbox-gl-draw-snapping-polygon-mode`


## Uso
**Veja a demo abaixo para entender sobre o uso do módulo**

* Importe os MapboxGL e o MapboxGLDraw
```
import { Map } from 'mapbox-gl'
import mapboxGlDraw from '@mapbox/mapbox-gl-draw'
````

* Importe o modo `DrawPolygonSnap`
```
import DrawPolygonSnap, { DrawPolygonSnapModeStyles } from '@expomap/mapbox-gl-draw-snapping-polygon-mode';
```

* Crie o mapa
```
var map = new Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 3.54883,
    center: [-56, -16],
    bearing: 0,
    accessToken: [SUA_CHAVE]
});
```

* Crie o objeto `Draw` adicionando o modo `DrawPolygonSnap`

Você precisará configurar o `draw` com `userProperties: true` e adicionar os estilos personalizados com `styles: DrawPolygonSnapModeStyles` para as guias aparecerem.

Se na sua aplicação, você já está usando estilos personalizados, você precisará mesclar ambos estilos manualmente
```
var modes = mapboxGlDraw.modes;

modes.draw_polygon_snap = DrawPolygonSnap;

var draw = new mapboxGlDraw({
    modes: modes,
    userProperties: true,
    styles: DrawPolygonSnapModeStyles
});

map.addControl(draw);
```

* Ativar o modo 
```
draw.changeMode('draw_polygon_snap');
```


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
import DrawPolygonSnap, { DrawPolygonSnapModeStyles } from '@expomap/mapbox-gl-draw-snapping-polygon-mode';

var map = new Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    zoom: 3.54883,
    center: [-56, -16],
    bearing: 0,
    accessToken: [SUA_CHAVE]
});

var modes = mapboxGlDraw.modes;

modes.draw_polygon_snap = DrawPolygonSnap;

var draw = new mapboxGlDraw({
    modes: modes,
    userProperties: true,
    styles: DrawPolygonSnapModeStyles
});

map.addControl(draw);

draw.changeMode('draw_polygon_snap');
```

Você pode ver essa demo no ar [nesse link](https://codepen.io/fatorius/full/oNrrWzM)

## NPM
[https://www.npmjs.com/package/@expomap/mapbox-gl-draw-snapping-polygon-mode](https://www.npmjs.com/package/@expomap/mapbox-gl-draw-snapping-polygon-mode)