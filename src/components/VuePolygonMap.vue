<script>
import GooglePolygon from './Polygon/GooglePolygon.vue';
import OsmPolygon from './Polygon/OsmPolygon.vue';
import EventBus from 'src/utils/eventBus.js';

import { MapStrategy, Strategy } from '../strategy/MapStrategy';

export default {
	name: 'VuePolygonMap',
	props: {
		provider: {
			type: String,
		},

		center: {
			type: Object,
			default: () => {
				return { lat: 1, lng: 1 };
			},
		},

		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},

		color: {
			type: String,
			default: '#ff000f',
		},
	},
	components: { GooglePolygon, OsmPolygon },

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', () => GooglePolygon);
		const osm = new Strategy('osm', () => OsmPolygon);

		this.strategyManager.addStrategy(google);
		this.strategyManager.addStrategy(osm);
	},

	mounted() {
		EventBus.$on('update:area-points', value =>
			this.$emit('update:area-points', value),
		);
	},

	render(h) {
		const strategy = this.strategyManager.getStrategy(this.provider);
		const mapProvider = strategy.doAction();
		return h(mapProvider, { props: this.$props });
	},
};
</script>
