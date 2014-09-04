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
	for (var key in secondaryDBkeys) {
		if (secondaryDBkeys.hasOwnProperty(key)) {
			secondaryDBkeys[key] = new RegExp(secondaryDBkeys[key]);
		}
	}

	var primaryDBinit = primaryDB.init,
		primaryDBclose = primaryDB.close,
		primaryDBhelpers = primaryDB.helpers;

	primaryDB.init = function(callback) {
		async.parallel([primaryDBinit, secondaryDB.init], function(err) {
			for (var method in primaryDB) {
				if (primaryDB.hasOwnProperty(method)) {
					if (typeof primaryDB[method] === 'function') {
						(function() {
							var func = primaryDB[method],
								funcSecond = secondaryDB[method];


							primaryDB[method] = function() {
								var args = arguments,
									key = arguments[0];

								for (var match in secondaryDBkeys) {
									if (secondaryDBkeys.hasOwnProperty(match) && typeof key === 'string' && key.match(secondaryDBkeys[match])) {
										console.log(secondaryDBName + ' r/w on ', method, key);
										funcSecond.apply(this, args);
									} else {
										func.apply(this, args);
									}
								}
							}
						}())

					}
				}
			}

			callback(err);
		});
	};

	primaryDB.close = function(callback) {
		async.parallel([primaryDBclose, secondaryDB.close], callback);
	};

	primaryDB.helpers = {};
	primaryDB.helpers[primaryDBName] = primaryDBhelpers[primaryDBName];
	primaryDB.helpers[secondaryDBName] = secondaryDB.helpers[secondaryDBName];
}


var primaryDB = require('./database/' + primaryDBName);

if (secondaryDBName && secondaryDBkeys) {
	setupSecondaryDB();
}

module.exports = primaryDB;