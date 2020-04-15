import initPlugins from './components/core/initplugins'

export default {

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