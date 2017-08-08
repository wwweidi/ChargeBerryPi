'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');
var helper = require('../helper');
var descriptor = require('./descriptor');

var XSDElement = function (_Element) {
  _inherits(XSDElement, _Element);

  function XSDElement(nsName, attrs, options) {
    _classCallCheck(this, XSDElement);

    return _possibleConstructorReturn(this, (XSDElement.__proto__ || Object.getPrototypeOf(XSDElement)).call(this, nsName, attrs, options));
  }

  _createClass(XSDElement, [{
    key: 'describeChildren',
    value: function describeChildren(definitions, descriptor) {
      var children = this.children || [];
      if (children.length === 0) return descriptor;
      descriptor = descriptor || new XSDElement.TypeDescriptor();

      var isMany = this.isMany();
      var childDescriptor;
      for (var i = 0, child; child = children[i]; i++) {
        childDescriptor = child.describe(definitions);
        if (childDescriptor) {
          descriptor.add(childDescriptor, isMany);
        }
      }
      return descriptor;
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      return this.describeChildren(definitions);
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {}
    // NO-OP


    /**
     * Check if the max occurrence is many
     * @returns {boolean}
     */

  }, {
    key: 'isMany',
    value: function isMany() {
      if (this.$maxOccurs === 'unbounded') return true;
      return Number(this.$maxOccurs) > 0;
    }
  }]);

  return XSDElement;
}(Element);

XSDElement.targetNamespace = Element.namespaces.xsd;
XSDElement.allowedChildren = ['annotation'];

// Descriptors
XSDElement.ElementDescriptor = descriptor.ElementDescriptor;
XSDElement.AttributeDescriptor = descriptor.AttributeDescriptor;
XSDElement.TypeDescriptor = descriptor.TypeDescriptor;

module.exports = XSDElement;