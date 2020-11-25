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
		centerMarkerUrl: {
			type: String,
			default: undefined,
		},
	},
	data() {
		return {
			strategyManager: undefined,
		};
	},

	created() {
		this.strategyManager = new MapStrategy();
		/*const google = new Strategy('google', () =>
			new MapDirector(new MapBuilder()).makeGoogleMap(this.$slots),
		);
		const osm = new Strategy('osm', () =>
			new MapDirector(new MapBuilder()).makeOsmMap(this.$slots, this.$props),
		);*/
		const google = new Strategy('google', () => GoogleMap);
		const osm = new Strategy('osm', () => OsmMap);

		this.strategyManager.addStrategy(google);
		this.strategyManager.addStrategy(osm);
	},

	computed: {
		/*getMap() {
			console.log('getting map');
			const strategy = this.strategyManager.getStrategy(this.provider);
			return strategy.doAction();
		},*/
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
