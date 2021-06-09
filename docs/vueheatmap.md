# `<VuePolyline />` Component API

## Props

| Prop | Type | Required | Default | Note |
|---|---|---|---|---|
| `provider` | `string` | `NO` | `"osm"` | The map framework to use. <br>Either `"google"` for GoogleMaps, or `"osm"` to use the OpenStreetMaps.
| `center` | `Object`| `NO` | `{ lat: 1, lng: 1 }` | The center map.
| `initialZoom` | `Number`| `NO` | `13` | The initial zoom of the map.
| `points` | `Array`| `YES` | `[]` | The points to be displayed on the map. `[{lat: 12, lng: 23}]`
| `width` | `String, Number`| `NO` | `100%` | The width of the map.
| `height` | `String, Number`| `NO` | `100%` | The height of the map.
| `opacity` | `Number`| `NO` | `1` | The height of the map.

## Usage

```js
<template>
    <div style="width: 100%; height: 100%;">
      <vue-heatmap
        :points="points"
        :center="center"
        :height="550"
      />
    </div>
</template>

<script>
    import { VueHeatMap } from "vue-maps";
    export default {
      components: { VueHeatmap }
      data() {
        return {
          center: { lat: 12.22, lng: 12.43 },
          points: [
            { lat: 37.772, lng: -122.214 },
            { lat: 37.672, lng: -122.250 },
            { lat: 21.291, lng: -157.821 },
            { lat: -18.142, lng: 178.431 },
            { lat: -27.467, lng: 153.027 },
          ],
        }
      }
    }
<script>
```

### Don't forget to setup width and height for your map, otherwise it will not display
