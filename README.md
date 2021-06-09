# vue-maps

## Project setup

## Install

add in package.json:

```bash
"vue-maps": "git+https://libs:ofImhksJ@git.codificar.com.br/vuejs-components/vue-maps.git#version",
```

```js
import * as CodificarMaps from 'vue-maps';

Vue.use(CodificarMaps, {
    key: window.settings.mapsApiKey,
});
```

## Component API

[`<VueMaps />` Component API](docs/vuemaps.md)

[`<VueMarker />` Component API](docs/vuemarker.md)

[`<VueCallout />` Component API](docs/vuecallout.md)

[`<VuePolyline />` Component API](docs/vuepolyline.md)

[`<VueHeatmap />` Component API](docs/vueheatmap.md)
