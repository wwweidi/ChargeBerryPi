'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

/**
 * Base class for Web Services Security
 */

var Security = function () {
  function Security(options) {
    _classCallCheck(this, Security);

    this.options = options || {};
  }

  _createClass(Security, [{
    key: 'addOptions',
    value: function addOptions(options) {
      _.merge(options, this.options);
    }
  }, {
    key: 'addHttpHeaders',
    value: function addHttpHeaders(headers) {}
  }, {
    key: 'addSoapHeaders',
    value: function addSoapHeaders(headerElement) {}
  }, {
    key: 'postProcess',
    value: function postProcess(envelopeElement, headerElement, bodyElement) {}
  }]);

  return Security;
}();

module.exports = Security;