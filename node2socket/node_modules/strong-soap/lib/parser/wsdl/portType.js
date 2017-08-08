'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');

var PortType = function (_WSDLElement) {
  _inherits(PortType, _WSDLElement);

  function PortType(nsName, attrs, options) {
    _classCallCheck(this, PortType);

    return _possibleConstructorReturn(this, (PortType.__proto__ || Object.getPrototypeOf(PortType)).call(this, nsName, attrs, options));
  }

  _createClass(PortType, [{
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this.operations) return;
      this.operations = {};
      var children = this.children;
      if (typeof children === 'undefined') return;
      for (var i = 0, child; child = children[i]; i++) {
        if (child.name !== 'operation') continue;
        child.postProcess(definitions);
        this.operations[child.$name] = child;
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      var operations = {};
      for (var name in this.operations) {
        var method = this.operations[name];
        operations[name] = method.describe(definitions);
      }
      return operations;
    }
  }]);

  return PortType;
}(WSDLElement);

PortType.elementName = 'portType';
PortType.allowedChildren = ['operation', 'documentation'];

module.exports = PortType;