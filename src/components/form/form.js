import appclass from '../core/class'

export default appclass(function(defaults) {

	const redirect = function(url, response) {

		if ('redirect' in response) {
			url = response.redirect;
		}

		if (url == '' || url == true) {
			window.location.reload();
		} else if (url) {
			window.location.href = url.replace(/{[^{}]+}/g, function(key) {
				return response[key.replace(/[{}]+/g, '')] || '';
			});
		}

	}

	const appform = function(targets = defaults.targetSelector) {

		const loader = 'loader' in this ? this.loader : function() {};
		const vars   = defaults;

		$(targets).each(function() {

			if (!this.classList.contains(vars.readyClass)) {
				this.classList.add(vars.readyClass);
			} else return;

			$(this).on('submit', function(e) {
				e.preventDefault();

				let form     = this;
				let $form    = $(form);
				let datasend = null;

				// проверяем не идет ли сейчас отправка формы
				if (!form.classList.contains(vars.workingClass)) {
					form.classList.add(vars.workingClass);
				} else return;

				let recaptchaEl = form.querySelector(vars.recaptchaSelector);
				let loaderEl    = form.querySelector(vars.loaderSelector) || form;

				if (recaptchaEl && JSON.parse(recaptchaEl.dataset.verified) !== true) {
					return;
				}

				let xhrParams = {
					url: form.getAttribute('action'), type: form.method, dataType: 'json'
				};

				if (window.FormData !== void 0 && form.method == 'post') {
					datasend  = new FormData(form);
					xhrParams.processData = false;
					xhrParams.contentType = false;
				} else {
					datasend = $form.serialize();
				}

				$.ajax($.extend(xhrParams, {

					data: datasend,

					beforeSend() {
						loader(true, loaderEl);
						appform.clearErrors(form);
					},

					complete() {
						loader(false, loaderEl);
						form.classList.remove(vars.working);
					},

					success(resp) {

						$form.trigger(vars.successEvent, [resp, $form]);

						if (resp) {

							if (resp.error && Object.keys(resp).length) {

								$form.trigger(vars.respErrorEvent, [resp, $form]);
								appform.setErrors(resp.error, form, form.dataset.name);

								$form.find('.has-error:first').find('input, select, textarea').focus(); // autofocus first error

							} else {

								$form.trigger(vars.respSuccessEvent, [resp, $form]);

								let redirectDelay = -1;

								/*if (form.dataset.notifySuccess !== void 0 && app.notify !== void 0) {
									app.notify(form.dataset.notifySuccess);
									redirectDelay = 3500;
								}*/

								setTimeout(function() {
									redirect(form.dataset.redirect, resp);
								}, redirectDelay);

								// close form modal wrapper if exist
								if ($form.closest('.fancybox-slide').length && form.dataset.notClose === void 0) {
									$.fancybox.close();
								}

							}

						}

					},

					error() {
						$form.trigger(vars.errorEvent);
					}
				}));

				/*let $editors = $form.find('.article--editor'),
					promises = [];

				if ($editors.length) {
					$editors.each(function() {
						let $elem = $(this);
						let editor = app.editor.get($elem.data('editor'));

						if (editor) {
							promises.push(
								new Promise((resolve, reject) => {
									editor.save().then(function(outputData) {
										console.log(outputData);
										$elem.parent().find('.article--editor-json').val(JSON.stringify(outputData));
										resolve();
									}).catch(function(error) {
										reject(error);
									})
								})
							);
						}
					});
				}

				Promise.all(promises).then(function() {
					$form.ajaxSubmit(options);

					if ('ajaxSubmit' in $form) {
						$form.ajaxSubmit(options);
					} else {
						options.data = $form.serialize();
						$.ajax(options);
					}
				});*/

				return false;
			});

		});
	}

	appform.clearErrors = function($form) {
		$form = $($form);

		$form.find('.form-group.has-error, .form-field.has-error')
			.removeClass('has-error')
			.children('.error-tip')
				.remove();
	}

	/**
	 * Create DOM errors for inputs
	 * @param {Object} errors List of errors {field: error}
	 * @param {jQuery} $form  form target
	 */
	appform.setErrors = function(errors, $form, prefix = null) {

		$form = $($form);

		if (!$form.length) {
			return;
		}

		appform.clearErrors($form);

		if (errors !== null && errors) {
			for (let name in errors) {

				let field = $form[0].querySelector('[name="'+name+'"]');

				if (!field) {

					if (prefix) {
						field = $form[0].querySelector('[name="'+prefix+'['+name+']"]');
					}

					if (!field) {
						field = $form[0].querySelector('[data-name="'+name+'"]');
					}
				}

				if (field) {
					if (field.className.indexOf('form-field') == -1 && field.className.indexOf('form-group') == -1) {
						let $formfield = $(field).closest('.form-field');
						field = $formfield.length ? $formfield[0] : $(field).closest('.form-group')[0];
					}
				}

				if (!field) {
					continue;
				}

				let tip = document.createElement('span');

				tip.title     = errors[name];
				tip.className = 'error-tip';
				tip.innerHTML = errors[name];

				$(field).addClass('has-error').append(tip);
			}
		}
	}

	return appform;

}, {
	readyClass:           'app--form-ready',
	workingClass:         'app--form-working',

	successEvent:         'app.form.success',
	respErrorEvent:       'app.form.resp-error',
	respSuccessEvent:     'app.form.resp-success',
	errorEvent:           'app.form.error',

	recaptchaSelector:    '.form--recaptcha',
	loaderSelector:       '.form--loader',
	targetSelector:       '.app--form',
});