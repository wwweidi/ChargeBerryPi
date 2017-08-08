'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var QName = require('../qname');
var helper = require('../helper');
var Schema = require('./schema');
var ComplexType = require('./complexType');
var SimpleType = require('./simpleType');

var Element = function (_XSDElement) {
  _inherits(Element, _XSDElement);

  function Element(nsName, attrs, options) {
    _classCallCheck(this, Element);

    return _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this, nsName, attrs, options));
  }

  _createClass(Element, [{
    key: 'addChild',
    value: function addChild(child) {
      this[child.name] = child;
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
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
      var descriptor = this.descriptor = new XSDElement.ElementDescriptor(qname, typeQName, form, isMany);

      if (this.$nillable) {
        descriptor.isNillable = true;
      }

      if (this.ref) {
        // Ref to a global element
        var refDescriptor = this.ref.describe(definitions);
        if (refDescriptor) {
          this.descriptor = descriptor = refDescriptor.clone(isMany);
          if (this.$nillable) {
            descriptor.isNillable = true;
          }
        }
      } else if (this.type) {
        if (this.type instanceof ComplexType) {
          descriptor.isSimple = false;
          var typeDescriptor = this.type.describe(definitions);
          if (typeDescriptor) {
            descriptor.elements = typeDescriptor.elements;
            descriptor.attributes = typeDescriptor.attributes;
            definitions.mixed = typeDescriptor.mixed;
            descriptor.extension = typeDescriptor.extension;
            if (descriptor.extension && descriptor.extension.isSimple === true) {
              descriptor.isSimple = true;
            }
            descriptor.typeDescriptor = typeDescriptor;
          }
        } else if (this.type instanceof SimpleType) {
          descriptor.isSimple = true;
          descriptor.jsType = this.type.jsType;
        }
      } else {
        // anonymous complexType or simpleType
        var children = this.children;
        for (var i = 0, child; child = children[i]; i++) {
          if (child instanceof ComplexType) {
            descriptor.isSimple = false;
            var childDescriptor = child.describe(definitions);
            if (childDescriptor) {
              descriptor.elements = childDescriptor.elements;
              descriptor.attributes = childDescriptor.attributes;
              definitions.mixed = childDescriptor.mixed;
            }
            break;
          } else if (child instanceof SimpleType) {
            descriptor.isSimple = true;
            descriptor.jsType = child.jsType;
          }
        }
      }
      return descriptor;
    }
  }, {
    key: 'postProcess',
    value: function postProcess(defintions) {
      var schemas = defintions.schemas;
      if (this.$ref) {
        this.ref = this.resolveSchemaObject(schemas, 'element', this.$ref);
      } else if (this.$type) {
        this.type = this.resolveSchemaObject(schemas, 'type', this.$type);
      }
      if (this.substitutionGroup) {
        this.substitutionGroup = this.resolveSchemaObject(schemas, 'element', this.$substitutionGroup);
      }
    }
  }, {
    key: 'getForm',
    value: function getForm() {
      var parent = this.parent;
      if (parent instanceof Schema) {
        // Global element
        return 'qualified';
      }
      if (this.$form) {
        return this.$form;
      }
      while (parent) {
        if (parent instanceof Schema) {
          return parent.$elementFormDefault || 'unqualified';
        }
        parent = parent.parent;
      }
      return 'unqualified';
    }
  }]);

  return Element;
}(XSDElement);

Element.elementName = 'element';
Element.allowedChildren = ['annotation', 'complexType', 'simpleType', 'unique', 'key', 'keyref'];

module.exports = Element;