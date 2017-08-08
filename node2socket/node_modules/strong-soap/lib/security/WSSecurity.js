"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Security = require('./security');
var crypto = require('crypto');
var passwordDigest = require('../utils').passwordDigest;
var validPasswordTypes = ['PasswordDigest', 'PasswordText'];
var toXMLDate = require('../utils').toXMLDate;

var WSSecurity = function (_Security) {
  _inherits(WSSecurity, _Security);

  function WSSecurity(username, password, options) {
    _classCallCheck(this, WSSecurity);

    options = options || {};

    var _this = _possibleConstructorReturn(this, (WSSecurity.__proto__ || Object.getPrototypeOf(WSSecurity)).call(this, options));

    _this._username = username;
    _this._password = password;
    //must account for backward compatibility for passwordType String param as 
    // well as object options defaults: passwordType = 'PasswordText', 
    // hasTimeStamp = true   
    if (typeof options === 'string') {
      _this._passwordType = options ? options : 'PasswordText';
      options = {};
    } else {
      _this._passwordType = options.passwordType ? options.passwordType : 'PasswordText';
    }

    if (validPasswordTypes.indexOf(_this._passwordType) === -1) {
      _this._passwordType = 'PasswordText';
    }

    _this._hasTimeStamp = options.hasTimeStamp || typeof options.hasTimeStamp === 'boolean' ? !!options.hasTimeStamp : true;
    _this._hasTokenCreated = options.hasTokenCreated || typeof options.hasTokenCreated === 'boolean' ? !!options.hasTokenCreated : true;

    /*jshint eqnull:true */
    if (options.hasNonce != null) {
      _this._hasNonce = !!options.hasNonce;
    }
    _this._hasTokenCreated = options.hasTokenCreated || typeof options.hasTokenCreated === 'boolean' ? !!options.hasTokenCreated : true;
    if (options.actor != null) {
      _this._actor = options.actor;
    }
    if (options.mustUnderstand != null) {
      _this._mustUnderstand = !!options.mustUnderstand;
    }
    return _this;
  }

  _createClass(WSSecurity, [{
    key: 'addSoapHeaders',
    value: function addSoapHeaders(headerElement) {
      var secElement = headerElement.element('wsse:Security');
      if (this._actor) {
        secElement.attribute('soap:actor', this._actor);
      }
      if (this._mustUnderstand) {
        secElement.attribute('soap:mustUnderstand', '1');
      }

      secElement.attribute('xmlns:wsse', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-wssecurity-secext-1.0.xsd').attribute('xmlns:wsu', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-wssecurity-utility-1.0.xsd');

      var now = new Date();
      var created = toXMLDate(now);
      var timeStampXml = '';
      if (this._hasTimeStamp) {
        var expires = toXMLDate(new Date(now.getTime() + 1000 * 600));

        var tsElement = secElement.element('wsu:Timestamp').attribute('wsu:Id', 'Timestamp-' + created);
        tsElement.element('wsu:Created', created);
        tsElement.element('wsu:Expires', expires);
      }

      var userNameElement = secElement.element('wsse:UsernameToken').attribute('wsu:Id', 'SecurityToken-' + created);

      userNameElement.element('wsse:Username', this._username);
      if (this._hasTokenCreated) {
        userNameElement.element('wsu:Created', created);
      }

      var nonce;
      if (this._hasNonce || this._passwordType !== 'PasswordText') {
        // nonce = base64 ( sha1 ( created + random ) )
        var nHash = crypto.createHash('sha1');
        nHash.update(created + Math.random());
        nonce = nHash.digest('base64');
      }

      var password;
      if (this._passwordType === 'PasswordText') {
        userNameElement.element('wsse:Password').attribute('Type', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-username-token-profile-1.0#PasswordText').text(this._password);

        if (nonce) {
          userNameElement.element('wsse:Nonce').attribute('EncodingType', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-soap-message-security-1.0#Base64Binary').text(nonce);
        }
      } else {
        userNameElement.element('wsse:Password').attribute('Type', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-username-token-profile-1.0#PasswordDigest').text(passwordDigest(nonce, created, this._password));

        userNameElement.element('wsse:Nonce').attribute('EncodingType', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-soap-message-security-1.0#Base64Binary').text(nonce);
      }
    }
  }]);

  return WSSecurity;
}(Security);

module.exports = WSSecurity;