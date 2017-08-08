'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');

var Part = function (_WSDLElement) {
  _inherits(Part, _WSDLElement);

  function Part(nsName, attrs, options) {
    _classCallCheck(this, Part);

    return _possibleConstructorReturn(this, (Part.__proto__ || Object.getPrototypeOf(Part)).call(this, nsName, attrs, options));
  }

  _createClass(Part, [{
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this.$element) {
        this.element = this.resolveSchemaObject(definitions.schemas, 'element', this.$element);
      } else if (this.$type) {
        this.type = this.resolveSchemaObject(definitions.schemas, 'type', this.$type);
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      if (this.element) {
        this.descriptor = this.element.describe(definitions);
      } else if (this.type) {
        this.descriptor = this.type.describe(definitions);
      } else {
        this.descriptor = null;
      }
      return this.descriptor;
    }
  }]);

  return Part;
}(WSDLElement);

Part.elementName = 'part';

module.exports = Part;