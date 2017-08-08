'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SOAPElement = require('./soapElement');
var helper = require('../helper');

/**
 * <soap:header message="qname" part="nmtoken" use="literal|encoded"
 * encodingStyle="uri-list"? namespace="uri"?>*
 *   <soap:headerfault message="qname" part="nmtoken" use="literal|encoded"
 *   encodingStyle="uri-list"? namespace="uri"?/>*
 * <soap:header>
 */

var Header = function (_SOAPElement) {
  _inherits(Header, _SOAPElement);

  function Header(nsName, attrs, options) {
    _classCallCheck(this, Header);

    var _this = _possibleConstructorReturn(this, (Header.__proto__ || Object.getPrototypeOf(Header)).call(this, nsName, attrs, options));

    _this.fault = null;
    return _this;
  }

  _createClass(Header, [{
    key: 'addChild',
    value: function addChild(child) {
      if (child.name === 'headerfault') {
        this.fault = child;
      }
    }
  }]);

  return Header;
}(SOAPElement);

Header.elementName = 'header';
Header.allowedChildren = ['documentation', 'headerFault'];

module.exports = Header;