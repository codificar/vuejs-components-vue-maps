# `<VueMaps />` Component API

## Props

| Prop | Type | Required | Default | Note |
|---|---|---|---|---|
| `provider` | `string` | `NO` | `"osm"` | The map framework to use. <br>Either `"google"` for GoogleMaps, or `"osm"` to use the OpenStreetMaps.
| `center` | `Object`| `YES` | `{ lat: undefined,`<br>`lng: undefined}` | The coordinates of map center.
| `centerMarker` | `Object`| `NO` | `{ url: defaultPin,`<br>`size: [20, 20],`<br>`anchor: [20, 10],`<br>`rotation: 0 }` | The marker image for the center marker.
| `displayCenterMarker` | `Boolean`| `NO` | `true` | Should set the center marker as visible?

## Usage

```js
<template>
    <div style="width: 100%; height: 100%;">
        <vue-maps
            :provider="provider"
            :center="center"
            :centerMarker="centerMarker"
        >
        </vue-maps>
    </div>
</template>

<script>
    import { VueMaps } from "vue-maps";
    export default {
      components: { VueMaps }
      data() {
        return {
          provider: 'google',
          center: {lat: 12.22, lng: 12.43}
          centerMarker: { icon: '/images/pin.png' }
        }
      }
    }
<script>
```

### Don't forget to setup width and height for your map, otherwise it will not display
