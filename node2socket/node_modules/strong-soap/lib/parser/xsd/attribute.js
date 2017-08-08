'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var Schema = require('./schema');
var QName = require('../qname');

var Attribute = function (_XSDElement) {
  _inherits(Attribute, _XSDElement);

  function Attribute(nsName, attrs, options) {
    _classCallCheck(this, Attribute);

    return _possibleConstructorReturn(this, (Attribute.__proto__ || Object.getPrototypeOf(Attribute)).call(this, nsName, attrs, options));
  }

  _createClass(Attribute, [{
    key: 'getForm',
    value: function getForm() {
      var parent = this.parent;
      if (parent instanceof Schema) {
        // Global attribute
        return 'qualified';
      }
      if (this.$form) {
        return this.$form;
      }
      while (parent) {
        if (parent instanceof Schema) {
          return parent.$attributeFormDefault || 'unqualified';
        }
        parent = parent.parent;
      }
      return 'unqualified';
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;

      if (this.ref) {
        // Ref to a global attribute
        this.descriptor = this.ref.describe(definitions);
        this.descriptor.form = 'qualified';
      } else {
        var form = this.getForm();
        var qname = this.getQName();
        var isMany = this.isMany();
        var type = this.type;
        var typeQName;
        if (type instanceof QName) {
          typeQName = type;
        } else if (type instanceof XSDElement) {
          typeQName = type.getQName();
        }
        this.descriptor = new XSDElement.AttributeDescriptor(qname, typeQName, form, isMany);
      }
      return this.descriptor;
    }
  }, {
    key: 'postProcess',
    value: function postProcess(defintions) {
      var schemas = defintions.schemas;
      if (this.$ref) {
        this.ref = this.resolveSchemaObject(schemas, 'attribute', this.$ref);
      } else if (this.$type) {
        this.type = this.resolveSchemaObject(schemas, 'type', this.$type);
      }
    }
  }]);

  return Attribute;
}(XSDElement);

Attribute.elementName = 'attribute';
Attribute.allowedChildren = ['annotation', 'simpleType'];

module.exports = Attribute;