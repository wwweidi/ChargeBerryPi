'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('../globalize');
var fs = require('fs'),
    https = require('https'),
    _ = require('lodash'),
    Security = require('./security');

var ClientSSLSecurity = function (_Security) {
  _inherits(ClientSSLSecurity, _Security);

  /**
   * activates SSL for an already existing client
   *
   * @module ClientSSLSecurity
   * @param {Buffer|String}   key
   * @param {Buffer|String}   cert
   * @param {Buffer|String|Array}   [ca]
   * @param {Object}          [options]
   * @constructor
   */
  function ClientSSLSecurity(key, cert, ca, options) {
    _classCallCheck(this, ClientSSLSecurity);

    var _this = _possibleConstructorReturn(this, (ClientSSLSecurity.__proto__ || Object.getPrototypeOf(ClientSSLSecurity)).call(this, options));

    if (key) {
      if (Buffer.isBuffer(key)) {
        _this.key = key;
      } else if (typeof key === 'string') {
        _this.key = fs.readFileSync(key);
      } else {
        throw new Error(g.f('{{key}} should be a {{buffer}} or a {{string}}!'));
      }
    }

    if (cert) {
      if (Buffer.isBuffer(cert)) {
        _this.cert = cert;
      } else if (typeof cert === 'string') {
        _this.cert = fs.readFileSync(cert);
      } else {
        throw new Error(g.f('{{cert}} should be a {{buffer}} or a {{string}}!'));
      }
    }

    if (ca) {
      if (Buffer.isBuffer(ca) || Array.isArray(ca)) {
        _this.ca = ca;
      } else if (typeof ca === 'string') {
        _this.ca = fs.readFileSync(ca);
      } else {
        _this.options = ca;
        _this.ca = null;
      }
    }
    return _this;
  }

  _createClass(ClientSSLSecurity, [{
    key: 'addOptions',
    value: function addOptions(options) {
      options.key = this.key;
      options.cert = this.cert;
      options.ca = this.ca;
      _.merge(options, this.options);
      options.agent = new https.Agent(options);
    }
  }]);

  return ClientSSLSecurity;
}(Security);

module.exports = ClientSSLSecurity;