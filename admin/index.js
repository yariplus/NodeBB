"use strict";


var admin = {},
	app,
	nconf = require('nconf'),
	express = require('express'),
	path = require('path'),
	fs = require('fs'),
	winston = require('winston');

admin.css = null;

admin.routeStaticDirectory = function(app) {
	app.use(nconf.get('relative_path') + '/admin', express.static(path.join(__dirname, 'public'), {
		maxAge: app.enabled('cache') ? 5184000000 : 0
	}));

	app.get('/admin/stylesheet.css', function(req, res, next) {
		res.type('text/css').send(200, admin.css);
	});

	app.get('/admin/', function(req, res, next) {
		res.render('../../admin/public/templates/index');
	});
};

admin.compileCSS = function() {
	var	parser = new (require('less').Parser)({
		filename: 'less/index.less' ,
		paths: [
			path.join(__dirname, 'less')
		]
	});

	parser.parse(fs.readFileSync('./admin/less/index.less').toString(), function(err, tree) {
		if (err) {
			winston.error('[meta/css] Could not minify ACP LESS/CSS: ' + err.message);
			process.exit();
		}

		admin.css = tree.toCSS({
			cleancss: true
		});
	});
}


module.exports = admin;