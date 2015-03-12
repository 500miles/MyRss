var fs = require('fs-extra');
var file = './rssSite_config.json';

var child_process = require('child_process');
var url = process.env.PORT ? 'http://localhost:' + process.env.PORT : 'http://localhost:3000';
var cmd;

function readJson(callback) {
	fs.readJson(file, function(err, fileData) {
		if (err) console.error(err);

	    callback(fileData);
	});
}

/**
 * 文件操作方法
 */
function addData(fileData, rss, callback) {
	fileData = fileData || [];

	fileData.push(rss);

	outputJson(fileData, callback);
};

function updateData(fileData, index, rss, callback) {
	fileData[index] = rss;

	outputJson(fileData, callback);
}

function outputJson(fileData, callback) {
	fs.outputJson(file, fileData, function(err) {
		if (err) console.error(err);

		callback();
	});
}

/**
 * 数据操作方法
 */
function findDataByName(fileData, value) {
	fileData = fileData || [];

	for (var i = 0; i < fileData.length; i++) {
		if ( fileData[i].name.toLowerCase() == value.toLowerCase() ) {
			return {
				"obj": fileData[i],
				"index": i
			}
		}
	};
}

function filter(fileData, conditions) {
	for (var attr in conditions) {
		fileData = fileData.filter(function(item) {
			return item[attr] == conditions[attr];
		});
	};

	return fileData;
}

function openBrowser () {
	if ( process.platform == 'win32' ) {
	    cmd  = 'start'
	} else if ( process.platform == 'linux' ) {
	    cmd  = 'xdg-open';
	} else if ( process.platform == 'darwin') {
	    cmd = 'open';
	}

	child_process.exec(cmd + ' '+ url);
}

exports.readJson = readJson;
exports.addData = addData;
exports.updateData = updateData;
exports.findDataByName = findDataByName;
exports.filter = filter;
exports.outputJson = outputJson;
exports.openBrowser = openBrowser;
