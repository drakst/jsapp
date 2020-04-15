export default function(fn, options) {
	const plugin = fn(options);
	plugin.defaults = options;
	return plugin;
}