'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('../../globalize');
var XSDElement = require('./xsdElement');
var helper = require('../helper');
var QName = require('../qname');
var SimpleType = require('./simpleType');

var List = function (_XSDElement) {
  _inherits(List, _XSDElement);

  function List(nsName, attrs, options) {
    _classCallCheck(this, List);

    return _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, nsName, attrs, options));
  }

  _createClass(List, [{
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this.itemType !== undefined) {
        return;
      }
      var self = this;
      if (this.$itemType) {
        var qname = QName.parse(this.$itemType);
        this.itemType = this.resolveSchemaObject(definitions.schemas, 'simpleType', this.$itemType);
      }
      this.children.forEach(function (c) {
        if (c instanceof SimpleType) {
          if (self.$itemType) {
            g.warn('Attribute {{itemType}} is not allowed if the content ' + 'contains a {{simpleType}} element');
          } else if (self.itemType) {
            g.warn('List can only contain one {{simpleType}} element');
          }
          self.itemType = c;
        }
      });
      if (!this.itemType) {
        g.warn('List must have an item type');
      }
    }
  }]);

  return List;
}(XSDElement);

List.elementName = 'list';
List.allowedChildren = ['annotation', 'simpleType'];

module.exports = List;