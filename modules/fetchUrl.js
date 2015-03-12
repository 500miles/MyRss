var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var fetchUrl = function(data, callback) {
	superagent
		.get(data.url)
		.end(function(err, res) {
			if (err) return console.error(err);

			var $  = cheerio.load(res.text, {decodeEntities: false});

			var result = {
				"name": data.name,
				"title": data.title,
				"cont": []
			};

			$(data.sizzle).each(function(index, el) {
				var $el = $(el);

				var text = $el.html();
				var href = url.resolve(data.url, $el.attr('href'));

				result.cont.push({
					"title": text,
					"url": href
				});
			});

			callback(null, result);
		});
}

module.exports = fetchUrl;
