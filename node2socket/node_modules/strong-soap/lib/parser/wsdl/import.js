'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');

var Import = function (_WSDLElement) {
  _inherits(Import, _WSDLElement);

  function Import(nsName, attrs, options) {
    _classCallCheck(this, Import);

    var _this = _possibleConstructorReturn(this, (Import.__proto__ || Object.getPrototypeOf(Import)).call(this, nsName, attrs, options));

    _this.schemas = {};
    return _this;
  }

  return Import;
}(WSDLElement);

Import.elementName = 'import';

module.exports = Import;