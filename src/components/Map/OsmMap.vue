<template>
	<l-map :zoom="zoom" :center="center">
		<l-tile-layer :url="url" :attribution="attribution" />
		<l-marker v-if="displayCenterMarker" :lat-lng="center">
			<l-icon
				:icon-size="centerMarker.size"
				:icon-anchor="centerMarker.anchor"
				:icon-url="centerMarker.url"
			>
			</l-icon>
		</l-marker>
		<slot />
	</l-map>
</template>

<script>
import { LMap, LMarker, LTileLayer, LIcon } from 'vue2-leaflet';
import { centerPin } from '../../constants/icons';

const centerMarkerDefault = {
	url: centerPin,
	size: [20, 20],
	anchor: [20, 10],
	rotation: 0,
};

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
		centerMarker: {
			type: Object,
			default: () => new Object(),
		},
		displayCenterMarker: {
			type: Boolean,
			default: true,
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
	created() {
		Object.assign(this.centerMarker, {
			...centerMarkerDefault,
			...this.centerMarker,
		});
	},
};
</script>
<style>
@import 'https://unpkg.com/leaflet/dist/leaflet.css';
</style>
