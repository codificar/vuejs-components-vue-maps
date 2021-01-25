<template>
	<l-marker :lat-lng="marker" :icon="getIcon" @click="toggleInfoWindow">
		<l-popup v-if="infoWinOpen">
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
		clickable: {
			type: Boolean,
			twoWay: true,
			default: true,
		},
		icon: {
			type: Object,
			default: () => new Object(),
		},
		title: {
			type: String,
		},
		label: {
			type: String,
		},
	},

	data() {
		return {
			infoWinOpen: true,
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
			if(this.clickable){
				this.infoWinOpen = !this.infoWinOpen;
			}
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
