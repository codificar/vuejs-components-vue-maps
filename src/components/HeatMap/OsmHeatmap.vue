<template>
	<l-map
		ref="heatmap"
		:zoom="13"
		:center="center"
		:style="`width: ${mapWidth}; height: ${mapHeight}`"
	>
		<l-tile-layer
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		></l-tile-layer>
		<slot v-if="ready"></slot>
	</l-map>
</template>

<script>
/* eslint-disable no-undef */
import { LMap, LTileLayer, propsBinder } from 'vue2-leaflet';
import { DomEvent } from 'leaflet';
import 'leaflet.heat';

const props = {
	center: {
		type: Object,
	},
	initialZoom: {
		type: Number,
		default: () => 13,
	},
	mapType: {
		type: String,
		default: () => 'roadmap',
	},
	width: {
		type: [String, Number],
		default: () => '100%',
	},
	height: {
		type: [String, Number],
		default: () => '100%',
	},
	opacity: {
		type: Number,
		default: () => 1,
	},
	maxIntensity: {
		type: Number,
		default: () => 5,
	},
	points: {
		type: Array,
		default: () => [],
		custom: false,
	},
	minOpacity: {
		type: Number,
		custom: true,
		default: 0.1,
	},
	maxZoom: {
		type: Number,
		custom: true,
		default: 18,
	},
	radius: {
		type: Number,
		custom: true,
		default: 25,
	},
	blur: {
		type: Number,
		custom: true,
		default: 15,
	},
	max: {
		type: Number,
		custom: true,
		default: 1.0,
	},
	visible: {
		type: Boolean,
		custom: true,
		default: true,
	},
};
export default {
	name: 'LHeatmap',
	props,
	components: { LTileLayer, LMap },
	data() {
		return {
			ready: false,
			parentContainer: {},
		};
	},

	mounted() {
		const options = this.getOptions();
		this.loadHeatMap(options);
	},

	beforeDestroy() {
		this.parentContainer.removeLayer(this);
	},

	computed: {
		mapWidth() {
			if (typeof this.width === 'string') {
				return this.width;
			} else {
				return `${this.width}px`;
			}
		},
		mapHeight() {
			if (typeof this.height === 'string') {
				return this.height;
			} else {
				return `${this.height}px`;
			}
		},
	},

	methods: {
		setMinOpacity(minOpacity) {
			this.mapObject.setOptions({ minOpacity });
		},
		setMaxZoom(maxZoom) {
			this.mapObject.setOptions({ maxZoom });
		},
		setRadius(radius) {
			this.mapObject.setOptions({ radius });
		},
		setBlur(blur) {
			this.mapObject.setOptions({ blur });
		},
		setMax(max) {
			this.mapObject.setOptions({ max });
		},
		setVisible(newVal, oldVal) {
			if (newVal === oldVal) return;
			if (newVal) {
				this.parentContainer.addLayer(this);
			} else {
				this.parentContainer.removeLayer(this);
			}
		},
		addLatLng(value) {
			this.mapObject.addLatLng(value);
		},
		getOptions() {
			const options = {};
			if (this.minOpacity) {
				options.minOpacity = this.minOpacity;
			}
			if (this.maxZoom) {
				options.maxZoom = this.maxZoom;
			}
			if (this.radius) {
				options.radius = this.radius;
			}
			if (this.blur) {
				options.blur = this.blur;
			}
			if (this.max) {
				options.max = this.max;
			}
			return options;
		},
		loadHeatMap(options) {
			this.mapObject = L.heatLayer(this.points, options);
			DomEvent.on(this.mapObject, this.$listeners);
			propsBinder(this, this.mapObject, { ...props, latLng: this.points });
			this.ready = true;
			this.parentContainer = this.$refs.heatmap;
			this.parentContainer.addLayer(this, !this.visible);
		},
	},

	watch: {
		points: function () {
			this.parentContainer.removeLayer(this);
			const options = this.getOptions();
			this.loadHeatMap(options);
		},
	},
};
</script>

<style>
@import 'https://unpkg.com/leaflet/dist/leaflet.css';
</style>
