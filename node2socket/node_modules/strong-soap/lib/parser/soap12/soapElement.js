'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('../element');

var SOAPElement = function (_Element) {
  _inherits(SOAPElement, _Element);

  function SOAPElement(nsName, attrs, options) {
    _classCallCheck(this, SOAPElement);

    var _this = _possibleConstructorReturn(this, (SOAPElement.__proto__ || Object.getPrototypeOf(SOAPElement)).call(this, nsName, attrs, options));

    if (_this.name === 'body' || _this.name === 'header' || _this.name === 'fault' || _this.name === 'headerfault') {
      _this.use = _this.$use;
      if (_this.use === 'encoded') {
        _this.encodingStyle = _this.$encodingStyle;
      }
      // The namespace attribute of soap:body will be used for RPC style
      // operation
      _this.namespace = _this.$namespace;
    }
    return _this;
  }

  return SOAPElement;
}(Element);

SOAPElement.targetNamespace = Element.namespaces.soap12;
SOAPElement.allowedChildren = ['documentation'];

module.exports = SOAPElement;