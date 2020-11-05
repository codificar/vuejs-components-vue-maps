<template>
	<component :is="getMap" />
</template>

<script>
import MapDirector from '../builders/MapDirector';
import MapBuilder from '../builders/MapBuilder';

import { MapStrategy, Strategy } from '../strategy/MapStrategy';

export default {
	name: 'VueMaps',
	props: {
		provider: {
			type: String,
			default: 'osm',
		},
	},
	data() {
		return {
			strategyManager: undefined,
		};
	},

	created() {
		this.strategyManager = new MapStrategy();
		const google = new Strategy('google', () =>
			new MapDirector(new MapBuilder()).makeGoogleMap(this.$slots),
		);
		const osm = new Strategy('osm', () =>
			new MapDirector(new MapBuilder()).makeOsmMap(this.$slots),
		);

		this.strategyManager.addStrategy(google);
		this.strategyManager.addStrategy(osm);
	},

	computed: {
		getMap() {
			const strategy = this.strategyManager.getStrategy(this.provider);
			return strategy.doAction();
		},
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
