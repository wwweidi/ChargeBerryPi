'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var Extension = require('./extension');

var ComplexContent = function (_XSDElement) {
  _inherits(ComplexContent, _XSDElement);

  function ComplexContent(nsName, attrs, options) {
    _classCallCheck(this, ComplexContent);

    return _possibleConstructorReturn(this, (ComplexContent.__proto__ || Object.getPrototypeOf(ComplexContent)).call(this, nsName, attrs, options));
  }

  _createClass(ComplexContent, [{
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var descriptor = this.descriptor = new XSDElement.TypeDescriptor();
      var children = this.children || [];
      var childDescriptor;
      for (var i = 0, child; child = children[i]; i++) {
        childDescriptor = child.describe(definitions);
        if (childDescriptor) {
          descriptor.add(childDescriptor);
        }
      }
      return descriptor;
    }
  }]);

  return ComplexContent;
}(XSDElement);

ComplexContent.elementName = 'complexContent';
ComplexContent.allowedChildren = ['annotation', 'extension', 'restriction'];

module.exports = ComplexContent;