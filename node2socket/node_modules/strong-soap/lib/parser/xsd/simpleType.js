'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var descriptor = require('./descriptor');
var helper = require('../helper');
var xsd = require('../xsd');

var SimpleType = function (_XSDElement) {
  _inherits(SimpleType, _XSDElement);

  function SimpleType(nsName, attrs, options) {
    _classCallCheck(this, SimpleType);

    return _possibleConstructorReturn(this, (SimpleType.__proto__ || Object.getPrototypeOf(SimpleType)).call(this, nsName, attrs, options));
  }

  _createClass(SimpleType, [{
    key: 'addChild',
    value: function addChild(child) {
      this[child.name] = child;
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      var descriptor = this.descriptor = new XSDElement.TypeDescriptor();
      descriptor.name = this.$name || this.name;
      descriptor.xmlns = this.nsURI;
      descriptor.isSimple = true;
      return descriptor;
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this.type !== undefined) return;
      this.type = String; // Default to String
      if (this.targetNamespace === helper.namespaces.xsd) {
        this.type = xsd.getBuiltinType(this.$name).jsType;
        return;
      }
      if (this.restriction) {
        this.restriction.postProcess(definitions);
        if (this.restriction.base) {
          // Use the base type
          this.type = this.restriction.base.type;
        }
      } else if (this.list) {
        this.list.postProcess(definitions);
        if (this.list.itemType) {
          this.list.itemType.postProcess(definitions);
          this.type = [this.list.itemType.type];
        }
      } else if (this.union) {
        var memberTypes = [];
        memberTypes.union = true; // Set the union flag to true
        this.union.postProcess(definitions);
        if (this.union.memberTypes) {
          this.union.memberTypes.forEach(function (t) {
            t.postProcess(definitions);
            memberTypes.push(t.type);
          });
          this.type = memberTypes;
        }
      }
    }
  }]);

  return SimpleType;
}(XSDElement);

SimpleType.elementName = 'simpleType';
SimpleType.allowedChildren = ['annotation', 'list', 'union', 'restriction'];

module.exports = SimpleType;