'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('../../globalize');
var WSDLElement = require('./wsdlElement');
var descriptor = require('../xsd/descriptor');
var ElementDescriptor = descriptor.ElementDescriptor;
var TypeDescriptor = descriptor.TypeDescriptor;
var QName = require('../qname');
var helper = require('../helper');
var SimpleType = require('../xsd/simpleType');

var assert = require('assert');

var Style = {
  documentLiteralWrapped: 'documentLiteralWrapped',
  documentLiteral: 'documentLiteral',
  rpcLiteral: 'rpcLiteral',
  rpcEncoded: 'rpcEncoded',
  documentEncoded: 'documentEncoded'
};

var Operation = function (_WSDLElement) {
  _inherits(Operation, _WSDLElement);

  function Operation(nsName, attrs, options) {
    _classCallCheck(this, Operation);

    //there can be multiple faults defined in the operation. They all will have same type name 'fault'
    //what differentiates them from each other is, the element/s which will get added under fault <detail> during runtime.
    var _this = _possibleConstructorReturn(this, (Operation.__proto__ || Object.getPrototypeOf(Operation)).call(this, nsName, attrs, options));

    _this.faults = [];
    _this.soapVersion;
    return _this;
  }

  _createClass(Operation, [{
    key: 'addChild',
    value: function addChild(child) {
      switch (child.name) {
        case 'input':
          this.input = child;
          break;
        case 'output':
          this.output = child;
          break;
        case 'fault':
          this.faults.push(child);
          break;
        case 'operation':
          // soap:operation
          this.soapAction = child.$soapAction || '';
          this.style = child.$style || '';
          //figure out from the binding operation soap version 1.1 or 1.2
          if (child.$soapAction !== undefined) {
            if (child.nsURI === 'http://schemas.xmlsoap.org/wsdl/soap/') {
              this.soapVersion = '1.1';
            } else if (child.nsURI === 'http://schemas.xmlsoap.org/wsdl/soap12/') {
              this.soapVersion = '1.2';
            }
          }
          break;
      }
    }
  }, {
    key: 'postProcess',
    value: function postProcess(definitions) {
      if (this._processed) return; // Already processed
      if (this.input) this.input.postProcess(definitions);
      if (this.output) this.output.postProcess(definitions);
      for (var i = 0, n = this.faults.length; i < n; i++) {
        this.faults[i].postProcess(definitions);
      }
      if (this.parent.name === 'binding') {
        this.getMode();
      }
      this._processed = true;
    }
  }, {
    key: 'describeFaults',
    value: function describeFaults(definitions) {
      var faults = {};
      for (var f in this.faults) {
        var fault = this.faults[f];
        var part = fault.message && fault.message.children[0]; //find the part through Fault message. There is only one part in fault message
        if (part && part.element) {
          faults[f] = part.element.describe(definitions);
        } else {
          g.warn('{{WS-I}} violation: ' + '{{http://ws-i.org/profiles/basicprofile-1.2-2010-11-09.html#BP2113}}' + ' part %s', part.$name);
        }
      }
      return faults;
    }
  }, {
    key: 'describe',
    value: function describe(definitions) {
      if (this.descriptor) return this.descriptor;
      var input, output;
      switch (this.mode) {
        case Style.documentLiteralWrapped:
          if (this.input && this.input.body) {
            for (var p in this.input.body.parts) {
              var wrapperElement = this.input.body.parts[p].element;
              if (wrapperElement) {
                input = wrapperElement.describe(definitions);
              }
              break;
            }
          }
          if (this.output && this.output.body) {
            for (var _p in this.output.body.parts) {
              var _wrapperElement = this.output.body.parts[_p].element;
              if (_wrapperElement) {
                output = _wrapperElement.describe(definitions);
              }
              break;
            }
          }
          break;
        case Style.documentLiteral:
          input = new descriptor.TypeDescriptor();
          output = new descriptor.TypeDescriptor();
          if (this.input && this.input.body) {
            for (var _p2 in this.input.body.parts) {
              var element = this.input.body.parts[_p2].element;
              if (element) {
                input.addElement(element.describe(definitions));
              }
            }
          }
          if (this.output && this.output.body) {
            for (var _p3 in this.output.body.parts) {
              var _element = this.output.body.parts[_p3].element;
              if (_element) {
                output.addElement(_element.describe(definitions));
              }
            }
          }
          break;
        case Style.rpcLiteral:
        case Style.rpcEncoded:
          // The operation wrapper element
          var nsURI = this.input && this.input.body && this.input.body.namespace || this.targetNamespace;
          input = new descriptor.ElementDescriptor(new QName(nsURI, this.$name), null, 'qualified', false);
          output = new descriptor.ElementDescriptor(new QName(nsURI, this.$name + 'Response'), null, 'qualified', false);
          var inputParts = new descriptor.TypeDescriptor();
          var outputParts = new descriptor.TypeDescriptor();
          if (this.input && this.input.body) {
            for (var _p4 in this.input.body.parts) {
              var part = this.input.body.parts[_p4];
              var type = void 0;
              if (part.type) {
                if (part.type instanceof SimpleType) {
                  var qName = new QName(part.type.targetNamespace, part.type.$name, part.type.prefix);
                  type = qName;
                } else {
                  type = part.type.qname;
                }
                var _element2 = new descriptor.ElementDescriptor(new QName(nsURI, _p4), type, 'unqualified', false);
                inputParts.addElement(_element2);
              } else if (part.element) {
                var elementDescriptor = part.element.describe(definitions);
                inputParts.addElement(elementDescriptor);
              }
            }
          }
          if (this.output && this.output.body) {
            for (var _p5 in this.output.body.parts) {
              var _part = this.output.body.parts[_p5];
              var _type = void 0;
              if (_part.type) {
                if (_part.type instanceof SimpleType) {
                  var qName = new QName(_part.type.targetNamespace, _part.type.$name, _part.type.prefix);
                  _type = qName;
                } else {
                  _type = _part.type.qname;
                }
                var _element3 = new descriptor.ElementDescriptor(new QName(nsURI, _p5), _type, 'unqualified', false);
                outputParts.addElement(_element3);
              } else if (_part.element) {
                var _elementDescriptor = _part.element.describe(definitions);
                outputParts.addElement(_elementDescriptor);
              }
            }
          }
          input.elements = inputParts.elements;
          output.elements = outputParts.elements;
          break;
        case Style.documentEncoded:
          throw new Error(g.f('{{WSDL}} style not supported: %s', Style.documentEncoded));
      }

      var faults = this.describeFaults(definitions);
      var inputHeaders = Operation.describeHeaders(this.input, definitions);
      var outputHeaders = Operation.describeHeaders(this.output, definitions);

      this.descriptor = {
        name: this.$name,
        style: this.mode,
        soapAction: this.soapAction,
        soapVersion: this.soapVersion,
        input: {
          body: input,
          headers: inputHeaders
        },
        output: {
          body: output,
          headers: outputHeaders
        },
        faults: {
          body: { Fault: { faults: faults } }
        }
      };
      this.descriptor.inputEnvelope = Operation.createEnvelopeDescriptor(this.descriptor.input, false, this.soapVersion);
      this.descriptor.outputEnvelope = Operation.createEnvelopeDescriptor(this.descriptor.output, true, this.soapVersion);
      this.descriptor.faultEnvelope = Operation.createEnvelopeDescriptor(this.descriptor.faults, true, this.soapVersion);

      return this.descriptor;
    }
  }, {
    key: 'getMode',
    value: function getMode() {
      var use = this.input && this.input.body && this.input.body.use || 'literal';
      if (this.style === 'document' && use === 'literal') {
        // document literal
        var element = null;
        var count = 0;
        if (this.input && this.input.body) {
          for (var p in this.input.body.parts) {
            var part = this.input.body.parts[p];
            element = part.element;
            assert(part.element && !part.type, 'Document/literal part should use element');
            count++;
          }
        }
        // Only one part and the input wrapper element has the same name as
        // operation
        if (count === 1 && element.$name === this.$name) {
          count = 0;
          if (this.output && this.output.body) {
            for (var _p6 in this.output.body.parts) {
              var _part2 = this.output.body.parts[_p6];
              element = _part2.element;
              assert(_part2.element && !_part2.type, 'Document/literal part should use element');
              count++;
            }
          }
          if (count === 1) {
            this.mode = Style.documentLiteralWrapped;
          } else {
            this.mode = Style.documentLiteral;
          }
        } else {
          this.mode = Style.documentLiteral;
        }
      } else if (this.style === 'document' && use === 'encoded') {
        this.mode = Style.documentEncoded;
      } else if (this.style === 'rpc' && use === 'encoded') {
        this.mode = Style.rpcEncoded;
      } else if (this.style === 'rpc' && use === 'literal') {
        this.mode = Style.rpcLiteral;
      }
      return this.mode;
    }
  }], [{
    key: 'describeHeaders',
    value: function describeHeaders(param, definitions) {
      if (param == null) return null;
      var headers = new descriptor.TypeDescriptor();
      if (!param.headers) return headers;
      param.headers.forEach(function (header) {
        var part = header.part;
        if (part && part.element) {
          headers.addElement(part.element.describe(definitions));
        } else if (part && part.type) {
          g.warn('{{WS-I}} violation: ' + '{{http://ws-i.org/profiles/basicprofile-1.2-2010-11-09.html#BP2113}}' + ' part %s', part.$name);
        }
      });
      return headers;
    }
  }, {
    key: 'createEnvelopeDescriptor',
    value: function createEnvelopeDescriptor(parameterDescriptor, isOutput, soapVersion, prefix, nsURI) {
      prefix = prefix || 'soap';
      var soapNsURI;
      if (soapVersion === '1.1') {
        soapNsURI = 'http://schemas.xmlsoap.org/soap/envelope/';
      } else if (soapVersion === '1.2') {
        soapNsURI = 'http://www.w3.org/2003/05/soap-envelope';
      }

      nsURI = nsURI || soapNsURI;
      var descriptor = new TypeDescriptor();

      var envelopeDescriptor = new ElementDescriptor(new QName(nsURI, 'Envelope', prefix), null, 'qualified', false);
      descriptor.add(envelopeDescriptor);

      var headerDescriptor = new ElementDescriptor(new QName(nsURI, 'Header', prefix), null, 'qualified', false);

      var bodyDescriptor = new ElementDescriptor(new QName(nsURI, 'Body', prefix), null, 'qualified', false);

      envelopeDescriptor.addElement(headerDescriptor);
      envelopeDescriptor.addElement(bodyDescriptor);

      //add only if input or output. Fault is list of faults unlike input/output element and fault needs further processing below,
      //before it can be added to the <body>
      if (parameterDescriptor && parameterDescriptor.body && !parameterDescriptor.body.Fault) {
        bodyDescriptor.add(parameterDescriptor.body);
      }

      if (parameterDescriptor && parameterDescriptor.headers) {
        bodyDescriptor.add(parameterDescriptor.headers);
      }

      //process faults. An example of resulting structure of the <Body> element with soap 1.1 <Fault> element descriptor:
      /*
       <soap:Body>
         <soap:Fault>
            <faultcode>sampleFaultCode</faultcode>
            <faultstring>sampleFaultString</faultstring>
            <detail>
              <ns1:myMethodFault1 xmlns:ns1="http://example.com/doc_literal_wrapped_test.wsdl">
                <errorMessage1>MyMethod Business Exception message</errorMessage1>
                <value1>10</value1>
              </ns1:myMethodFault1>
            </detail>
          </soap:Fault>
       </soap:Body>
       */
      if (isOutput && parameterDescriptor && parameterDescriptor.body.Fault) {
        var xsdStr = new QName(helper.namespaces.xsd, 'string', 'xsd');
        var form;
        if (soapVersion === '1.1') {
          form = 'unqualified';
        } else if (soapVersion === '1.2') {
          form = 'qualified';
        }

        var faultDescriptor = new ElementDescriptor(new QName(nsURI, 'Fault', prefix), null, 'qualified', false);
        bodyDescriptor.add(faultDescriptor);
        var detailDescriptor = void 0;
        if (soapVersion === '1.1') {
          faultDescriptor.add(new ElementDescriptor(new QName(nsURI, 'faultcode', prefix), null, form, false));
          faultDescriptor.add(new ElementDescriptor(new QName(nsURI, 'faultstring', prefix), null, form, false));
          faultDescriptor.add(new ElementDescriptor(new QName(nsURI, 'faultactor', prefix), null, form, false));
          detailDescriptor = new ElementDescriptor(new QName(nsURI, 'detail', prefix), null, form, false);
          faultDescriptor.add(detailDescriptor);
        } else if (soapVersion === '1.2') {
          var code = new ElementDescriptor(new QName(nsURI, 'Code', prefix));
          code.add(new ElementDescriptor(new QName(nsURI, 'Value', prefix), null, form, false));
          var subCode = new ElementDescriptor(new QName(nsURI, 'Subcode', prefix), null, form, false);
          code.add(subCode);
          subCode.add(new ElementDescriptor(new QName(nsURI, 'Value', prefix), null, form, false));
          faultDescriptor.add(code, null, form, false);
          var reason = new ElementDescriptor(new QName(nsURI, 'Reason', prefix));
          reason.add(new ElementDescriptor(new QName(nsURI, 'Text', prefix), null, form, false));
          faultDescriptor.add(reason, null, form, false);
          faultDescriptor.add(new ElementDescriptor(new QName(nsURI, 'Node', prefix), null, form, false));
          faultDescriptor.add(new ElementDescriptor(new QName(nsURI, 'Role', prefix), null, form, false));
          detailDescriptor = new ElementDescriptor(new QName(nsURI, 'Detail', prefix), null, form, false);
          faultDescriptor.add(detailDescriptor);
        }
        //multiple faults may be defined in wsdl for this operation. Go though every Fault and add it under <detail> element.
        for (var f in parameterDescriptor.body.Fault.faults) {
          detailDescriptor.add(parameterDescriptor.body.Fault.faults[f]);
        }
      }

      return descriptor;
    }
  }]);

  return Operation;
}(WSDLElement);

Operation.Style = Style;
Operation.elementName = 'operation';
Operation.allowedChildren = ['documentation', 'input', 'output', 'fault', 'operation'];

module.exports = Operation;