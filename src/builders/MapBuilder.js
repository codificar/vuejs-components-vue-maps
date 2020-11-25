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

	withProps(props) {
		this._props = props;
		return this;
	}

	build() {
		const Map = this._map;
		const slots = this._slots;
		const provider = this._provider;

		return {
			render(h) {
				return h(
					Map,
					slots.default
						? slots.default.map(slot => {
								if (slot.componentOptions) {
									slot.componentOptions.propsData.provider = provider;
								}
								return slot;
						  })
						: undefined,
				);
			},
		};
	}
}
