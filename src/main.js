import app from './app.core'

$.extend(app, {
	form:   require('./components/form/form'),
	loader: require('./components/loader/loader'),
});

app.init();