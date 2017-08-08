'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');
var QName = require('../qname');

var Binding = function (_WSDLElement) {
  _inherits(Binding, _WSDLElement);

  function Binding(nsName, attrs, options) {
    _classCallCheck(this, Binding);

    var _this = _possibleConstructorReturn(this, (Binding.__proto__ || Object.getPrototypeOf(Binding)).call(this, nsName, attrs, options));

    _this.transport = '';
    _this.style = '';
    return _this;
  }

  _createClass(Binding, [{
    key: 'addChild',
    value: function addChild(child) {
      // soap:binding
      if (child.name === 'binding') {
        this.transport = child.$transport;
        this.style = child.$style;
      }
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this.operations) return;
      this.operations = {};
      var type = QName.parse(this.$type).name,
          portType = definitions.portTypes[type],
          style = this.style,
          children = this.children;
      if (portType) {
        portType.postProcess(definitions);
        this.portType = portType;

        for (var i = 0, child; child = children[i]; i++) {
          if (child.name !== 'operation') continue;
          var operation = this.portType.operations[child.$name];
          if (operation) {
            this.operations[child.$name] = child;
            child.operation = operation;

            // Set portType.operation.input.message to binding.operation.input
            if (operation.input && child.input) {
              child.input.message = operation.input.message;
            }
            // Set portType.operation.output.message to binding.operation.output
            if (operation.output && child.output) {
              child.output.message = operation.output.message;
            }

            //portType.operation.fault is fully processed with message etc. Hence set to binding.operation.fault
            for (var f in operation.faults) {
              if (operation.faults[f]) {
                child.faults[f] = operation.faults[f];
              }
            }
            if (operation.$parameterOrder) {
              // For RPC style
              child.parameterOrder = operation.$parameterOrder.split(/\s+/);
            }
            child.style = child.style || style;
            child.postProcess(definitions);
          }
        }
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var operations = this.descriptor = {};
      for (var name in this.operations) {
        var operation = this.operations[name];
        operations[name] = operation.describe(definitions);
      }
      return operations;
    }
  }]);

  return Binding;
}(WSDLElement);

Binding.elementName = 'binding';
Binding.allowedChildren = ['binding', 'SecuritySpec', 'operation', 'documentation'];

module.exports = Binding;