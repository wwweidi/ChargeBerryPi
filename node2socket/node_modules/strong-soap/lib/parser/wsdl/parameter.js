'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WSDLElement = require('./wsdlElement');
var QName = require('../qname');
var debug = require('debug')('strong-soap:wsdl:parameter');

/**
 * Base class for Input/Output
 */

var Parameter = function (_WSDLElement) {
  _inherits(Parameter, _WSDLElement);

  function Parameter(nsName, attrs, options) {
    _classCallCheck(this, Parameter);

    return _possibleConstructorReturn(this, (Parameter.__proto__ || Object.getPrototypeOf(Parameter)).call(this, nsName, attrs, options));
  }

  _createClass(Parameter, [{
    key: 'addChild',
    value: function addChild(child) {
      // soap:body
      if (child.name === 'body') {
        this.body = child;
      } else if (child.name === 'header') {
        this.headers = this.headers || [];
        // soap:header
        this.headers.push(child);
      } else if (child.name === 'fault') {
        //Revisit. Never gets executed.
        this.fault = child;
      }
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {
      // portType.operation.*
      if (this.parent.parent.name === 'portType') {
        // Resolve $message
        var messageName = QName.parse(this.$message).name;
        var message = definitions.messages[messageName];
        message.postProcess(definitions);
        this.message = message;
      }

      // binding.operation.*
      if (this.parent.parent.name === 'binding') {
        if (this.body) {
          if (this.body.$parts) {
            this.body.parts = {};
            var parts = this.body.$parts.split(/\s+/);
            for (var i = 0, n = parts.length; i < n; i++) {
              this.body.parts[parts[i]] = this.message.parts[parts[i]];
            }
          } else {
            if (this.message && this.message.parts) {
              this.body.parts = this.message.parts;
            }
          }
        }
        if (this.headers) {
          for (var _i = 0, _n = this.headers.length; _i < _n; _i++) {
            var header = this.headers[_i];
            var _message = void 0;
            if (header.$message) {
              var _messageName = QName.parse(header.$message).name;
              _message = definitions.messages[_messageName];
              if (_message) {
                _message.postProcess(definitions);
              } else {
                debug('Message not found: ', header.$message);
              }
            } else {
              _message = this.message;
            }
            if (header.$part && _message) {
              header.part = _message.parts[header.$part];
            }
          }
        }
        //Revisit.. this.name is always undefined because there is no code which calls addChild(..) with child.name = 'fault.
        //code works inspite of not executing this block. Remove it?
        if (this.name === 'fault') {
          var _message2 = this.fault.parent.message;
          if (_message2) {
            _message2.postProcess(definitions);
            for (var p in _message2.parts) {
              // The fault message MUST have only one part per WSDL 1.1 spec
              this.fault.part = _message2.parts[p];
              break;
            }
          } else {
            debug('Message not found: ', this.fault.$message);
          }
        }
      }
    }
  }]);

  return Parameter;
}(WSDLElement);

Parameter.allowedChildren = ['body', 'SecuritySpecRef', 'documentation', 'header'];

module.exports = Parameter;