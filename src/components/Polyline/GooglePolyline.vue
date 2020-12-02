<template>
	<gmap-polyline
		v-bind:path.sync="path"
		v-bind:options="{ strokeColor: this.color }"
		v-bind:clickable="true"
		v-on:click="traffic_free1.InfoWindowShown = true"
	>
	</gmap-polyline>
</template>

<script>
export default {
	name: 'GooglePolyline',
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
			path: this.coordinates ? this.coordinates : [],
		};
	},
};
</script>
