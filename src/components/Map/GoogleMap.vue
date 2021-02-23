<template>
	<gmap-map
		:center="center"
		:zoom="12"
		style="width: 100%; height: 100%"
		@click="getMarker"
	>
		<gmap-marker
			v-if="displayCenterMarker"
			:position="this.center"
			:icon="icon"
		>
		</gmap-marker>
		<slot />
	</gmap-map>
</template>

<script>
export default {
	name: 'GoogleMap',
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
			markers: [],
			places: [],
			icon: {
				url: this.centerMarker.url,
				size: { width: 20, height: 20, f: 'px', b: 'px' },
				scaledSize: { width: 20, height: 20, f: 'px', b: 'px' },
			},
		};
	},
	methods: {
		getMarker(event) {
			const latlng = {
				latidude: event.latLng.lat(),
				longitude: event.latLng.lng()
			}
			this.$parent.$emit('click-map', latlng);
		},
	},
};
</script>
