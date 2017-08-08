'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var helper = require('../helper');
var SimpleType = require('./simpleType');

var Union = function (_XSDElement) {
  _inherits(Union, _XSDElement);

  function Union(nsName, attrs, options) {
    _classCallCheck(this, Union);

    return _possibleConstructorReturn(this, (Union.__proto__ || Object.getPrototypeOf(Union)).call(this, nsName, attrs, options));
  }

  _createClass(Union, [{
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this.memberTypes) return;
      var self = this;
      this.memberTypes = [];
      if (this.$memberTypes) {
        this.$memberTypes.split(/\s+/).filter(Boolean).forEach(function (typeQName) {
          var type = self.resolveSchemaObject(definitions.schemas, 'simpleType', typeQName);
          self.memberTypes.push(type);
        });
      }
      this.children.forEach(function (c) {
        if (c instanceof SimpleType) {
          self.memberTypes.push(c);
        }
      });
    }
  }]);

  return Union;
}(XSDElement);

Union.elementName = 'union';
Union.allowedChildren = ['annotation', 'simpleType'];

module.exports = Union;