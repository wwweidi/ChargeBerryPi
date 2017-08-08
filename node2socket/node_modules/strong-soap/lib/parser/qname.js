'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var g = require('../globalize');
var assert = require('assert');
var qnameExp = /^(?:\{([^\{\}]*)\})?(?:([^\{\}]+):)?([^\{\}\:]+)$/;

var QName = function () {
  /**
   * Create a new QName
   * - new QName(name)
   * - new QName(nsURI, name)
   * - new QName(nsURI, name, prefix)
   *
   * @param {string} nsURI Namespace URI
   * @param {string} name Local name
   * @param {string} prefix Namespace prefix
   */
  function QName(nsURI, name, prefix) {
    _classCallCheck(this, QName);

    if (arguments.length === 1) {
      assert.equal(typeof nsURI === 'undefined' ? 'undefined' : _typeof(nsURI), 'string', 'The qname must be string in form of {nsURI}prefix:name');
      var qname = void 0;
      if (qname = qnameExp.exec(nsURI)) {
        this.nsURI = qname[1] || '';
        this.prefix = qname[2] || '';
        this.name = qname[3] || '';
      } else {
        throw new Error(g.f('Invalid qname: %s', nsURI));
      }
    } else {
      this.nsURI = nsURI || '';
      this.name = name || '';
      if (!prefix) {
        var parts = this.name.split(':');
        this.name = parts[0];
        this.prefix = parts[1];
      } else {
        this.prefix = prefix || '';
      }
    }
  }

  /**
   * {nsURI}prefix:name
   * @returns {string}
   */


  _createClass(QName, [{
    key: 'toString',
    value: function toString() {
      var str = '';
      if (this.nsURI) {
        str = '{' + this.nsURI + '}';
      }
      if (this.prefix) {
        str += this.prefix + ':';
      }
      str += this.name;
      return str;
    }

    /**
     * Parse a qualified name (prefix:name)
     * @param {string} qname Qualified name
     * @param {string|NamespaceContext} nsURI
     * @returns {QName}
     */

  }], [{
    key: 'parse',
    value: function parse(qname, nsURI) {
      qname = qname || '';
      var result = new QName(qname);
      var uri;
      if (nsURI == null) {
        uri = '';
      } else if (typeof nsURI === 'string') {
        uri = nsURI;
      } else if (typeof nsURI.getNamespaceURI === 'function') {
        uri = nsURI.getNamespaceURI(result.prefix);
      } else {
        uri = '';
      }
      if (uri) {
        result.nsURI = uri;
      }
      return result;
    }
  }]);

  return QName;
}();

module.exports = QName;