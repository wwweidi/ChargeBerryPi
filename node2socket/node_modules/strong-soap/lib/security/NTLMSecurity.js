'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var Security = require('./security');

var NTLMSecurity = function (_Security) {
  _inherits(NTLMSecurity, _Security);

  function NTLMSecurity(username, password, domain, workstation, wsdlAuthRequired, options) {
    _classCallCheck(this, NTLMSecurity);

    var _this = _possibleConstructorReturn(this, (NTLMSecurity.__proto__ || Object.getPrototypeOf(NTLMSecurity)).call(this, options));

    _this.username = username;
    _this.password = password;
    _this.domain = domain;
    _this.workstation = workstation;
    //set this to true/false if remote WSDL retrieval needs NTLM authentication or not
    _this.wsdlAuthRequired = wsdlAuthRequired;
    return _this;
  }

  _createClass(NTLMSecurity, [{
    key: 'addOptions',
    value: function addOptions(options) {
      options.username = this.username;
      options.password = this.password;
      options.domain = this.domain;
      options.workstation = this.workstation;
      options.wsdlAuthRequired = this.wsdlAuthRequired;
      _.merge(options, this.options);
    }
  }]);

  return NTLMSecurity;
}(Security);

module.exports = NTLMSecurity;