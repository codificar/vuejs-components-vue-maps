<template>
	<l-marker :lat-lng="this.marker" :icon="icon">
		<l-popup v-if="this.tooltip">
			<div v-html="getInfoWindowContent()"></div>
		</l-popup>
	</l-marker>
</template>

<script>
import { latLng, icon } from 'leaflet';
import { LMarker, LPopup } from 'vue2-leaflet';

export default {
	name: 'OsmMarker',
	components: { LMarker, LPopup },
	props: {
		/**
		 * The coordinates of the marker
		 */
		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},
		tooltip: {
			type: String,
		},
		iconUrl: {
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

			icon: icon({
				iconUrl: this.iconUrl,
				iconSize: [20, 20],
				iconAnchor: [10, 20],
			}),

			marker: this.coordinates ? latLng(this.coordinates) : null,
		};
	},

	methods: {
		toggleInfoWindow: function () {
			this.infoWindowPos = this.coordinate;
			this.infoContent = this.getInfoWindowContent();

			this.infoWinOpen = true;
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
