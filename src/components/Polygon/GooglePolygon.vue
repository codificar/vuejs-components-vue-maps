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
      v-for="polygon in polygons"
      :key="polygon.id"
      :paths="polygon.paths"
      :editable="polygon.editable"
      :options="polygonOptions(polygon)"
      @paths_changed="updateEdited($event, polygon.id)"
      ref="polygon"
      @click="handlePolygonClick(polygon.id)"
    ></gmap-polygon>
    <div v-if="selectedPolygons.length > 0" class="delete-button">
      <button class="delete-button__button delete-button__button--red" @click="deleteSelectedPolygons">Excluir Polígono</button>
    </div>
  </gmap-map>
</template>

<style>
.delete-button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
}

.delete-button__button--red {
  background-color: red;
  color: black;
  border-radius: 5px;
  padding: 5px;
  margin-right: 15px;
}

</style>

<script>
/* eslint-disable no-undef */
import EventBus from 'src/utils/eventBus.js';
import { v4 as uuidv4 } from 'uuid';

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
      polygons: [],
      selectedPolygons: [],
      showDeleteButton: false,
    };
  },

  created() {
    this.polygons = this.areaPoints.map((polygon) => ({
      id: uuidv4(),
      paths: polygon,
      editable: false,
      isSelected: false,
    }));
  },

  mounted() {
    this.loadMapDrawingManager();
  },

  methods: {
    savePolygon(paths) {
      const newPolygon = {
        id: uuidv4(),
        paths: paths,
        editable: false,
        isSelected: false,
      };
      const coordinates = [];

      for (let i = 0; i < paths[0].g.length; i++) {
        const latitude = paths[0].g[i].lat();
        const longitude = paths[0].g[i].lng();
        coordinates.push({ lat: latitude, lng: longitude });
      }
      this.areaPoints.push(coordinates);

      this.polygons.push(newPolygon);
      EventBus.$emit('update:area-points', this.areaPoints);
    },

    updateEdited(allPolygons, id) {
      const editedPaths = [];

      for (let i = 0; i < allPolygons.getLength(); i++) {
        const path = [];
        const selectedPath = allPolygons.getAt(i);

        for (let j = 0; j < selectedPath.getLength(); j++) {
          const point = selectedPath.getAt(j);
          path.push({ lat: point.lat(), lng: point.lng() });
        }

        editedPaths.push(path);
      }

      const index = this.polygons.findIndex((polygon) => polygon.id === id);
      this.$set(this.polygons, index, { id: id, paths: editedPaths[0], editable: false, isSelected: false });

      const formattedPaths = editedPaths[0].map((point) => `(${point.lat},${point.lng})`).join(',');

      this.areaPoints.splice(index, 1, formattedPaths);
      EventBus.$emit('update:area-points', this.areaPoints);
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
            fillColor: '#999999',
            fillOpacity: 0.7,
            strokeColor: '#000',
            strokeWeight: 4,
            editable: false,
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
            self.savePolygon(paths);
          },
        );

        google.maps.event.addListener(
          drawingManager,
          'polygoncomplete',
          function (polygon) {
            drawingManager.setOptions({
              drawingControl: isDraw,
              editable: false,
            });

            const coordinates = polygon
              .getPath()
              .getArray()
              .map((point) => [point.lng(), point.lat()]);

            self.emitGeoJson(coordinates);
          },
        );
        self.drawingManager = drawingManager;
      });
    },

    handlePolygonClick(id) {
      const clickedPolygon = this.polygons.find((polygon) => polygon.id === id);

      if (clickedPolygon) {
        if (clickedPolygon.isSelected) {
          clickedPolygon.isSelected = false;
          clickedPolygon.editable = false;
          this.selectedPolygons = this.selectedPolygons.filter((polygon) => polygon.id !== id);
        } else {
          this.polygons.forEach((polygon) => {
            polygon.isSelected = false;
            polygon.editable = false;
          });
          clickedPolygon.isSelected = true;
          clickedPolygon.editable = true;
          this.selectedPolygons.push(clickedPolygon);
        }
      }
    },

    polygonOptions(polygon) {
      const options = {
        fillColor: polygon.isSelected ? 'rgba(255, 0, 0, 0.3)' : '#999999',
        fillOpacity: 0.7,
        strokeColor: '#000',
        strokeWeight: 4,
        editable: polygon.editable,
      };

      return options;
    },

    deleteSelectedPolygons() {
      const indices = this.selectedPolygons.map((polygon) =>
        this.polygons.findIndex((p) => p.id === polygon.id)
      );

      indices.sort((a, b) => b - a); 

      for (const index of indices) {
        this.polygons.splice(index, 1);
        this.areaPoints.splice(index, 1);
      }

      this.selectedPolygons = [];
      EventBus.$emit('update:area-points', this.areaPoints);
    },
  },
};
</script>
