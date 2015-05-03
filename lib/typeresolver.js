"use strict";

// VARIABLES
var Path = require('path'),
  fs = require('fs');

// UTILITY FUNCTION
function createProtocolInstance(validType) {
  type = Path.basename(validType);

  var path = './protocols/' + validType;

  if (!fs.existsSync(path + '.js')) throw Error('Protocol not implemented: ' + validType);

  var protocol = require(path);

  return new protocol();
}

// MODULE FUNCTIONALITY EXPORT
module.exports = exports = function(type) {
  if (!type) throw Error('No game given.');

  if(type.substr(0,9) == 'protocol-') {
		return createProtocolInstance(type.substr(9));
	}

  var game = (JSON.parse(Path.normalize(__dirname + '/../games.json')))[type];

  if (!game) throw Error('Invalid game: ' + type);

  var query = createProtocolInstance(game.protocol);
  query.name = game.name;

  for (var key in game.options) {
    query.options[key] = game.options[key];
  }

  for (var key in game.params) {
    query[key] = game.params[key];
  }

  return query;
};
