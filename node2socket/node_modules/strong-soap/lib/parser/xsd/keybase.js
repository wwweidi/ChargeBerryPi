'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('../../globalize');
var XSDElement = require('./xsdElement');

var KeyBase = function (_XSDElement) {
  _inherits(KeyBase, _XSDElement);

  function KeyBase(nsName, attrs, options) {
    _classCallCheck(this, KeyBase);

    var _this = _possibleConstructorReturn(this, (KeyBase.__proto__ || Object.getPrototypeOf(KeyBase)).call(this, nsName, attrs, options));

    _this.selector = null;
    _this.fields = [];
    return _this;
  }

  _createClass(KeyBase, [{
    key: 'addChild',
    value: function addChild(child) {
      if (child.name === 'selector') {
        if (this.selector) {
          g.warn('The key element %s %s MUST contain one and only one selector element', this.nsName, this.$name);
        }
        this.selector = child.$xpath;
      } else if (child.name === 'field') {
        this.fields.push(child.$xpath);
      }
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (!this.selector) {
        g.warn('The key element %s %s MUST contain one and only one selector element', this.nsName, this.$name);
      }
      if (!this.fields.length) {
        g.warn('The key element %s %s MUST contain one or more field elements', this.nsName, this.$name);
      }
    }
  }]);

  return KeyBase;
}(XSDElement);

KeyBase.allowedChildren = ['annotation', 'selector', 'field'];

module.exports = KeyBase;