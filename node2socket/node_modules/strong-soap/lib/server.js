'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var g = require('./globalize');
var url = require('url'),
    compress = null,
    events = require('events'),
    XMLHandler = require('./parser/xmlHandler'),
    Base = require('./base'),
    toXMLDate = require('./utils').toXMLDate,
    util = require('util'),
    debug = require('debug')('strong-soap:server'),
    debugDetail = require('debug')('strong-soap:server:detail');

try {
  compress = require('compress');
} catch (error) {
  // Ignore error
}

var Server = function (_Base) {
  _inherits(Server, _Base);

  function Server(server, path, services, wsdl, options) {
    _classCallCheck(this, Server);

    var _this = _possibleConstructorReturn(this, (Server.__proto__ || Object.getPrototypeOf(Server)).call(this, wsdl, options));

    var self = _this;
    options = options || {};
    _this.path = path;
    _this.services = services;
    _this.xmlHandler = new XMLHandler(_this.wsdl.options);

    debug('Server parameters: path: %s services: %j wsdl: %j', path, services, wsdl);
    if (path[path.length - 1] !== '/') path += '/';
    wsdl.load(function (err) {
      var listeners = server.listeners('request').slice();

      server.removeAllListeners('request');
      server.addListener('request', function (req, res) {
        if (typeof self.authorizeConnection === 'function') {
          if (!self.authorizeConnection(req.connection.remoteAddress)) {
            res.end();
            return;
          }
        }
        var reqPath = url.parse(req.url).pathname;
        if (reqPath[reqPath.length - 1] !== '/') reqPath += '/';
        if (path === reqPath) {
          self._requestListener(req, res);
        } else {
          for (var i = 0, len = listeners.length; i < len; i++) {
            listeners[i].call(this, req, res);
          }
        }
      });
    });
    return _this;
  }

  _createClass(Server, [{
    key: '_requestListener',
    value: function _requestListener(req, res) {
      var self = this;
      var reqParse = url.parse(req.url);
      var reqPath = reqParse.pathname;
      var reqQuery = reqParse.search;

      if (typeof self.log === 'function') {
        self.log('info', 'Handling ' + req.method + ' on ' + req.url);
      }

      if (req.method === 'GET') {
        if (reqQuery && reqQuery.toLowerCase() === '?wsdl') {
          if (typeof self.log === 'function') {
            self.log('info', 'Wants the WSDL');
          }
          res.setHeader('Content-Type', 'application/xml');
          res.write(self.wsdl.toXML());
        }
        res.end();
      } else if (req.method === 'POST') {
        res.setHeader('Content-Type', req.headers['content-type']);
        var chunks = [],
            gunzip;
        if (compress && req.headers['content-encoding'] === 'gzip') {
          gunzip = new compress.Gunzip();
          gunzip.init();
        }
        req.on('data', function (chunk) {
          if (gunzip) chunk = gunzip.inflate(chunk, 'binary');
          chunks.push(chunk);
        });
        req.on('end', function () {
          var xml = chunks.join('');
          var result;
          var error;
          if (gunzip) {
            gunzip.end();
            gunzip = null;
          }
          try {
            if (typeof self.log === 'function') {
              self.log('received', xml);
            }
            self._process(xml, req, function (result, statusCode) {
              if (statusCode) {
                res.statusCode = statusCode;
              }
              res.write(result);
              res.end();
              if (typeof self.log === 'function') {
                self.log('replied', result);
              }
            });
          } catch (err) {
            error = err.stack || err;
            res.statusCode = 500;
            res.write(error);
            res.end();
            if (typeof self.log === 'function') {
              self.log('error', error);
            }
          }
        });
      } else {
        res.end();
      }
    }
  }, {
    key: '_process',
    value: function _process(input, req, callback) {
      var self = this,
          pathname = url.parse(req.url).pathname.replace(/\/$/, ''),
          obj = this.xmlHandler.xmlToJson(null, input),
          body = obj.Body,
          headers = obj.Header,
          bindings = this.wsdl.definitions.bindings,
          binding,
          operation,
          operationName,
          serviceName,
          portName,
          includeTimestamp = obj.Header && obj.Header.Security && obj.Header.Security.Timestamp;

      if (typeof self.authenticate === 'function') {
        if (!obj.Header || !obj.Header.Security) {
          throw new Error(g.f('No security header'));
        }
        if (!self.authenticate(obj.Header.Security)) {
          throw new Error(g.f('Invalid username or password'));
        }
      }

      if (typeof self.log === 'function') {
        self.log('info', 'Attempting to bind to ' + pathname);
      }

      // use port.location and current url to find the right binding
      binding = function (self) {
        var services = self.wsdl.definitions.services;
        var firstPort;
        var name;
        for (name in services) {
          serviceName = name;
          var service = services[serviceName];
          var ports = service.ports;
          for (name in ports) {
            portName = name;
            var port = ports[portName];
            var portPathname = url.parse(port.location).pathname.replace(/\/$/, '');

            if (typeof self.log === 'function') {
              self.log('info', 'Trying ' + portName + ' from path ' + portPathname);
            }

            if (portPathname === pathname) return port.binding;

            // The port path is almost always wrong for generated WSDLs
            if (!firstPort) {
              firstPort = port;
            }
          }
        }
        return !firstPort ? void 0 : firstPort.binding;
      }(this);

      if (!binding) {
        throw new Error(g.f('Failed to bind to {{WSDL}}'));
      }

      try {
        if (binding.style === 'rpc') {
          operationName = Object.keys(body)[0];

          self.emit('request', obj, operationName);
          if (headers) self.emit('headers', headers, operationName);

          self._executeMethod({
            serviceName: serviceName,
            portName: portName,
            operationName: operationName,
            outputName: operationName + 'Response',
            args: body[operationName],
            headers: headers,
            style: 'rpc'
          }, req, callback);
        } else {
          //document style
          var messageElemName = Object.keys(body)[0] === 'attributes' ? Object.keys(body)[1] : Object.keys(body)[0];
          var pair = binding.topElements[messageElemName];

          var operationName, outputName;
          var operations = binding.operations;
          //figure out the output name
          for (var name in operations) {
            var inputParts = operations[name].input.message.parts;
            //find the first part of the input message. There could be more than one parts in input message.
            var firstInPart = inputParts[Object.keys(inputParts)[0]];
            if (firstInPart.element.$name === messageElemName) {
              operationName = operations[name].$name;
              if (operations[name].output != null) {
                var outPart = operations[name].output.message.parts;
                //there will be only one output part
                var firstOutPart = outPart[Object.keys(outPart)[0]];
                outputName = firstOutPart.element.$name;
              }
              break;
            }
          }

          self.emit('request', obj, operationName);
          if (headers) self.emit('headers', headers, operationName);

          self._executeMethod({
            serviceName: serviceName,
            portName: portName,
            operationName: operationName,
            outputName: outputName,
            args: body[messageElemName],
            headers: headers,
            style: 'document',
            includeTimestamp: includeTimestamp
          }, req, callback);
        }
      } catch (error) {
        if (error.Fault !== undefined) {
          return self._sendError(operations[name], error, callback, includeTimestamp);
        }
        //Revisit - is this needed?
        throw error;
      }
    }
  }, {
    key: '_executeMethod',
    value: function _executeMethod(options, req, callback) {
      options = options || {};
      var self = this,
          operation,
          body,
          serviceName = options.serviceName,
          portName = options.portName,
          operationName = options.operationName,
          outputName = options.outputName,
          args = options.args,
          style = options.style,
          includeTimestamp = options.includeTimestamp,
          handled = false;

      try {
        operation = this.services[serviceName][portName][operationName];
        debug('Server operation: %s ', operationName);
      } catch (error) {
        debug('Server executeMethod: error: %s ', error.message);
        //fix - should create a fault and call sendError (..) so that this error is not lost and will be sent as Fault in soap envelope
        //to the client?
        return callback(this._envelope('', includeTimestamp));
      }

      function handleResult(error, result) {
        if (handled) return;
        handled = true;

        var operation = self.wsdl.definitions.services[serviceName].ports[portName].binding.operations[operationName];

        if (error && error.Fault !== undefined) {
          return self._sendError(operation, error, callback, includeTimestamp);
        } else if (result === undefined) {
          // Backward compatibility to support one argument callback style
          result = error;
        }

        var element = operation.output;

        var operationDescriptor = operation.describe(self.wsdl.definitions);
        debugDetail('Server handleResult. operationDescriptor: %j ', operationDescriptor);

        var outputBodyDescriptor = operationDescriptor.output.body;
        debugDetail('Server handleResult. outputBodyDescriptor: %j ', outputBodyDescriptor);

        var soapNsURI = 'http://schemas.xmlsoap.org/soap/envelope/';
        var soapNsPrefix = self.wsdl.options.envelopeKey || 'soap';

        if (operation.soapVersion === '1.2') {
          soapNsURI = 'http://www.w3.org/2003/05/soap-envelope';
        }

        debug('Server soapNsURI: %s soapNsPrefix: %s', soapNsURI, soapNsPrefix);

        var nsContext = self.createNamespaceContext(soapNsPrefix, soapNsURI);
        var envelope = XMLHandler.createSOAPEnvelope(soapNsPrefix, soapNsURI);

        self.xmlHandler.jsonToXml(envelope.body, nsContext, outputBodyDescriptor, result);

        self._envelope(envelope, includeTimestamp);
        var message = envelope.body.toString({ pretty: true });
        var xml = envelope.doc.end({ pretty: true });

        debug('Server handleResult. xml: %s ', xml);
        callback(xml);
      }

      if (!self.wsdl.definitions.services[serviceName].ports[portName].binding.operations[operationName].output) {
        // no output defined = one-way operation so return empty response
        handled = true;
        callback('');
      }

      var result = operation(args, handleResult, options.headers, req);
      if (typeof result !== 'undefined') {
        handleResult(null, result);
      }
    }
  }, {
    key: '_addWSSecurityHeader',
    value: function _addWSSecurityHeader(headerElement) {
      var secElement = headerElement.element('wsse:Security').attribute('soap:mustUnderstand', '1');

      secElement.attribute('xmlns:wsse', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-wssecurity-secext-1.0.xsd').attribute('xmlns:wsu', 'http://docs.oasis-open.org/wss/2004/01/' + 'oasis-200401-wss-wssecurity-utility-1.0.xsd');

      var now = new Date();
      var created = toXMLDate(now);
      var timeStampXml = '';

      var expires = toXMLDate(new Date(now.getTime() + 1000 * 600));

      var tsElement = secElement.element('wsu:Timestamp').attribute('wsu:Id', 'Timestamp-' + created);
      tsElement.element('wsu:Created', created);
      tsElement.element('wsu:Expires', expires);
    }
  }, {
    key: '_envelope',
    value: function _envelope(env, includeTimestamp) {
      env = env || XMLHandler.createSOAPEnvelope();

      if (includeTimestamp) {
        this._addWSSecurityHeader(env.header);
      }

      var soapHeaderElement = env.header;
      //add soapHeaders to envelope. Header can be xml, or JSON object which may or may not be described in WSDL/XSD.
      this.addSoapHeadersToEnvelope(soapHeaderElement, this.xmlHandler);
      return env;
    }
  }, {
    key: '_sendError',
    value: function _sendError(operation, error, callback, includeTimestamp) {
      var self = this,
          fault;

      var statusCode;
      if (error.Fault.statusCode) {
        statusCode = error.Fault.statusCode;
        error.Fault.statusCode = undefined;
      }

      var operationDescriptor = operation.describe(this.wsdl.definitions);
      debugDetail('Server sendError. operationDescriptor: %j ', operationDescriptor);

      //get envelope descriptor
      var faultEnvDescriptor = operation.descriptor.faultEnvelope.elements[0];

      var soapNsURI = 'http://schemas.xmlsoap.org/soap/envelope/';
      var soapNsPrefix = self.wsdl.options.envelopeKey || 'soap';

      if (operation.soapVersion === '1.2') {
        soapNsURI = 'http://www.w3.org/2003/05/soap-envelope';
      }

      var nsContext = self.createNamespaceContext(soapNsPrefix, soapNsURI);
      var envelope = XMLHandler.createSOAPEnvelope(soapNsPrefix, soapNsURI);

      //find the envelope body descriptor
      var bodyDescriptor = faultEnvDescriptor.elements[1];

      //there will be only one <Fault> element descriptor under <Body>
      var faultDescriptor = bodyDescriptor.elements[0];
      debugDetail('Server sendError. faultDescriptor: %j ', faultDescriptor);

      debug('Server sendError.  error.Fault: %j ', error.Fault);

      //serialize Fault object into XML as per faultDescriptor
      this.xmlHandler.jsonToXml(envelope.body, nsContext, faultDescriptor, error.Fault);

      self._envelope(envelope, includeTimestamp);
      var message = envelope.body.toString({ pretty: true });
      var xml = envelope.doc.end({ pretty: true });

      debug('Server sendError. Response envelope: %s ', xml);
      callback(xml, statusCode);
    }
  }]);

  return Server;
}(Base);

module.exports = Server;