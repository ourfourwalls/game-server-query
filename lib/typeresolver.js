"use strict";

// VARIABLES
var Path = require('path'),
	fs = require('fs');

// UTILITY FUNCTION
function createProtocolInstance(validType) {
	var type = Path.basename(validType);

	var path = Path.normalize(__dirname + '/protocols/' + type);

	if (!fs.existsSync(path + '.js')) throw Error('Protocol not implemented: ' + path);

	var protocol = require(path);

	return new protocol();
}

// MODULE FUNCTIONALITY EXPORT
module.exports = exports = function (type, callback) {
	if (!type) {
		callback("No game given", {})
		return;
	}

	if (type.substr(0, 9) == 'protocol-') {
		try {
			var instance = createProtocolInstance(type.substr(9));
			callback(null, instrance);
		} catch (err) {
			callback(null, err);
		}
		return;
	}

	fs.readFile(Path.normalize(__dirname + '/../games.json'), function (err, data) {
		if (err) {
			callback(err, {})
			return;
		}

		var game = (JSON.parse(data))[type];

		if (!game) {
			callback('Invalid game: ' + type, {});
			return;
		}

		try {
			var query = createProtocolInstance(game.protocol);
			query.name = game.name;

			for (var key in game.options) {
				query.options[key] = game.options[key];
			}

			for (var key in game.params) {
				query[key] = game.params[key];
			}

			callback(null, query);
			return;
		} catch (err) {
			callback(err, query);
			return;
		}
	});
};
