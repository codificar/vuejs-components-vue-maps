<template>
	<l-marker :lat-lng="this.marker" :icon="getIcon">
		<l-popup v-if="this.tooltip">
			<div v-html="getInfoWindowContent()"></div>
		</l-popup>
	</l-marker>
</template>

<script>
import { latLng, icon as LIcon } from 'leaflet';
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
		icon: {
			type: Object,
			default: () => new Object(),
		},
	},

	data() {
		return {
			infoContent: '',
			infoWinOpen: false,
			infoWindowPos: {
				lat: 0,
				lng: 0,
			},
			marker: this.coordinates ? latLng(this.coordinates) : null,
		};
	},

	computed: {
		getIcon() {
			return LIcon({
				iconUrl: this.icon.url,
				iconSize: this.icon.size,
				iconAnchor: this.icon.anchor,
			});
		},
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
