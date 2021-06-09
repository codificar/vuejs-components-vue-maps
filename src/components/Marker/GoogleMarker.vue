<template>
	<div>
		<gmap-marker
			:position="coordinates"
			:title="title"
			:label="label"
			:icon="getIcon"
			:style="iconStyle"
			:clickable="clickable"
			:draggable="draggable"
			@dragend="updateCoordinates"
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
		icon: {
			type: Object,
			default: () => new Object(),
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
		title: {
			type: String,
		},
		label: {
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
		};
	},
	computed: {
		getIcon() {
			const url = this.icon.url;
			const size = {
				width: this.icon.size[0],
				height: this.icon.size[1],
				f: 'px',
				b: 'px',
			};
			const scaledSize = {
				width: this.icon.size[0],
				height: this.icon.size[1],
				f: 'px',
				b: 'px',
			};
			const rotation = this.icon.rotation;

			return { url, size, scaledSize, rotation };
		},

		iconStyle() {
			let rotation = this.icon.rotation;
			return { transform: 'rotate(' + rotation + 'deg)' };
		},
	},

	methods: {
		updateCoordinates(value) {
			const coordinate = {
				latitude: value.latLng.lat(),
				longitude: value.latLng.lng(),
			};
			this.$parent.$emit('drag', coordinate);
		},
		toggleInfoWindow: function() {
			if (this.clickable) {
				this.infoWindowPos = this.coordinates;
				this.infoContent = this.getInfoWindowContent();

				this.infoWinOpen = !this.infoWinOpen;
			}
		},

		getInfoWindowContent: function() {
			if (!this.$slots.default) {
				return '<div></div>';
			}
			return this.$slots.default[0].componentOptions.propsData.html();
		},
	},
};
</script>
