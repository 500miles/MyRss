var express = require('express');
var router = express.Router();
var util = require('../modules/util');
var fetchUrl = require('../modules/fetchUrl');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
	util.readJson(function(fileData) {

		if (fileData) {
			fileData = util.filter(fileData, {
				"category": "tech",
				"status": "on"
			});

			async.mapLimit(fileData, 10, function(data, callback) {
				fetchUrl(data, callback);
			}, function(err, result) {
				res.render('index', {
					"active": "tech",
					data: result
				});
			});
		} else {
			res.redirect('/settings/add');
		}
	});
});

router.get('/article', function(req, res) {
	util.readJson(function(fileData) {

		if (fileData) {
			fileData = util.filter(fileData, {
				"category": "article",
				"status": "on"
			});

			async.mapLimit(fileData, 10, function(data, callback) {
				fetchUrl(data, callback);
			}, function(err, result) {
				res.render('index', {
					"active": "article",
					data: result
				});
			});
		} else {
			res.redirect('/settings/add');
		}
	});
});

router.get('/settings', function(req, res) {
	util.readJson(function(fileData) {

		if (!fileData) {
			res.redirect('/settings/add');
			return;
		}

		res.render('settings', {
			"active": "settings",
			"navActive": "settings",
			"rss": fileData
		});
	});
});

router.get('/settings/add', function(req, res) {
	var rss = {
		"category": "tech",
		"name": "",
		"title": "",
		"status": "on",
		"url": "",
		"sizzle": ""
	}

	res.render('settings-add', {
		"active": "settings",
		"navActive": "add",
		"updateRss": rss
	});
});

router.get('/settings/list', function(req, res) {
	util.readJson(function(fileData) {

		if (!fileData) {
			res.redirect('/settings/add');
			return;
		}

		res.render('settings-list', {
			"active": "settings",
			"navActive": "list",
			"rss": fileData
		})
	});
});

router.get('/settings/update/:name', function(req, res) {
	util.readJson(function(fileData) {
		var name = req.params.name;

		var rss = util.findDataByName(fileData, name).obj;

		res.render('settings-add', {
			"active": "settings",
			"navActive": "add",
			"updateRss": rss
		});
	});
});

router.post('/setting/setStatus', function(req, res) {
	var status = req.body.status;
	var file = './rssSite_config.json';

	util.readJson(function(fileData) {

		fileData.forEach(function(item) {
			for(var attr in status) {
				if ( item.name.toLowerCase() == attr.toLowerCase() ) {
					item.status = status[attr];

					delete status[attr];
					break;
				}
			}
		});

		util.outputJson(fileData, function() {
			res.redirect('/settings');
		});
	});
});

router.post('/settings/updateRssSource', function(req, res) {
	var rss = req.body.rss;

	util.readJson(function(fileData) {
		var result = util.findDataByName(fileData, rss.name);

		if ( result ) {
			util.updateData(fileData, result.index, rss, function() {
				res.redirect('/settings/list');
			});
		} else {
			util.addData(fileData, rss, function() {
				res.redirect('/settings/list');
			});
		}
	});
});

router.delete('/settings/deleteRss', function(req, res) {
	var name = req.body.name;

	util.readJson(function(fileData) {
		var result = util.findDataByName(fileData, name);

		if ( result ) {
			fileData.splice(result.index, 1);

			util.outputJson(fileData, function() {
				res.json({
					"code": "1",
					"status": "success",
					"message": "删除成功"
				});
			});
		} else {
			res.json({
				"code": "0",
				"status": "fail",
				"message": "该条数据不存在"
			});
		}
	});
});

module.exports = router;
