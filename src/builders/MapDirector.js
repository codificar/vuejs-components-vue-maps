import OsmMap from '../components/Map/OsmMap';
import GoogleMap from '../components/Map/GoogleMap';

export default class MapDirector {
	constructor(builder) {
		this._builder = builder;
	}

	makeGoogleMap(slots) {
		return this._builder
			.withProvider('google')
			.withMap(GoogleMap)
			.withSlots(slots)
			.build();
	}

	makeOsmMap(slots) {
		return this._builder
			.withProvider('osm')
			.withMap(OsmMap)
			.withSlots(slots)
			.build();
	}
}
