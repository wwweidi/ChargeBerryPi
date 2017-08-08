'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');
var descriptor = require('../xsd/descriptor');
var helper = require('../helper');
var assert = require('assert');
var QName = require('../qname');

var Message = function (_WSDLElement) {
  _inherits(Message, _WSDLElement);

  function Message(nsName, attrs, options) {
    _classCallCheck(this, Message);

    var _this = _possibleConstructorReturn(this, (Message.__proto__ || Object.getPrototypeOf(Message)).call(this, nsName, attrs, options));

    _this.parts = {};
    return _this;
  }

  _createClass(Message, [{
    key: 'addChild',
    value: function addChild(child) {
      if (child.name === 'part') {
        this.parts[child.$name] = child;
      }
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {
      for (var p in this.parts) {
        this.parts[p].postProcess(definitions);
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      this.descriptor = new descriptor.TypeDescriptor();
      for (var part in this.parts) {
        var p = this.parts[part];
        var partDescriptor = p.describe(definitions);
        if (partDescriptor instanceof descriptor.TypeDescriptor) {
          var child = new descriptor.ElementDescriptor(new QName(p.$name), partDescriptor.type, 'unqualified', false);
          child.elements = partDescriptor.elements;
          child.attributes = partDescriptor.attributes;
          this.descriptor.add(child);
        } else {
          this.descriptor.add(partDescriptor);
        }
      }
    }
  }]);

  return Message;
}(WSDLElement);

Message.elementName = 'message';
Message.allowedChildren = ['part', 'documentation'];

module.exports = Message;