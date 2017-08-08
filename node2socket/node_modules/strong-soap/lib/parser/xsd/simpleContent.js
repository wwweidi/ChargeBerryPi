'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');
var Extension = require('./extension');

var SimpleContent = function (_XSDElement) {
  _inherits(SimpleContent, _XSDElement);

  function SimpleContent(nsName, attrs, options) {
    _classCallCheck(this, SimpleContent);

    return _possibleConstructorReturn(this, (SimpleContent.__proto__ || Object.getPrototypeOf(SimpleContent)).call(this, nsName, attrs, options));
  }

  return SimpleContent;
}(XSDElement);

SimpleContent.elementName = 'simpleContent';
SimpleContent.allowedChildren = ['annotation', 'extension', 'restriction'];

module.exports = SimpleContent;