# `<VueMarker />` Component API

## Props

| Prop | Type | Required | Default | Note |
|---|---|---|---|---|
| `coordinates` | `Array`| `YES` | `[0, 0]` | The coordinates of marker. `coordinates[0] = lat, coordinates[1] = lng`
| `icon` | `Object`| `NO` | `{ url: defaultPin,`<br>`size: [20, 20],`<br>`anchor: [20, 10],`<br>`rotation: 0 }` | The props of the marker.
| `title` | `String`| `NO` | `''` | The title of the marker.
| `description` | `String`| `NO` | `''` | The description of the marker.

## Usage

```js
<template>
    <div style="width: 100%; height: 100%;">
        <vue-maps :center="center">
          <vue-marker
            title="myMarker"
            :icon="{ url: 'iconURL' }"
            :coordinates="markerCoordinates"
          >
          </vue-marker>
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
          markerCoordinates: [12.223, -14.21],
        }
      }
    }
<script>
```

### Don't forget to setup width and height for your map, otherwise it will not display
