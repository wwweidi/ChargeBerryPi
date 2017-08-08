'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('../globalize');
var optional = require('optional');
var ursa = optional('ursa');
var fs = require('fs');
var path = require('path');
var SignedXml = require('xml-crypto').SignedXml;
var uuid = require('uuid');
var Security = require('./security');
var xmlHandler = require('../parser/xmlHandler');

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

function dateStringForSOAP(date) {
  return date.getUTCFullYear() + '-' + ('0' + (date.getUTCMonth() + 1)).slice(-2) + '-' + ('0' + date.getUTCDate()).slice(-2) + 'T' + ('0' + date.getUTCHours()).slice(-2) + ":" + ('0' + date.getUTCMinutes()).slice(-2) + ":" + ('0' + date.getUTCSeconds()).slice(-2) + "Z";
}

function generateCreated() {
  return dateStringForSOAP(new Date());
}

function generateExpires() {
  return dateStringForSOAP(addMinutes(new Date(), 10));
}

function insertStr(src, dst, pos) {
  return [dst.slice(0, pos), src, dst.slice(pos)].join('');
}

function generateId() {
  return uuid.v4().replace(/-/gm, '');
}

var WSSecurityCert = function (_Security) {
  _inherits(WSSecurityCert, _Security);

  function WSSecurityCert(privatePEM, publicP12PEM, password, encoding) {
    _classCallCheck(this, WSSecurityCert);

    var _this2 = _possibleConstructorReturn(this, (WSSecurityCert.__proto__ || Object.getPrototypeOf(WSSecurityCert)).call(this));

    if (!ursa) {
      throw new Error(g.f('Module {{ursa}} must be installed to use {{WSSecurityCert}}'));
    }
    _this2.privateKey = ursa.createPrivateKey(privatePEM, password, encoding);
    _this2.publicP12PEM = publicP12PEM.toString().replace('-----BEGIN CERTIFICATE-----', '').replace('-----END CERTIFICATE-----', '').replace(/(\r\n|\n|\r)/gm, '');

    _this2.signer = new SignedXml();
    _this2.signer.signingKey = _this2.privateKey.toPrivatePem();
    _this2.x509Id = 'x509-' + generateId();

    var references = ['http://www.w3.org/2000/09/xmldsig#enveloped-signature', 'http://www.w3.org/2001/10/xml-exc-c14n#'];

    _this2.signer.addReference('//*[local-name(.)=\'Body\']', references);
    _this2.signer.addReference('//*[local-name(.)=\'Timestamp\']', references);

    var _this = _this2;
    _this2.signer.keyInfoProvider = {};
    _this2.signer.keyInfoProvider.getKeyInfo = function (key) {
      var x509Id = _this.x509Id;
      var xml = '<wsse:SecurityTokenReference>\n    <wsse:Reference URI="' + x509Id + '" ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"/>\n    </wsse:SecurityTokenReference>';
      return xml;
    };
    return _this2;
  }

  _createClass(WSSecurityCert, [{
    key: 'postProcess',
    value: function postProcess(headerElement, bodyElement) {
      this.created = generateCreated();
      this.expires = generateExpires();

      var binaryToken = this.publicP12PEM,
          created = this.created,
          expires = this.expires,
          id = this.x509Id;

      var secElement = headerElement.element('wsse:Security').attribute('xmlns:wsse', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-wssecurity-secext-1.0.xsd').attribute('xmlns:wsu', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-wssecurity-utility-1.0.xsd').attribute('soap:mustUnderstand', '1');
      secElement.element('wsse:BinarySecurityToken').attribute('EncodingType', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-soap-message-security-1.0#Base64Binary').attribute('ValueType', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-x509-token-profile-1.0#X509v3').attribute('wsu:Id', id).text(binaryToken);
      var tsElement = secElement.element('wsu:Timestamp').attribute('wsu:Id', '_1');
      tsElement.element('wsu:Created', created);
      tsElement.element('wsu:Expires', expires);

      var xmlWithSec = headerElement.doc().end({ pretty: true });

      this.signer.computeSignature(xmlWithSec);
      var sig = this.signer.getSignatureXml();

      xmlHandler.parseXml(secElement, sig);
    }
  }]);

  return WSSecurityCert;
}(Security);

module.exports = WSSecurityCert;