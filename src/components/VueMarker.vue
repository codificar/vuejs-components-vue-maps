<script>
import GoogleMarker from './Marker/GoogleMarker.vue';
import OsmMarker from './Marker/OsmMarker.vue';

import { MapStrategy, Strategy } from '../strategy/MapStrategy';

export default {
	name: 'VueMarker',
	props: {
		/**
		 * The provider of the map
		 */
		provider: {
			type: String,
		},
		/**
		 * The coordinates of the marker
		 */
		coordinates: {
			type: [Object, Array],
			custom: true,
			default: () => [0, 0],
		},
		icon: {
			type: String,
		},
		title: {
			type: String,
		},
		description: {
			type: String,
		},
	},
	components: { GoogleMarker, OsmMarker },

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', () => GoogleMarker);
		const osm = new Strategy('osm', () => OsmMarker);

		this.strategyManager.addStrategy(google);
		this.strategyManager.addStrategy(osm);
	},

	render(h) {
		if (this.provider) {
			const strategy = this.strategyManager.getStrategy(this.provider);
			const marker = strategy.doAction();

			const coordinates = this.coordinates;
			const icon = this.icon;
			const tooltip = this.title;

			if (this.$slots.default) {
				return h(
					marker,
					{ props: { coordinates, tooltip, iconUrl: icon } },
					this.$slots.default.map(slot => slot),
				);
			} else {
				return h(marker, { props: { coordinates, tooltip, iconUrl: icon } });
			}
		}
		return null;
	},
};
</script>
