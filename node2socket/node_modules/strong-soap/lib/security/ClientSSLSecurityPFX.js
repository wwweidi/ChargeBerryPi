'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('../globalize');
var fs = require('fs'),
    https = require('https'),
    _ = require('lodash'),
    Security = require('./security');

var ClientSSLSecurityPFX = function (_Security) {
  _inherits(ClientSSLSecurityPFX, _Security);

  /**
   * activates SSL for an already existing client using a PFX cert
   *
   * @module ClientSSLSecurityPFX
   * @param {Buffer|String}   pfx
   * @param {String}   passphrase
   * @constructor
   */
  function ClientSSLSecurityPFX(pfx, passphrase, options) {
    _classCallCheck(this, ClientSSLSecurityPFX);

    var _this = _possibleConstructorReturn(this, (ClientSSLSecurityPFX.__proto__ || Object.getPrototypeOf(ClientSSLSecurityPFX)).call(this, options));

    if ((typeof passphrase === 'undefined' ? 'undefined' : _typeof(passphrase)) === 'object') {
      options = passphrase;
    }
    if (pfx) {
      if (Buffer.isBuffer(pfx)) {
        _this.pfx = pfx;
      } else if (typeof pfx === 'string') {
        _this.pfx = fs.readFileSync(pfx);
      } else {
        throw new Error(g.f('supplied {{pfx}} file should be a {{buffer}} or a file location'));
      }
    }

    if (passphrase) {
      if (typeof passphrase === 'string') {
        _this.passphrase = passphrase;
      }
    }
    _this.options = {};
    _.merge(_this.options, options);
    return _this;
  }

  _createClass(ClientSSLSecurityPFX, [{
    key: 'addOptions',
    value: function addOptions(options) {
      options.pfx = this.pfx;
      if (this.passphrase) {
        options.passphrase = this.passphrase;
      }
      _.merge(options, this.options);
      options.agent = new https.Agent(options);
    }
  }]);

  return ClientSSLSecurityPFX;
}(Security);

module.exports = ClientSSLSecurityPFX;