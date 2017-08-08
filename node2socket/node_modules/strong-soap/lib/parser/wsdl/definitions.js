'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var WSDLElement = require('./wsdlElement');
var Schema = require('../xsd/schema');
var Types = require('./types');
var Message = require('./message');
var PortType = require('./portType');
var Binding = require('./binding');
var Service = require('./service');
var Documentation = require('./documentation');

var Definitions = function (_WSDLElement) {
  _inherits(Definitions, _WSDLElement);

  function Definitions(nsName, attrs, options) {
    _classCallCheck(this, Definitions);

    var _this = _possibleConstructorReturn(this, (Definitions.__proto__ || Object.getPrototypeOf(Definitions)).call(this, nsName, attrs, options));

    _this.messages = {};
    _this.portTypes = {};
    _this.bindings = {};
    _this.services = {};
    _this.schemas = {};
    return _this;
  }

  _createClass(Definitions, [{
    key: 'addChild',
    value: function addChild(child) {
      var self = this;
      if (child instanceof Types) {
        // Merge types.schemas into definitions.schemas
        _.merge(self.schemas, child.schemas);
      } else if (child instanceof Message) {
        self.messages[child.$name] = child;
      } else if (child.name === 'import') {
        //create a Schema element for the <import ../>. targetNamespace is the 'namespace' of the <import  />  element in the wsdl.
        self.schemas[child.$namespace] = new Schema('xs:schema', { targetNamespace: child.$namespace });
        self.schemas[child.$namespace].addChild(child);
      } else if (child instanceof PortType) {
        self.portTypes[child.$name] = child;
      } else if (child instanceof Binding) {
        if (child.transport === 'http://schemas.xmlsoap.org/soap/http' || child.transport === 'http://www.w3.org/2003/05/soap/bindings/HTTP/') self.bindings[child.$name] = child;
      } else if (child instanceof Service) {
        self.services[child.$name] = child;
      } else if (child instanceof Documentation) {}
    }
  }]);

  return Definitions;
}(WSDLElement);

Definitions.elementName = 'definitions';
Definitions.allowedChildren = ['types', 'message', 'portType', 'binding', 'service', 'import', 'documentation', 'import', 'any'];

module.exports = Definitions;