<template>
	<l-map
		ref="map"
		:zoom="13"
		:center="center"
		:options="{ drawControl: false, selectArea: false }"
		:style="`width: ${mapWidth}; height: ${mapHeight}`"
	>
		<l-tile-layer :url="url" :attribution="attribution" />
		<l-polygon :lat-lngs="coordinates" :color="this.color" />
	</l-map>
</template>

<script>
import { LPolygon, LTileLayer, LMap } from 'vue2-leaflet';
import L from 'leaflet';
// eslint-disable-next-line no-unused-vars
import LeafletDraw from 'leaflet-draw';

import EventBus from 'src/utils/eventBus.js';

export default {
	name: 'OsmPolygon',
	components: { LPolygon, LTileLayer, LMap },
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
			latlngs: this.coordinates ? this.coordinates : [],
			ready: false,
			parentContainer: {},
			url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			attribution:
				'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
		};
	},

	computed: {
		map() {
			return this.$refs.map.mapObject;
		},
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
		initDraw() {
			const { map } = this;
			var editableLayers = new L.FeatureGroup();
			map.addLayer(editableLayers);

			// define custom marker
			var options = {
				position: 'topright',
				draw: {
					polyline: false,
					polygon: {
						allowIntersection: false, // Restricts shapes to simple polygons
						drawError: {
							color: '#ff0000', // Color the shape will turn when intersects
							message: '',
						},
						shapeOptions: {
							color: '#000000',
						},
					},
					circle: false, // Turns off this drawing tool
					rectangle: false,
					marker: false,
					circlemarker: false,
				},
				edit: false,
			};

			// Initialise the draw control and pass it the FeatureGroup of editable layers
			var drawControl = new L.Control.Draw(options);
			map.addControl(drawControl);

			editableLayers = new L.FeatureGroup();
			map.addLayer(editableLayers);

			map.on(L.Draw.Event.CREATED, e => {
				var type = e.layerType,
					layer = e.layer;

				if (type === 'polygon') {
					editableLayers.addLayer(layer);

					drawControl.setDrawingOptions({
						polygon: false,
					});
					map.removeControl(drawControl);
					map.addControl(drawControl);

					// here you can get it in geojson format
					var geojson = layer.toGeoJSON();
					console.log('geo', geojson);
					EventBus.$emit('update:area-points', geojson);
				}
			});
		},
		unloadDraw() {},
	},
	mounted() {
		this.initDraw();
	},
	beforeDestroy() {
		this.unloadDraw();
	},
};
</script>
<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/0.4.2/leaflet.draw.css';
@import 'https://unpkg.com/leaflet/dist/leaflet.css';
</style>
