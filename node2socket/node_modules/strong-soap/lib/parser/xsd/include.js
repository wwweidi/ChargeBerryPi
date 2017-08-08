'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var XSDElement = require('./xsdElement');

var Include = function (_XSDElement) {
  _inherits(Include, _XSDElement);

  function Include(nsName, attrs, options) {
    _classCallCheck(this, Include);

    return _possibleConstructorReturn(this, (Include.__proto__ || Object.getPrototypeOf(Include)).call(this, nsName, attrs, options));
  }

  return Include;
}(XSDElement);

Include.elementName = 'include';

module.exports = Include;