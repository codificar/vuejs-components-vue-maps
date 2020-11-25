<template>
	<l-map :zoom="zoom" :center="center" style="width: 100%; height: 550px">
		<l-tile-layer :url="url" :attribution="attribution" />
		<l-marker v-if="centerMarkerUrl" :lat-lng="center">
			<l-icon
				:icon-size="[20, 20]"
				:icon-anchor="[20, 10]"
				:icon-url="centerMarkerUrl"
			>
			</l-icon>
		</l-marker>
		<slot />
	</l-map>
</template>

<script>
import { LMap, LMarker, LTileLayer, LIcon } from 'vue2-leaflet';

export default {
	name: 'OsmMap',
	components: {
		LMap,
		LMarker,
		LIcon,
		LTileLayer,
	},
	props: {
		center: {
			type: Object,
		},
		centerMarkerUrl: {
			type: String,
			default: undefined,
		},
	},
	data() {
		return {
			zoom: 13,
			//center: this.center ? this.center : latLng(0, 0),
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		};
	},

	mounted() {
		console.log(this.centerMarkerUrl);
		/*MapEvents.$on('update-center', center => {
			console.log('Event update center');
			this.center = center;
		});*/
	},
};
</script>
<style>
@import 'https://unpkg.com/leaflet/dist/leaflet.css';
</style>
