/*

Simple JavaScript Inheritance
By John Resig

SOURCE: http://ejohn.org/blog/simple-javascript-inheritance/
LISENCE: MIT

*/

var fnTest = /xyz/.test(function() {
    xyz;
  }) ? /\b_super\b/ : /.*/;

var Class = function() {};

Class.extend = function() {
  var args = Array.prototype.slice.call(arguments);
  var name = 'Class';
  var parent = this;
  var prop = {};
  if (typeof args[0] == 'string') name = args.shift();
  if (args.length >= 2) parent = args.shift();
  prop = args.shift();

  var prototype = {};
  for (var name in parent.prototype) {
    prototype[name] = parent.prototype[name];
  }

  for (var name in prop) {
    if (typeof prop[name] == "function" && fnTest.test(prop[name])) {

      prototype[name] = (function(name, fn) {
        return function() {
          var tmp = this._super;

          if (typeof parent.prototype[name] == 'undefined') {
            if (name == 'init') this._super = parent.prototype.constructor;
            else this._super = function() {
              throw new Error('Called _super in method without a parent');
            }
          } else this._super = parent.prototype[name];

          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      })(name, prop[name]);
    } else {
      prototype[name] = prop[name];
    }
  }

  function Class() {
    if (this.init) this.init.apply(this, arguments);
  }

  Class.prototype = prototype;

  Class.prototype.constructor = Class;

  Class.extend = arguments.callee;

  return Class;
};

module.exports = Class;
