export default class MapBuilder {
	constructor() {}

	withProvider(provider) {
		this._provider = provider;
		return this;
	}

	withMap(map) {
		this._map = map;
		return this;
	}

	withSlots(slots) {
		this._slots = slots;
		return this;
	}

	build() {
		const provider = this._provider;
		const Map = this._map;
		const slots = this._slots;

		return {
			render(h) {
				return h(
					Map,
					slots.default.map(slot => {
						if (slot.componentOptions) {
							slot.componentOptions.propsData.provider = provider;
						}
						return slot;
					}),
				);
			},
		};
	}
}
