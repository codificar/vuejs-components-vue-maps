<template>
	<div>
		<gmap-marker
			:position="this.coordinates"
			:title="this.title"
			:icon="icon"
			@click="toggleInfoWindow"
		>
		</gmap-marker>
		<gmap-info-window
			:options="infoOptions"
			:position="infoWindowPos"
			:opened="infoWinOpen"
			@closeclick="infoWinOpen = false"
		>
			<div v-html="infoContent"></div>
		</gmap-info-window>
	</div>
</template>

<script>
export default {
	name: 'GoogleMarker',
	props: {
		/**
		 * The coordinates of the marker
		 */
		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},
		iconUrl: {
			type: String,
		},
		title: {
			type: String,
		},
		description: {
			type: String,
		},
	},

	data() {
		return {
			infoContent: '',
			infoWindowPos: {
				lat: 0,
				lng: 0,
			},
			infoWinOpen: false,
			currentMidx: null,
			//optional: offset infowindow so it visually sits nicely on top of our marker
			infoOptions: {
				pixelOffset: {
					width: 0,
					height: -35,
				},
			},
			icon: {
				url: this.iconUrl,
				size: { width: 20, height: 20, f: 'px', b: 'px' },
				scaledSize: { width: 20, height: 20, f: 'px', b: 'px' },
			},
		};
	},

	methods: {
		toggleInfoWindow: function () {
			this.infoWindowPos = this.coordinates;
			this.infoContent = this.getInfoWindowContent();

			this.infoWinOpen = !this.infoWinOpen;
		},

		getInfoWindowContent: function () {
			if (!this.$slots.default) {
				return '<div></div>';
			}
			return this.$slots.default[0].componentOptions.propsData.html();
		},
	},
};
</script>
