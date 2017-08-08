'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var helper = require('../helper');
var extend = helper.extend;
var Sequence = require('./sequence');
var Choice = require('./choice');
var QName = require('../qname');

var Extension = function (_XSDElement) {
  _inherits(Extension, _XSDElement);

  function Extension(nsName, attrs, options) {
    _classCallCheck(this, Extension);

    return _possibleConstructorReturn(this, (Extension.__proto__ || Object.getPrototypeOf(Extension)).call(this, nsName, attrs, options));
  }

  _createClass(Extension, [{
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var descriptor = this.descriptor = new XSDElement.TypeDescriptor();
      if (this.base) {
        var baseDescriptor = this.base.describe(definitions);
        descriptor.add(baseDescriptor);
        descriptor.extension = {};
        descriptor.extension.name = baseDescriptor.name;
        descriptor.extension.xmlns = baseDescriptor.xmlns;
        descriptor.extension.isSimple = baseDescriptor.isSimple;
      }
      return this.describeChildren(definitions, descriptor);
    }
  }, {
    key: 'postProcess',
    value: function postProcess(defintions) {
      var schemas = defintions.schemas;
      if (this.$base) {
        this.base = this.resolveSchemaObject(schemas, 'type', this.$base);
      }
    }
  }]);

  return Extension;
}(XSDElement);

Extension.elementName = 'extension';
Extension.allowedChildren = ['annotation', 'group', 'all', 'sequence', 'choice', 'attribute', 'attributeGroup'];

module.exports = Extension;