const Promise = require('bluebird');
const Handlebars = require('handlebars');
const marked = require('marked');

const plugin = (plugin, markserv) => {
	const markdownToHtml = markdownText => new Promise((resolve, reject) => {
		marked(markdownText, (err, html) => {
			if (err) {
				return reject(err);
			}
			resolve(html);
		});
	});

	const compileTemplate = markDownHtml => new Promise(resolve => {
		const model = {
			markdown: markDownHtml,
			markserv: markserv.MarkconfJs
		};
		const template = Handlebars.compile(plugin.template);
		const result = template(model);
		resolve(result);
	});

	const preparePayload = compiledHtml => new Promise(resolve => {
		const payload = {
			statusCode: 200,
			contentType: 'text/html',
			data: compiledHtml
		};
		resolve(payload);
	});

	// main plugin function responds to a http request
	// main MUST always returns a promise
	return request => new Promise((resolve, reject) => {
		markserv.helpers.readfile(request)
		.then(markdownToHtml)
		.then(compileTemplate)
		.then(preparePayload)
		.then(payload => {
			markserv.log.trace(request);
			resolve(payload);
		})
		.catch(err => {
			markserv.log.error(request +': '+ err);
			reject(err);
		});
	});
};

module.exports = {
	name: 'markserv-contrib-mod.markdown',

	// `templatePath` loads into `template` when the server starts up
	// templatePath is relative to the Markconf.js file that loads it
	templateUrl: 'mod.markdown.html',

	// main plugin function responds to a http request
	// main MUST always returns a promise
	plugin
};
