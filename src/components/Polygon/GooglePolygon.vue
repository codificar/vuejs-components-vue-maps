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
      v-for="(poly, index) in polygons"
      :paths="poly"
      v-bind:key="index"
      :editable="true"
      @paths_changed="updateEdited($event, index)"
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
  name: 'GooglePolygon',
  props: {
    drawControll: {
      type: Boolean,
      default: false,
    },
    areaPoints: {
      type: Array,
      required: true,
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
      drawingManager: null,
      editedPolygons: [],
    };
  },

  created() {
    this.polygons.push(this.areaPoints);
  },

  mounted() {
    this.loadMapDrawingManager();
  },

  methods: {
    savePolygon(paths) {
			this.polygons.push(paths);
		},

    updateEdited(mvcArray, index) {
      const editedPaths = [];

      for (let i = 0; i < mvcArray.getLength(); i++) {
        const path = [];

        for (let j = 0; j < mvcArray.getAt(i).getLength(); j++) {
          const point = mvcArray.getAt(i).getAt(j);
          path.push({ lat: point.lat(), lng: point.lng() });
        }

        editedPaths.push(path);
      }

      this.$set(this.editedPolygons, index, editedPaths);
      console.log(editedPaths);

      this.areaPoints = editedPaths;

      EventBus.$emit("update:area-points", editedPaths);
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
      if (this.drawingManager) {
        return;
      }
      const self = this;
      let isDraw = true;
      if (this.drawControll) {
        isDraw = true;
      } else if (this.areaPoints.length) {
        isDraw = false;
      }
      this.$gmapApiPromiseLazy().then(() => {
        const drawingManager = new google.maps.drawing.DrawingManager({
          drawingControl: isDraw,
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
            let paths = event.overlay.getPaths().getArray();
            if (isDraw) {
              event.overlay.setMap(null);
              drawingManager.setDrawingMode(null);
            }
            console.log(paths, "paths");
            self.savePolygon(paths);
          },
        );

        google.maps.event.addListener(
          drawingManager,
          'polygoncomplete',
          function (polygon) {
            drawingManager.setOptions({
              drawingControl: isDraw,
              editable: true,
            });

            var coordinates = polygon
              .getPath()
              .getArray()
              .map((point) => [point.lng(), point.lat()]);

            self.emitGeoJson(coordinates);
            console.log('aqui')
            google.maps.event.addListener(polygon, 'click', function(event){
              polygon.setEditable(true);
            })
          },
        );
        self.drawingManager = drawingManager;
      });
    },
  },

  watch: {
    areaPoints: {
      handler: function () {
        if (!this.areaPoints.length) {
          this.polygons = [];
          this.loadMapDrawingManager();
        }
      },
      deep: true,
    },
  },
  editedPolygons: {
    handler: function (newVal) {
      const areaPoints = newVal.map((poly) =>
        poly.map((path) => path.map((point) => `${point.lat},${point.lng}`).join(';'))
      );
      this.$emit('update:area-points', areaPoints);
    },
    deep: true,
  },
};
</script>
