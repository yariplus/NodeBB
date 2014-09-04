"use strict";

var nconf = require('nconf'),
	primaryDBName = nconf.get('database'),
	secondaryDBName = nconf.get('secondary_database'),
	secondaryDBkeys = nconf.get('secondary_db_keys'),
	winston = require('winston'),
	async = require('async');

if(!primaryDBName) {
	winston.info('Database type not set! Run ./nodebb setup');
	process.exit();
}

function setupSecondaryDB() {
	var secondaryDB = require('./database/' + secondaryDBName);

	secondaryDBkeys = secondaryDBkeys.split(/,\s*/);

	var primaryDBinit = primaryDB.init,
		primaryDBclose = primaryDB.close,
		primaryDBhelpers = primaryDB.helpers;

	primaryDB.init = function(callback) {
		async.parallel([primaryDBinit, secondaryDB.init], callback);
	};

	primaryDB.close = function(callback) {
		async.parallel([primaryDBclose, secondaryDB.close], callback);
	};

	primaryDB.helpers = {};
	primaryDB.helpers[primaryDBName] = primaryDBhelpers[primaryDBName];
	primaryDB.helpers[secondaryDBName] = secondaryDB.helpers[secondaryDBName];
}


var primaryDB = require('./database/' + primaryDBName);

if (secondaryDBName && secondaryModules) {
	setupSecondaryDB();
}

module.exports = primaryDB;