# `<VueCallout />` Component API

## Props

| Prop | Type | Required | Default | Note |
|---|---|---|---|---|
| `message` | `String`| `NO` | `''` | The message for the callout.
| `html` | `Function`| `NO` | `() => return '<div></div>'` | Function that returns the html to be rendered in the callout.


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
            <vue-callout
              message="This is a message"
              :html="() => getCallout()"
            >
            </vue-callout>
          </vue-marker>
        </vue-maps>
    </div>
</template>

<script>
    import { VueMaps, VueMarker, VueCallout } from "vue-maps";
    export default {
      components: { VueMaps, VueMarker, VueCallout }
      data() {
        return {
          center: { lat: 12.22, lng: 12.43 },
          markerCoordinates: [12.223, -14.21],
        }
      },
      methods: {
        getCallout() {
          const msg: 'This is a paragraph'
          return `<div><p>${msg}</p></div>`
        }
      }
    }
<script>
```

### Don't forget to setup width and height for your map, otherwise it will not display
