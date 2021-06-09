const MapStrategy = class MapStrategy {
	constructor() {
		this._strategies = [];
	}

	addStrategy(strategy) {
		this._strategies = [...this._strategies, strategy];
	}

	getStrategy(name) {
		const strategy = this._strategies.find(strategy => strategy._name === name);
		return strategy
			? strategy
			: this._strategies.find(strategy => strategy._name === 'osm');
	}
};

const Strategy = class Strategy {
	constructor(name, handler) {
		this._name = name;
		this._handler = handler;
	}

	doAction() {
		return this._handler();
	}
};

export { MapStrategy, Strategy };
