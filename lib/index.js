"use strict";

// VARIABLES
var dgram = require('dgram'),
	EventEmitter = require('events').EventEmitter,
	util = require('util'),
	dns = require('dns'),
	TypeResolver = require('./typeresolver');

var activeQueries = [];

// SOCKETS
var udpSocket = dgram.createSocket('udp4');
udpSocket.unref();
udpSocket.bind(21943);
udpSocket.on('message', function (buffer, rinfo) {
	for (var i = 0; i < activeQueries.length; i++) {
		var query = activeQueries[i];
		if (
			query.options.address != rinfo.address && query.options.altaddress != rinfo.address
		) continue;
		if (query.options.port_query != rinfo.port) continue;
		query._udpResponse(buffer);
		break;
	}
});
udpSocket.on('error', function (e) {});

// MAIN EXPORT
module.exports = exports = function (options, callback) {
	if (callback) options.callback = callback;

	try {
		var query = TypeResolver(options.type, function (err, query) {
			if (err) throw err;

			query.debug = false;
			query.udpSocket = udpSocket;
			query.type = options.type;

      var split=options.host.split(':')

      options.host = split[0];

      if (!('port_query' in options) && split[1]){
        options.port_query = Number(split[1]);
      }

			if (!('port' in query.options) && ('port_query' in query.options) && !('port_query' in options)) {
				query.options.port = query.options.port_query;
				delete query.options.port_query;
			}

			for (var i in options) query.options[i] = options[i];

			activeQueries.push(query);

			query.on('finished', function (state) {
				var i = activeQueries.indexOf(query);
				if (i >= 0) activeQueries.splice(i, 1);
			});

			process.nextTick(function () {
				query.start();
			});
		});
	} catch (e) {
		process.nextTick(function () {
			callback({
				error: e.message
			});
		});
		return;
	}
};
