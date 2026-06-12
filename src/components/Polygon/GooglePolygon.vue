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

			// Custom drawing state (replaces the removed google.maps.drawing.DrawingManager)
			drawing: false,
			mapObject: null,
			controlContainer: null,
			drawBtn: null,
			finishBtn: null,
			hintLabel: null,
			previewPolygon: null,
			rubberBand: null,
			vertexMarkers: [],
			vertexPath: [],
			cursorLatLng: null,
			clickListener: null,
			dblclickListener: null,
			mousemoveListener: null,
			rightclickListener: null,
			keydownHandler: null,
			clickTimeout: null,
		};
	},

	created() {
		// Only render an existing (already saved) area; an empty array would
		// otherwise create an empty polygon on the map.
		if (this.coordinates && this.coordinates.length) {
			this.polygons.push(this.coordinates);
		}
	},

	mounted() {
		this.initGoogleDraw();
	},

	beforeDestroy() {
		this.teardownDrawing();
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

		/**
		 * Sets up the custom drawing controls once the map instance is ready.
		 * The old DrawingManager was removed from the Maps JS API in v3.65, so we
		 * build our own tool using only stable primitives (map click events,
		 * google.maps.Polygon, google.maps.Marker and a custom map control).
		 */
		initGoogleDraw() {
			const mapComponent = this.$refs.map;
			if (!mapComponent || !mapComponent.$mapPromise) {
				console.error(
					'[GooglePolygon] referência do mapa indisponível; não foi possível iniciar o desenho.',
				);
				return;
			}

			mapComponent.$mapPromise
				.then(map => {
					try {
						this.mapObject = map;
						this.buildControls();

						if (this.coordinates && this.coordinates.length) {
							// Editing an existing area: hide the drawing controls.
							this.hideControls();
						} else {
							this.showControls();
							this.setMode('idle');
						}
					} catch (e) {
						console.error(
							'[GooglePolygon] falha ao inicializar os controles de desenho:',
							e,
						);
					}
				})
				.catch(e =>
					console.error(
						'[GooglePolygon] a API do Google Maps não carregou:',
						e,
					),
				);
		},

		buildControls() {
			if (this.controlContainer) return;

			const container = document.createElement('div');
			container.style.cssText =
				'margin:10px;display:flex;flex-direction:column;gap:5px;align-items:center;';

			const buttonRow = document.createElement('div');
			buttonRow.style.cssText = 'display:flex;gap:6px;align-items:center;';

			this.drawBtn = this.makeButton(
				'✋ Desenhar área',
				'Clique no mapa para adicionar cada vértice da área',
			);
			this.drawBtn.addEventListener('click', () => this.startDrawing());

			this.finishBtn = this.makeButton(
				'✓ Concluir',
				'Concluir o desenho da área (ou dê um duplo-clique no mapa)',
			);
			this.finishBtn.addEventListener('click', () => this.finishDrawing());

			buttonRow.appendChild(this.drawBtn);
			buttonRow.appendChild(this.finishBtn);

			// Short, dismissable usage hint shown only while drawing.
			this.hintLabel = document.createElement('div');
			this.hintLabel.textContent =
				'Clique para adicionar pontos • clique no 1º ponto, duplo-clique ou ✓ para concluir • botão direito desfaz • Esc cancela';
			this.hintLabel.style.cssText =
				'background:rgba(0,0,0,0.72);color:#fff;border-radius:3px;' +
				'padding:5px 9px;font-size:12px;line-height:1.3;max-width:340px;' +
				'text-align:center;font-family:Roboto,Arial,sans-serif;';

			container.appendChild(buttonRow);
			container.appendChild(this.hintLabel);

			this.controlContainer = container;
			this.mapObject.controls[
				google.maps.ControlPosition.TOP_CENTER
			].push(container);
		},

		makeButton(label, title) {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.textContent = label;
			btn.title = title;
			btn.style.cssText =
				'background:#fff;border:1px solid #c0c0c0;border-radius:3px;' +
				'box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;' +
				'font-size:14px;line-height:1;padding:8px 12px;color:#333;' +
				'font-family:Roboto,Arial,sans-serif;';
			return btn;
		},

		setMode(mode) {
			if (!this.drawBtn || !this.finishBtn) return;
			const isDrawing = mode === 'drawing';
			this.drawBtn.style.display = isDrawing ? 'none' : '';
			this.finishBtn.style.display = isDrawing ? '' : 'none';
			if (this.hintLabel) this.hintLabel.style.display = isDrawing ? '' : 'none';
		},

		// Enable "Concluir" only once the area is closeable (>= 3 points).
		updateFinishButtonState() {
			if (!this.finishBtn) return;
			const enabled = this.vertexPath.length >= 3;
			this.finishBtn.disabled = !enabled;
			this.finishBtn.style.opacity = enabled ? '1' : '0.45';
			this.finishBtn.style.cursor = enabled ? 'pointer' : 'not-allowed';
		},

		showControls() {
			if (this.controlContainer) this.controlContainer.style.display = 'flex';
		},

		hideControls() {
			if (this.controlContainer) this.controlContainer.style.display = 'none';
		},

		startDrawing() {
			try {
				this.clearDrawingArtifacts();
				this.drawing = true;
				this.setMode('drawing');
				this.updateFinishButtonState();
				// Crosshair makes it obvious the map is in drawing mode; panning
				// (drag) and zoom keep working normally.
				this.mapObject.setOptions({
					disableDoubleClickZoom: true,
					draggableCursor: 'crosshair',
				});

				this.previewPolygon = new google.maps.Polygon({
					map: this.mapObject,
					paths: [],
					fillColor: '#0099FF',
					fillOpacity: 0.25,
					strokeColor: '#0099FF',
					strokeWeight: 2,
					clickable: false,
				});

				// Rubber-band guide line that follows the cursor: dashed polyline
				// from the last placed vertex to the pointer (and back to the first
				// vertex once there are >= 2 points, previewing the closing edge).
				const dash = {
					path: 'M 0,-1 0,1',
					strokeOpacity: 1,
					strokeColor: '#0099FF',
					scale: 2,
				};
				this.rubberBand = new google.maps.Polyline({
					map: this.mapObject,
					path: [],
					clickable: false,
					strokeOpacity: 0,
					icons: [{ icon: dash, offset: '0', repeat: '11px' }],
				});

				// A click adds a vertex, but a double-click finishes the drawing.
				// Google fires two 'click' events right before 'dblclick', so we
				// defer the vertex insertion and cancel it if a dblclick arrives.
				this.clickListener = this.mapObject.addListener('click', e => {
					const latLng = e.latLng;
					this.clickTimeout = setTimeout(() => this.addVertex(latLng), 220);
				});

				this.dblclickListener = this.mapObject.addListener('dblclick', () => {
					clearTimeout(this.clickTimeout);
					this.finishDrawing();
				});

				// Rubber-band follows the pointer.
				this.mousemoveListener = this.mapObject.addListener('mousemove', e => {
					this.cursorLatLng = e.latLng;
					this.updateRubberBand();
				});

				// Right-click undoes the last placed vertex.
				this.rightclickListener = this.mapObject.addListener(
					'rightclick',
					() => {
						clearTimeout(this.clickTimeout);
						this.undoLastVertex();
					},
				);

				// Esc cancels the whole drawing and returns to the initial state.
				this.keydownHandler = e => {
					if (e.key === 'Escape') this.cancelDrawing();
				};
				document.addEventListener('keydown', this.keydownHandler);
			} catch (e) {
				console.error('[GooglePolygon] erro ao iniciar o desenho:', e);
			}
		},

		updateRubberBand() {
			if (!this.rubberBand) return;
			if (!this.vertexPath.length || !this.cursorLatLng) {
				this.rubberBand.setPath([]);
				return;
			}
			const last = this.vertexPath[this.vertexPath.length - 1];
			const path = [last, this.cursorLatLng];
			// Preview the closing edge back to the first vertex.
			if (this.vertexPath.length >= 2) path.push(this.vertexPath[0]);
			this.rubberBand.setPath(path);
		},

		undoLastVertex() {
			if (!this.drawing || !this.vertexPath.length) return;
			this.vertexPath.pop();
			const marker = this.vertexMarkers.pop();
			if (marker) marker.setMap(null);
			if (this.previewPolygon) this.previewPolygon.setPath(this.vertexPath);
			this.updateRubberBand();
			this.updateFinishButtonState();
		},

		cancelDrawing() {
			if (!this.drawing) return;
			this.stopDrawingListeners();
			this.clearDrawingArtifacts();
			this.drawing = false;
			// No area saved: go back to the initial "Desenhar área" state.
			this.setMode('idle');
		},

		addVertex(latLng) {
			try {
				const isFirst = this.vertexMarkers.length === 0;
				this.vertexPath.push(latLng);
				this.previewPolygon.setPath(this.vertexPath);

				const marker = new google.maps.Marker({
					position: latLng,
					map: this.mapObject,
					// The first vertex is clickable so the user can close the area
					// by clicking it; the rest stay non-clickable so clicks fall
					// through to the map and keep adding points.
					clickable: isFirst,
					cursor: isFirst ? 'pointer' : null,
					zIndex: isFirst ? 10 : 1,
					title: isFirst ? 'Clique para fechar a área' : null,
					icon: isFirst
						? {
								path: google.maps.SymbolPath.CIRCLE,
								scale: 7,
								fillColor: '#ffffff',
								fillOpacity: 1,
								strokeColor: '#0099FF',
								strokeWeight: 3,
						  }
						: {
								path: google.maps.SymbolPath.CIRCLE,
								scale: 5,
								fillColor: '#0099FF',
								fillOpacity: 1,
								strokeColor: '#000',
								strokeWeight: 1,
						  },
				});

				if (isFirst) {
					marker.addListener('click', () => {
						clearTimeout(this.clickTimeout);
						this.finishDrawing();
					});
				}

				this.vertexMarkers.push(marker);
				this.updateRubberBand();
				this.updateFinishButtonState();
			} catch (e) {
				console.error('[GooglePolygon] erro ao adicionar vértice:', e);
			}
		},

		finishDrawing() {
			try {
				if (!this.drawing) return;

				if (this.vertexPath.length < 3) {
					console.error(
						'[GooglePolygon] são necessários ao menos 3 pontos para concluir a área.',
					);
					return;
				}

				// GeoJSON contract: ring of [lng, lat] pairs.
				const coordinates = this.vertexPath.map(p => [p.lng(), p.lat()]);
				// gmap-polygon paths: array of { lat, lng }.
				const paths = this.vertexPath.map(p => ({
					lat: p.lat(),
					lng: p.lng(),
				}));

				this.stopDrawingListeners();
				this.clearDrawingArtifacts();
				this.drawing = false;

				this.savePolygon(paths);
				this.hideControls();
				this.emitGeoJson(coordinates);
			} catch (e) {
				console.error('[GooglePolygon] erro ao concluir o desenho:', e);
			}
		},

		stopDrawingListeners() {
			if (this.clickListener) {
				this.clickListener.remove();
				this.clickListener = null;
			}
			if (this.dblclickListener) {
				this.dblclickListener.remove();
				this.dblclickListener = null;
			}
			if (this.mousemoveListener) {
				this.mousemoveListener.remove();
				this.mousemoveListener = null;
			}
			if (this.rightclickListener) {
				this.rightclickListener.remove();
				this.rightclickListener = null;
			}
			if (this.keydownHandler) {
				document.removeEventListener('keydown', this.keydownHandler);
				this.keydownHandler = null;
			}
			clearTimeout(this.clickTimeout);
			this.clickTimeout = null;
			if (this.mapObject) {
				this.mapObject.setOptions({
					disableDoubleClickZoom: false,
					draggableCursor: null,
				});
			}
		},

		clearDrawingArtifacts() {
			if (this.previewPolygon) {
				this.previewPolygon.setMap(null);
				this.previewPolygon = null;
			}
			if (this.rubberBand) {
				this.rubberBand.setMap(null);
				this.rubberBand = null;
			}
			this.vertexMarkers.forEach(m => m.setMap(null));
			this.vertexMarkers = [];
			this.vertexPath = [];
			this.cursorLatLng = null;
		},

		teardownDrawing() {
			this.stopDrawingListeners();
			this.clearDrawingArtifacts();
		},
	},

	watch: {
		coordinates: {
			handler: function () {
				// Triggered by "Limpar área": reset everything and go back to the
				// initial drawing state so the operator can redraw.
				if (!this.coordinates.length) {
					this.polygons = [];
					this.teardownDrawing();
					this.drawing = false;
					this.showControls();
					this.setMode('idle');
				}
			},
			deep: true,
		},
	},
};
</script>
