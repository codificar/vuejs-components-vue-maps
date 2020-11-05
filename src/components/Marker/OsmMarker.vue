<template>
	<l-marker :lat-lng="this.marker"></l-marker>
</template>

<script>
import { latLng } from 'leaflet';
import { LMarker } from 'vue2-leaflet';

export default {
	name: 'OsmMarker',
	components: { LMarker },
	props: {
		/**
		 * The coordinates of the marker
		 */
		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},
	},
	data() {
		return {
			marker: this.coordinates ? latLng(this.coordinates) : null,
		};
	},
};
</script>
