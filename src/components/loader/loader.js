/**
 * Toggle loader animation on element
 * @param  {Boolean} state Animation status
 * @param  {String|Element|jQuery} element
 */
export default function(stateAdd, element = document.body) {

	const CSS = {
		state: 'app-loading'
	};

	stateAdd = !!stateAdd;

	$(element).each(function() {
		let $elem   = $(this);
		let $loader = $elem.children('.'+CSS.state);

		if (stateAdd) {

			if (!$loader.length) {
				($elem.css('position') == 'static') && $elem.data('el-static', 1).css('position', 'relative');
				$loader = $('<span/>', {class: CSS.state}).appendTo($elem);
			}

		} else {

			if ($loader.length) {
				$loader.css('opacity', 0);

				setTimeout(() => {
					$elem.data('el-static') && $elem.css('position', 'static');
					$loader.remove();
				}, 500);
			}

		}

		if (this.tagName.toLowerCase() == 'button') {
			this.disabled = stateAdd;
		}
	});

}