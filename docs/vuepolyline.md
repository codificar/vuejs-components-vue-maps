# `<VuePolyline />` Component API

## Props

| Prop | Type | Required | Default | Note |
|---|---|---|---|---|
| `coordinates` | `Array`| `YES` | `[]` | The array with the coordinates of the polyline. `[{lat: 21.213, lng: 42.23}]`
| `color` | `String`| `NO` | `#ff000f` | The color of the polyline.

## Usage

```js
<template>
    <div style="width: 100%; height: 100%;">
        <vue-maps :center="center">
          <vue-polyline
            :coordinates="polyline"
            color= "#ff000f"
          >
          </vue-polyline>
        </vue-maps>
    </div>
</template>

<script>
    import { VueMaps, VueMarker } from "vue-maps";
    export default {
      components: { VueMaps, VueMarker }
      data() {
        return {
          center: { lat: 12.22, lng: 12.43 },
          polyline: [
            { lat: 37.772, lng: -122.214 },
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
