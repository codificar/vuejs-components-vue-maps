<template>
	<l-marker
		:lat-lng="getCoordinates"
		:icon="getIcon"
		:style="iconStyle"
		:draggable="draggable"
		@update:latLng="updateCoordinates"
		@click="toggleInfoWindow"
	>
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
		draggable: {
			type: Boolean,
			twoWay: true,
			default: false,
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
		getCoordinates() {
			return this.coordinates ? latLng(this.coordinates) : null;
		},
		iconStyle() {
			let rotation = this.icon.rotation;
			return { transform: 'rotate(' + rotation + 'deg)' };
		},
	},

	methods: {
		updateCoordinates(value) {
			const coordinate = {
				latitude: value.lat,
				longitude: value.lng,
			};
			this.$parent.$emit('drag', coordinate);
		},
		toggleInfoWindow: function() {
			if (this.clickable) {
				this.infoWinOpen = !this.infoWinOpen;
			}
		},
		getInfoWindowContent: function() {
			if (!this.$slots.default) {
				let text = this.title ? this.title : '';
				return `<div>${text}</div>`;
			}
			return this.$slots.default[0].componentOptions.propsData.html();
		},
	},
};
</script>
