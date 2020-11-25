<template>
	<component :is="getMarker"></component>
</template>

<script>
import GooglePolyline from './Polyline/GooglePolyline.vue';
import OsmPolyline from './Polyline/OsmPolyline.vue';

import { MapStrategy, Strategy } from '../strategy/MapStrategy';

export default {
	name: 'VuePolyline',
	props: {
		provider: {
			type: String,
		},

		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},

		color: {
			type: String,
			default: '#ff000f',
		},
	},
	components: { GooglePolyline, OsmPolyline },

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', this.renderGooglePolyline);
		const osm = new Strategy('osm', this.renderOsmPolylineVue);

		this.strategyManager.addStrategy(google);
		this.strategyManager.addStrategy(osm);
	},

	computed: {
		getMarker() {
			const strategy = this.strategyManager.getStrategy(this.provider);
			return strategy.doAction();
		},
	},

	methods: {
		renderOsmPolylineVue() {
			const coordinates = this.coordinates;
			const color = this.color;

			return {
				render(h) {
					return h(OsmPolyline, { props: { coordinates, color } });
				},
			};
		},
		renderGooglePolyline() {
			const coordinates = this.coordinates;
			const color = this.color;

			return {
				render(h) {
					return h(GooglePolyline, { props: { coordinates, color } });
				},
			};
		},
	},
};
</script>
