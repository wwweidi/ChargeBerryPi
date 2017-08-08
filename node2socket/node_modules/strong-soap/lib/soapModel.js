'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('assert');
var QName = require('./parser/qname');

/**
 * Representation for soap elements
 */

var SOAPElement = function SOAPElement(value, qname, options) {
  _classCallCheck(this, SOAPElement);

  if (typeof value === 'string' && !qname) {
    this.xml = value;
  } else {
    this.value = value;
    this.qname = qname;
    this.options = options || {};
  }
};

/**
 * Representation for soap attributes
 */


var SOAPAttribute = function () {
  function SOAPAttribute(value, qname) {
    _classCallCheck(this, SOAPAttribute);

    assert(qname, 'qname is required');
    this.value = String(value);
    this.qname = qname;
  }

  _createClass(SOAPAttribute, [{
    key: 'addTo',
    value: function addTo(parent, nsContext, xmlHandler) {
      var nsURI = nsContext.getNamespaceURI(this.qname.prefix);
      if (nsURI === this.qname.nsURI) {
        var name = this.qname.prefix + ':' + this.qname.name;
        parent.attribute(name, this.value);
      } else {
        nsContext.declareNamespace(this.qname.prefix, this.qname.nsURI);
      }
    }
  }]);

  return SOAPAttribute;
}();

exports.SOAPElement = SOAPElement;
exports.SOAPAttribute = SOAPAttribute;