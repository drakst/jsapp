import initPlugins from './components/core/initplugins'

export default {

	whichTransitionEvent() {
		let el = document.createElement('fakeelement');

		let transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd'
		}

		for (let t in transitions) {
			if (el.style[t] !== void 0) {
				return transitions[t];
			}
		}

		return null;
	},

	keygen(prefix) {
		return (prefix ? (prefix + '-') : '') + Math.random().toString(36).substr(2, 10);
	},

	init(options = {}) {

		if (options.modules) {
			for (let moduleName in options.modules) {
				if (moduleName in this && 'defaults' in this[moduleName]) {
					this[moduleName].defaults = $.extend(this[moduleName].defaults, options.modules[moduleName]);
				}
			}
		}

		this.initPlugins();
	},

	initPlugins,
}