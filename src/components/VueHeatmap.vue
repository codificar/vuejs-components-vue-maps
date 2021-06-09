<script>
import { MapStrategy, Strategy } from 'src/strategy/MapStrategy';
import GoogleHeatmap from './HeatMap/GoogleHeatmap.vue';
import OsmHeatmap from './HeatMap/OsmHeatmap.vue';

export default {
	name: 'VueHeatmap',
	props: {
		provider: {
			type: String,
			default: 'osm',
		},
		center: {
			type: Object,
			default: () => {
				return { lat: 1, lng: 1 };
			},
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
	data() {
		return {
			strategyManager: undefined,
		};
	},

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', () => GoogleHeatmap);
		const osm = new Strategy('osm', () => OsmHeatmap);

		this.strategyManager.addStrategy(google);
		this.strategyManager.addStrategy(osm);
	},

	render(h) {
		const strategy = this.strategyManager.getStrategy(this.provider);
		const mapProvider = strategy.doAction();
		const provider = this.provider;

		if (this.$slots.default)
			return h(
				mapProvider,
				{ props: this.$props },
				this.$slots.default.map(slot => {
					if (slot.componentOptions) {
						slot.componentOptions.propsData.provider = provider;
					}
					return slot;
				}),
			);
		return h(mapProvider, { props: this.$props });
	},
};
</script>
