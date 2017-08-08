'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');

var AttributeGroup = function (_XSDElement) {
  _inherits(AttributeGroup, _XSDElement);

  function AttributeGroup(nsName, attrs, options) {
    _classCallCheck(this, AttributeGroup);

    return _possibleConstructorReturn(this, (AttributeGroup.__proto__ || Object.getPrototypeOf(AttributeGroup)).call(this, nsName, attrs, options));
  }

  _createClass(AttributeGroup, [{
    key: 'resolve',
    value: function resolve(schemas) {
      if (this.$ref) {
        this.ref = this.resolveSchemaObject(schemas, 'attributeGroup', this.$ref);
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      if (this.ref) {
        this.descriptor = this.ref.describe(definitions);
      } else {
        this.descriptor = this.describeChildren(definitions);
      }
      return this.descriptor;
    }
  }]);

  return AttributeGroup;
}(XSDElement);

AttributeGroup.elementName = 'attributeGroup';
AttributeGroup.allowedChildren = ['annotation', 'attribute', 'attributeGroup', 'anyAttribute'];

module.exports = AttributeGroup;