<template>
	<component :is="getMarker"></component>
</template>

<script>
import GoogleMarker from './Marker/GoogleMarker.vue';
import OsmMarker from './Marker/OsmMarker.vue';

import { MapStrategy, Strategy } from '../strategy/MapStrategy';

export default {
	name: 'VueMarker',
	props: ['provider', 'coordinates'],
	components: { GoogleMarker, OsmMarker },

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', this.renderGoogleMarker);
		const osm = new Strategy('osm', this.renderOsmMarker);

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
		renderOsmMarker() {
			console.debug('rendering marker');
			const coordinates = this.coordinates;

			return {
				render(h) {
					return h(OsmMarker, { props: { coordinates } });
				},
			};
		},
		renderGoogleMarker() {
			const coordinates = this.coordinates;

			return {
				render(h) {
					return h(GoogleMarker, { props: { coordinates } });
				},
			};
		},
	},
};
</script>
