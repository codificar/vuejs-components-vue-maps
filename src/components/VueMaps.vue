<script>
import { MapStrategy, Strategy } from '../strategy/MapStrategy';
import GoogleMap from './Map/GoogleMap.vue';
import OsmMap from './Map/OsmMap.vue';

export default {
	name: 'VueMaps',
	props: {
		provider: {
			type: String,
			default: 'osm',
		},
		center: {
			type: Object,
		},
		centerMarker: {
			type: Object,
		},
	},
	data() {
		return {
			strategyManager: undefined,
		};
	},

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', () => GoogleMap);
		const osm = new Strategy('osm', () => OsmMap);

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

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
