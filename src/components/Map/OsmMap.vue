<template>
	<l-map :zoom="zoom" :center="center" style="width: 100%; height: 500px">
		<l-tile-layer :url="url" :attribution="attribution" />
		<slot />
	</l-map>
</template>

<script>
import { latLng } from 'leaflet';
import { LMap, LTileLayer } from 'vue2-leaflet';

export default {
	name: 'OsmMap',
	components: {
		LMap,
		LTileLayer,
	},
	data() {
		return {
			zoom: 12,
			center: latLng(0, 0),
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		};
	},

	mounted() {
		this.geolocate();
	},

	methods: {
		setMapCenter(marker) {
			if (marker) {
				this.center = marker;
				this.markers.push({ position: marker });
			}
		},

		geolocate: function () {
			navigator.geolocation.getCurrentPosition(position => {
				this.center = latLng(
					position.coords.latitude,
					position.coords.longitude,
				);
			});
		},
	},
};
</script>
