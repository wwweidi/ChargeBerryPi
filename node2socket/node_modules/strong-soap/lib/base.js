'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventEmitter = require('events').EventEmitter;
var NamespaceContext = require('./parser/nscontext');
var SOAPElement = require('./soapModel').SOAPElement;
var xmlBuilder = require('xmlbuilder');
var XMLHandler = require('./parser/xmlHandler');

var Base = function (_EventEmitter) {
  _inherits(Base, _EventEmitter);

  function Base(wsdl, options) {
    _classCallCheck(this, Base);

    var _this = _possibleConstructorReturn(this, (Base.__proto__ || Object.getPrototypeOf(Base)).call(this));

    _this.wsdl = wsdl;
    _this._initializeOptions(options);
    _this.soapHeaders = [];
    _this.httpHeaders = {};
    _this.bodyAttributes = [];
    return _this;
  }

  _createClass(Base, [{
    key: 'addSoapHeader',
    value: function addSoapHeader(value, qname) {
      var header = new SOAPElement(value, qname, null);
      return this.soapHeaders.push(header) - 1;
    }
  }, {
    key: 'changeSoapHeader',
    value: function changeSoapHeader(index, value, qname) {
      var header = new SOAPElement(value, qname, null);
      this.soapHeaders[index] = header;
    }
  }, {
    key: 'getSoapHeaders',
    value: function getSoapHeaders() {
      return this.soapHeaders;
    }
  }, {
    key: 'clearSoapHeaders',
    value: function clearSoapHeaders() {
      this.soapHeaders = [];
    }
  }, {
    key: 'setHttpHeader',
    value: function setHttpHeader(name, value) {
      this.httpHeaders[name] = String(value);
    }
  }, {
    key: 'addHttpHeader',
    value: function addHttpHeader(name, value) {
      var val = this.httpHeaders[name];
      if (val != null) {
        this.httpHeaders[name] = val + ', ' + value;
      } else {
        this.httpHeaders[name] = String(value);
      }
    }
  }, {
    key: 'getHttpHeaders',
    value: function getHttpHeaders() {
      return this.httpHeaders;
    }
  }, {
    key: 'clearHttpHeaders',
    value: function clearHttpHeaders() {
      this.httpHeaders = {};
    }
  }, {
    key: '_initializeOptions',
    value: function _initializeOptions(options) {
      options = options || {};
      this.wsdl.options.attributesKey = options.attributesKey || 'attributes';
      this.wsdl.options.envelopeKey = options.envelopeKey || 'soap';
      this.wsdl.options.forceSoapVersion = options.forceSoapVersion;
    }
  }, {
    key: 'findElement',
    value: function findElement(nsURI, name) {
      var schemas = this.wsdl.definitions.schemas;
      var schema = schemas[nsURI];
      return schema && schema.elements[name];
    }
  }, {
    key: 'createNamespaceContext',
    value: function createNamespaceContext(soapNsPrefix, soapNsURI) {
      var nsContext = new NamespaceContext();
      nsContext.declareNamespace(soapNsPrefix, soapNsURI);

      var namespaces = this.wsdl.definitions.xmlns || {};
      for (var prefix in namespaces) {
        if (prefix === '') continue;
        var nsURI = namespaces[prefix];
        switch (nsURI) {
          case "http://xml.apache.org/xml-soap": // apachesoap
          case "http://schemas.xmlsoap.org/wsdl/": // wsdl
          case "http://schemas.xmlsoap.org/wsdl/soap/": // wsdlsoap
          case "http://schemas.xmlsoap.org/wsdl/soap12/": // wsdlsoap12
          case "http://schemas.xmlsoap.org/soap/encoding/": // soapenc
          case "http://www.w3.org/2001/XMLSchema":
            // xsd
            continue;
        }
        if (~nsURI.indexOf('http://schemas.xmlsoap.org/')) continue;
        if (~nsURI.indexOf('http://www.w3.org/')) continue;
        if (~nsURI.indexOf('http://xml.apache.org/')) continue;
        nsContext.addNamespace(prefix, nsURI);
      }
      return nsContext;
    }
  }, {
    key: 'addSoapHeadersToEnvelope',
    value: function addSoapHeadersToEnvelope(soapHeaderElement, xmlHandler) {
      for (var i = 0, n = this.soapHeaders.length; i < n; i++) {
        var soapHeader = this.soapHeaders[i];
        var elementDescriptor = void 0;
        if (_typeof(soapHeader.value) === 'object') {
          if (soapHeader.qname && soapHeader.qname.nsURI) {
            var element = this.findElement(soapHeader.qname.nsURI, soapHeader.qname.name);
            elementDescriptor = element && element.describe(this.wsdl.definitions);
          }
          xmlHandler.jsonToXml(soapHeaderElement, null, elementDescriptor, soapHeader.value);
        } else {
          //soapHeader has XML value
          XMLHandler.parseXml(soapHeaderElement, soapHeader.xml);
        }
      }
    }
  }], [{
    key: 'createSOAPEnvelope',
    value: function createSOAPEnvelope(prefix, nsURI) {
      prefix = prefix || 'soap';
      nsURI = nsURI || 'http://schemas.xmlsoap.org/soap/envelope/';
      var doc = xmlBuilder.create(prefix + ':Envelope', { version: '1.0', encoding: 'UTF-8', standalone: true });
      doc.attribute('xmlns:' + prefix, nsURI);
      var header = doc.element(prefix + ':Header');
      var body = doc.element(prefix + ':Body');
      return {
        body: body,
        header: header,
        doc: doc
      };
    }
  }]);

  return Base;
}(EventEmitter);

module.exports = Base;