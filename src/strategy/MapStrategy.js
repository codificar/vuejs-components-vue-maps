const MapStrategy = class MapStrategy {
	constructor() {
		this._strategies = [];
	}

	addStrategy(strategy) {
		this._strategies = [...this._strategies, strategy];
	}

	getStrategy(name) {
		return this._strategies.find(strategy => strategy._name === name);
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
