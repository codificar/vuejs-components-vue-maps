<template>
	<div ref="heatmap" :style="`width: ${mapWidth}; height: ${mapHeight}`" />
</template>

<script>
/* eslint-disable no-undef */
export default {
	name: 'google-heatmap',
	props: {
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
		points: {
			type: Array,
			required: true,
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
		heatmapPoints() {
			return this.points.map(
				point => new google.maps.LatLng(point.lat, point.lng),
			);
		},
	},
	mounted() {
		return this.$gmapApiPromiseLazy().then(() => {
			const mapElement = this.$refs.heatmap;
			this.$mapObject = new google.maps.Map(mapElement, {
				zoom: this.initialZoom,
				center: this.center,
				mapTypeId: this.mapType,
			});
			this.$heatmap = new google.maps.visualization.HeatmapLayer({
				data: this.heatmapPoints,
				map: this.$mapObject,
			});
			this.$heatmap.setMap(this.$mapObject);
		});
	},
	watch: {
		center: function() {
			this.$mapObject.setCenter(this.center);
		},
		points: function() {
			this.$heatmap.setMap(null);
			this.$heatmap = new google.maps.visualization.HeatmapLayer({
				data: this.heatmapPoints,
				map: this.$mapObject,
			});
			this.$heatmap.setMap(this.$mapObject);
		},
	},
};
</script>
