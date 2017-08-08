'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var Sequence = require('./sequence');
var Choice = require('./choice');
var QName = require('../qname');

var Restriction = function (_XSDElement) {
  _inherits(Restriction, _XSDElement);

  function Restriction(nsName, attrs, options) {
    _classCallCheck(this, Restriction);

    return _possibleConstructorReturn(this, (Restriction.__proto__ || Object.getPrototypeOf(Restriction)).call(this, nsName, attrs, options));
  }

  _createClass(Restriction, [{
    key: 'addChild',
    value: function addChild(child) {
      /*
       * simpleType: @base|minExclusive|minInclusive|maxExclusive|maxInclusive|
       *             totalDigits|fractionDigits|length|minLength|maxLength|
       *             enumeration|whiteSpace|pattern
       * simpleContent: @base|minExclusive|minInclusive|maxExclusive|maxInclusive|
       *                totalDigits|fractionDigits|length|minLength|maxLength|
       *                enumeration|whiteSpace|pattern|
       *                attribute|attributeGroup
       * complexContent: @base|minExclusive|minInclusive|maxExclusive|maxInclusive|
       *                 totalDigits|fractionDigits|length|minLength|maxLength|
       *                 enumeration|whiteSpace|pattern|
       *                 group|all|choice|sequence|
       *                 attribute|attributeGroup
       */
      switch (child.name) {
        case 'minExclusive':
        case 'minInclusive':
        case 'maxExclusive':
        case 'maxInclusive':
        case 'totalDigits':
        case 'fractionDigits':
        case 'length':
        case 'minLength':
        case 'maxLength':
        case 'whiteSpace':
        case 'pattern':
          this[child.name] = child.$value;
          break;
        case 'enumeration':
          this[child.name] = this[child.name] || [];
          this[child.name].push(child.$value);
          break;
      }
      if (this.parent.elementName === 'simpleContent') {
        //
      } else if (this.parent.elementName === 'complexContent') {
        //
      }
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var descriptor = this.descriptor = new XSDElement.TypeDescriptor();
      if (this.base) {
        descriptor.add(this.base.describe(definitions));
      }
      return this.describeChildren(definitions, descriptor);
    }
  }, {
    key: 'postProcess',
    value: function postProcess(defintions) {
      if (this.base) return;
      var schemas = defintions.schemas;
      if (this.$base) {
        if (this.parent.name === 'simpleContent' || this.parent.name === 'simpleType') {
          this.base = this.resolveSchemaObject(schemas, 'simpleType', this.$base);
        } else if (this.parent.name === 'complexContent') {
          this.base = this.resolveSchemaObject(schemas, 'complexType', this.$base);
          //
        }
      }
      if (this.base) {
        this.base.postProcess(defintions);
      }
    }
  }]);

  return Restriction;
}(XSDElement);

Restriction.elementName = 'restriction';
Restriction.allowedChildren = ['annotation', 'minExclusive', 'minInclusive', 'maxExclusive', 'maxInclusive', 'totalDigits', 'fractionDigits', 'length', 'minLength', 'maxLength', 'enumeration', 'whiteSpace', 'pattern', 'group', 'all', 'choice', 'sequence', 'attribute', 'attributeGroup'];

module.exports = Restriction;