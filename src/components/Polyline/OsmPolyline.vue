<template>
	<l-polyline :lat-lngs="latlngs" :color="this.color" />
</template>

<script>
import { LPolyline } from 'vue2-leaflet';

export default {
	name: 'OsmPolyline',
	components: { LPolyline },
	props: {
		/**
		 * The coordinates of the marker
		 */
		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},

		color: {
			type: String,
		},
	},
	data() {
		return {
			latlngs: this.coordinates ? this.coordinates : [],
		};
	},
};
</script>
