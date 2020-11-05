<template>
	<div>
		<h2>Search and add a pin</h2>
		<label>
			<gmap-autocomplete @place_changed="setPlace"> </gmap-autocomplete>
			<button @click="setMapCenter">Add</button>
		</label>
		<br />
	</div>
</template>

<script>
export default {
	name: 'GoogleAutocomplete',
	data() {
		return {
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

		setMapCenter() {
			if (this.currentPlace) {
				const marker = {
					lat: this.currentPlace.geometry.location.lat(),
					lng: this.currentPlace.geometry.location.lng(),
				};

				this.$root.$emit('update', marker);
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
