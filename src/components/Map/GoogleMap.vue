<template>
	<gmap-map :center="center" :zoom="12" style="width: 100%; height: 400px">
		<slot />
	</gmap-map>
</template>

<script>
export default {
	name: 'GoogleMap',
	data() {
		return {
			center: { lat: 45.508, lng: -73.587 },
			markers: [],
			places: [],
			currentPlace: null,
		};
	},

	mounted() {
		this.geolocate();
	},

	methods: {
		// receives a place object via the autocomplete component
		setPlace(place) {
			this.currentPlace = place;
		},

		setMapCenter(marker) {
			if (marker) {
				this.center = marker;
				this.markers.push({ position: marker });
			}
		},

		addMarker() {
			if (this.currentPlace) {
				const marker = {
					lat: this.currentPlace.geometry.location.lat(),
					lng: this.currentPlace.geometry.location.lng(),
				};
				this.markers.push({ position: marker });
				this.places.push(this.currentPlace);
				this.currentPlace = null;
			}
		},
		geolocate: function () {
			navigator.geolocation.getCurrentPosition(position => {
				this.center = {
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				};
			});
		},
	},
};
</script>
