'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var WSDLElement = function (_Element) {
  _inherits(WSDLElement, _Element);

  function WSDLElement(nsName, attrs, options) {
    _classCallCheck(this, WSDLElement);

    return _possibleConstructorReturn(this, (WSDLElement.__proto__ || Object.getPrototypeOf(WSDLElement)).call(this, nsName, attrs, options));
  }

  return WSDLElement;
}(Element);

WSDLElement.targetNamespace = Element.namespaces.wsdl;
WSDLElement.allowedChildren = ['documentation'];

module.exports = WSDLElement;