import * as VueGoogleMaps from 'vue2-google-maps'
import VueMaps from './src/components/VueMaps.vue'
import VueHeatmap from './src/components/VueHeatmap.vue'
import VueMarker from './src/components/VueMarker.vue'
import VueCallout from './src/components/VueCallout.vue'
import VuePolyline from './src/components/VuePolyline.vue'

export function install (Vue, options) {

	if (options.key && options.provider === 'google') {
		Vue.use(VueGoogleMaps, {
			load: {
				key: options.key,
				libraries: ['places', 'visualization']
			},
			installComponents: true,
		});
	}

	Vue.component(VueMaps.name, VueMaps.default);
	Vue.component(VueHeatmap.name, VueHeatmap.default);
	Vue.component(VueMarker.name, VueMarker.default);
	Vue.component(VueCallout.name, VueCallout.default);
	Vue.component(VuePolyline.name, VuePolyline.default);
};

export { default as VueMaps } from './src/components/VueMaps.vue'
export { default as VueHeatmap } from './src/components/VueHeatmap.vue'
export { default as VueMarker } from './src/components/VueMarker.vue'
export { default as VueCallout } from './src/components/VueCallout.vue'
export { default as VuePolyline } from './src/components/VuePolyline.vue'
