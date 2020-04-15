const list = {

	form($e) {// init form
		this.form && this.form($e.find('.app--form'));
	},

	inputfile($e) {// init input:file
		$e.find('.input--file').on('change', function() {
			$(this.dataset.target).val(this.files && this.files.length ? this.files[0].name : '');
		});
	},

	select2($e) {
		if ('select2' in $.fn) {
			$e.find('.input--select').select2({width: '100%', minimumResultsForSearch: 7});
		}
	},

	inputmask($e) {
		if ('Cleave' in window) {
			$e.find('.input--mask').each(function() {
				let options = {};

				switch (this.dataset.mask) {
					case 'credit-card':
						options.creditCard = true;
						break;

					case 'phone':
						options.phone = true;
						break;

					case 'date':
						options.date        = true;
						options.delimiter   = '-';
						options.datePattern = ['Y', 'm', 'd'];
						break;

					case 'number':
						options.numeral            = true;
						options.numeralDecimalMark = '.';
						options.delimiter          = ' ';
						break;

					default:
						options = null;
						break;
				}

				options !== null && new Cleave(this, options);
			});
		}
	}

};

const initplugins = function(container = document.body) {
	const $e = $(container);

	if ($e.length) {
		for (let i in list) {
			list[i].call(this, $e);
		}
	}
}

// add plugin initialize to list
initplugins.add = function(name, fn) {
	!(name in list) && (list[name] = fn);
}

export default initplugins;