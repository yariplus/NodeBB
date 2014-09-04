"use strict";

var nconf = require('nconf'),
	primaryDBName = nconf.get('database'),
	secondaryDBName = nconf.get('secondary_database'),
	secondaryDBkeys = nconf.get('secondary_db_keys'),
	winston = require('winston'),
	async = require('async');


//temp
secondaryDBkeys = [/uid:\d*:chats[\S]*/]

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

	for (var method in primaryDB) {
		if (primaryDB.hasOwnProperty(method)) {
			if (typeof primaryDB[method] === 'function') {
				var func = primaryDBName[method];

				primaryDB[method] = function() {
					var key = arguments[0];

					for (var match in secondaryDBkeys) {
						if (secondaryDBkeys.hasOwnProperty(match) && key.match(secondaryDBkeys[match])) {
							secondaryDBName[method].apply(this, arguments);
						} else {
							func.apply(this, arguments);
						}
					}
				}
			}
		}
	}
}


var primaryDB = require('./database/' + primaryDBName);

if (secondaryDBName && secondaryModules) {
	setupSecondaryDB();
}

module.exports = primaryDB;