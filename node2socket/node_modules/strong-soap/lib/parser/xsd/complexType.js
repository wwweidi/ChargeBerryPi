'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var Choice = require('./choice');
var Sequence = require('./sequence');
var All = require('./all');
var SimpleContent = require('./simpleContent');
var ComplexContent = require('./complexContent');

var ComplexType = function (_XSDElement) {
  _inherits(ComplexType, _XSDElement);

  function ComplexType(nsName, attrs, options) {
    _classCallCheck(this, ComplexType);

    return _possibleConstructorReturn(this, (ComplexType.__proto__ || Object.getPrototypeOf(ComplexType)).call(this, nsName, attrs, options));
  }

  _createClass(ComplexType, [{
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var descriptor = this.descriptor = new XSDElement.TypeDescriptor();
      if (this.$mixed) {
        descriptor.mixed = true;
      }
      var children = this.children || [];
      var childDescriptor;
      for (var i = 0, child; child = children[i]; i++) {
        childDescriptor = child.describe(definitions);
        if (childDescriptor) {
          descriptor.add(childDescriptor);
        }
      }
      descriptor.name = this.$name || this.name;
      descriptor.xmlns = this.targetNamespace;
      descriptor.isSimple = false;
      return descriptor;
    }
  }, {
    key: 'describeChildren',
    value: function describeChildren(definitions) {
      if (this.descriptor) {
        if (this.descriptor.extension) {
          var extension = this.descriptor.extension;
          var xmlns = extension.xmlns;
          var name = extension.name;
          if (xmlns) {
            var schemas = definitions.schemas;
            if (schemas) {
              var schema = schemas[xmlns];
              if (schema) {
                var complexTypes = schema.complexTypes;
                if (complexTypes) {
                  var type = complexTypes[name];
                  if (type) {
                    if (type.descriptor) {
                      if (!type.descriptor.inheritance) {
                        type.descriptor.inheritance = {};
                      }
                      type.descriptor.inheritance[this.descriptor.name] = this.descriptor;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }]);

  return ComplexType;
}(XSDElement);

ComplexType.elementName = 'complexType';
ComplexType.allowedChildren = ['annotation', 'group', 'sequence', 'all', 'complexContent', 'simpleContent', 'choice', 'attribute', 'attributeGroup', 'anyAttribute'];

module.exports = ComplexType;