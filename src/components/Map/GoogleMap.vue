<template>
	<gmap-map :center="center" :zoom="12" style="width: 100%; height: 550px">
		<gmap-marker :position="this.center" :icon="icon"> </gmap-marker>
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
		centerMarkerUrl: {
			type: String,
			default: undefined,
		},
	},
	data() {
		return {
			markers: [],
			places: [],
			icon: {
				url: this.centerMarkerUrl,
				size: { width: 20, height: 20, f: 'px', b: 'px' },
				scaledSize: { width: 20, height: 20, f: 'px', b: 'px' },
			},
		};
	},
};
</script>
