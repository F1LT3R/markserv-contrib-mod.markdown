const Promise = require('bluebird');
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

	// main plugin function responds to a http request
	// main MUST always returns a promise
	return request => new Promise((resolve, reject) => {
		markserv.helpers.readfile(request)
		.then(markdownToHtml)
		.then(markdownHtml => {
			const data = {
				markdown: markdownHtml,
				markserv: markserv.MarkconfJs
			};

			const payload = {
				statusCode: 200,
				contentType: 'text/html',
				data: data
			};

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

	// `templateUrl` loads into `template` when the server starts up
	// templatePath is relative to the Markconf.js file that loads it
	templateUrl: 'mod.markdown.html',

	// main plugin function responds to a http request
	// main MUST always returns a promise
	plugin
};
