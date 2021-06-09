<template>
	<gmap-map
		ref="map"
		:center="center"
		:zoom="zoom"
		:options="{
			scrollwheel: scrollwheel,
			zoomControl: zoomControl,
			mapTypeControl: mapTypeControl,
			scaleControl: scaleControl,
			streetViewControl: streetViewControl,
			rotateControl: rotateControl,
			fullscreenControl: fullscreenControl,
		}"
		style="width: 100%; height: 100%"
	>
		<gmap-polygon
			v-for="poly in polygons"
			:paths="poly"
			v-bind:key="poly.id"
			:editable="false"
			@paths_changed="updateEdited($event, poly.id)"
			:options="{
				fillColor: poly.fillColor,
				fillOpacity: poly.fillOpacity,
				strokeOpacity: 0.8,
				strokeWeight: 1,
			}"
			ref="polygon"
		></gmap-polygon>
	</gmap-map>
</template>

<style>
.fixo {
	float: right;
	margin-right: 10px;
	margin-top: 0px;
	z-index: 1000;
}
</style>

<script>
/* eslint-disable no-undef */
import EventBus from 'src/utils/eventBus.js';

export default {
	props: {
		/**
		 * The coordinates of the marker
		 */
		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},
		center: {
			type: Object,
		},
		width: {
			type: [String, Number],
			default: () => '100%',
		},
		height: {
			type: [String, Number],
			default: () => '100%',
		},
		color: {
			type: String,
		},
	},

	data() {
		return {
			scrollwheel: true,
			zoom: 12,
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: true,
			streetViewControl: false,
			rotateControl: true,
			fullscreenControl: true,
			edited: null,
			polygons: [],
		};
	},

	created() {
		this.polygons.push(this.coordinates);
	},

	mounted() {
		this.loadMapDrawingManager();
	},

	methods: {
		savePolygon(paths) {
			this.polygons.push(paths);
		},

		emitGeoJson(coordinates) {
			const GeoJson = {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [coordinates],
				},
				properties: {},
			};
			EventBus.$emit('update:area-points', GeoJson);
		},

		loadMapDrawingManager() {
			const self = this;
			this.$gmapApiPromiseLazy().then(() => {
				const drawingManager = new google.maps.drawing.DrawingManager({
					drawingControl: self.coordinates.length ? false : true,
					drawingControlOptions: {
						position: google.maps.ControlPosition.TOP_CENTER,
						drawingModes: [google.maps.drawing.OverlayType.POLYGON],
					},
					polygonOptions: {
						fillColor: '#0099FF',
						fillOpacity: 0.7,
						strokeColor: '#000',
						strokeWeight: 4,
						editable: true,
					},
				});
				drawingManager.setMap(this.$refs.map.$mapObject);

				google.maps.event.addListener(
					drawingManager,
					'overlaycomplete',
					function (event) {
						// Get overlay paths
						let paths = event.overlay.getPaths().getArray();
						// Remove overlay from map
						event.overlay.setMap(null);

						// Disable drawingManager
						drawingManager.setDrawingMode(null);

						// Create Polygon
						self.savePolygon(paths);
					},
				);

				google.maps.event.addListener(
					drawingManager,
					'polygoncomplete',
					function (polygon) {
						drawingManager.setOptions({
							drawingControl: false,
						});

						var coordinates = polygon
							.getPath()
							.getArray()
							.map(point => [point.lng(), point.lat()]);

						// Create Polygon
						self.emitGeoJson(coordinates);
					},
				);
			});
		},
	},

	watch: {
		coordinates: {
			handler: function () {
				if (!this.coordinates.length) {
					this.polygons = [];
					this.loadMapDrawingManager();
				}
			},
			deep: true,
		},
	},
};
</script>
