'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var Security = require('./security');

var BearerSecurity = function (_Security) {
  _inherits(BearerSecurity, _Security);

  function BearerSecurity(token, options) {
    _classCallCheck(this, BearerSecurity);

    var _this = _possibleConstructorReturn(this, (BearerSecurity.__proto__ || Object.getPrototypeOf(BearerSecurity)).call(this, options));

    _this.token = token;
    return _this;
  }

  _createClass(BearerSecurity, [{
    key: 'addHttpHeaders',
    value: function addHttpHeaders(headers) {
      headers.Authorization = "Bearer " + this.token;
    }
  }]);

  return BearerSecurity;
}(Security);

module.exports = BearerSecurity;