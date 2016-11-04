const Promise = require('bluebird');
const Handlebars = require('handlebars');
const marked = require('marked');

module.exports = (plugin, markserv) => {

  const markdownToHtml = markdownText => {
    return new Promise((resolve, reject) => {
      marked(markdownText, (err, html) => {
        if (err) {
          return reject(err);
        }
        resolve(html);
      });
    });
  };

  const compileTemplate = markDownHtml => {
    return new Promise(resolve => {
      const model = {
        markdown: markDownHtml,
        markserv: plugin.Markconf
      };
      const template = Handlebars.compile(plugin.template);
      const result = template(model);
      resolve(result);
    });
  };

  const preparePayload = compiledHtml => {
    return new Promise(resolve => {
      const payload = {
        statusCode: 200,
        contentType: 'text/html',
        data: compiledHtml
      };
      resolve(payload);
    });
  };

  return request => {
    return new Promise((resolve, reject) => {
      // console.log(plugin.meta);

      markserv.readfile(request)
      .then(markdownToHtml)
      .then(compileTemplate)
      .then(preparePayload)
      .then(payload => {
        markserv.trace(request);
        resolve(payload);
      })
      .catch(err => {
        markserv.error(request +': '+ err);
        reject(err);
      });
    });
  };
};