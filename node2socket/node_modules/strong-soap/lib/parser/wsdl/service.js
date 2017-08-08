'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');
var QName = require('../qname');

var Service = function (_WSDLElement) {
  _inherits(Service, _WSDLElement);

  function Service(nsName, attrs, options) {
    _classCallCheck(this, Service);

    var _this = _possibleConstructorReturn(this, (Service.__proto__ || Object.getPrototypeOf(Service)).call(this, nsName, attrs, options));

    _this.ports = {};
    return _this;
  }

  _createClass(Service, [{
    key: 'postProcess',
    value: function postProcess(definitions) {
      var children = this.children,
          bindings = definitions.bindings;
      if (children && children.length > 0) {
        for (var i = 0, child; child = children[i]; i++) {
          if (child.name !== 'port') continue;
          var bindingName = QName.parse(child.$binding).name;
          var binding = bindings[bindingName];
          if (binding) {
            binding.postProcess(definitions);
            this.ports[child.$name] = {
              location: child.location,
              binding: binding
            };
            children.splice(i--, 1);
          }
        }
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var ports = {};
      for (var name in this.ports) {
        var port = this.ports[name];
        ports[name] = port.binding.describe(definitions);
      }
      this.descriptor = ports;
      return this.descriptor;
    }
  }]);

  return Service;
}(WSDLElement);

Service.elementName = 'service';
Service.allowedChildren = ['port', 'documentation'];

module.exports = Service;