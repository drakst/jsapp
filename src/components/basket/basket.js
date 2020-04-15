export default (function(defaults) {

	let options = defaults;

	const sendToServer = function(data, opts) {

		let serverData = data;

		if (opts.beforeAdd) {
			if (opts.beforeAdd(serverData) === false) {
				return false;
			}
		}

		console.log(serverData);

		return $.post(opts.addUrl, serverData).done(resp => {
			console.log(resp);

			$(opts.countEl).html(resp.count);
		});
	}

	return {

		config(opts = {}) {
			options = $.extend({}, defaults, opts);
		},

		add(data, config = {}) {
			return data ? sendToServer(JSON.stringify(data).indexOf('{') != 0 ? {id: data} : data, $.extend({}, options, config)) : null;
		},

	}

})({
	addUrl:    '/ajax/basket/add',
	countEl:   '.app--basket-count',
	afterAdd:  null,
	beforeAdd: null,
});