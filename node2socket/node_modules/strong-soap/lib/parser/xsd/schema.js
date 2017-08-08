'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var assert = require('assert');
var XSDElement = require('./xsdElement');
var helper = require('./../helper');
var Set = helper.Set;

var Schema = function (_XSDElement) {
  _inherits(Schema, _XSDElement);

  function Schema(nsName, attrs, options) {
    _classCallCheck(this, Schema);

    var _this = _possibleConstructorReturn(this, (Schema.__proto__ || Object.getPrototypeOf(Schema)).call(this, nsName, attrs, options));

    _this.complexTypes = {}; // complex types
    _this.simpleTypes = {}; // simple types
    _this.elements = {}; // elements
    _this.includes = []; // included or imported schemas
    _this.groups = {};
    _this.attributes = {};
    _this.attributeGroups = {};
    return _this;
  }

  _createClass(Schema, [{
    key: 'merge',
    value: function merge(source) {
      assert(source instanceof Schema);
      if (this.$targetNamespace === source.$targetNamespace) {
        _.merge(this.complexTypes, source.complexTypes);
        _.merge(this.simpleTypes, source.simpleTypes);
        _.merge(this.elements, source.elements);
        _.merge(this.groups, source.groups);
        _.merge(this.attributes, source.attributes);
        _.merge(this.attributeGroups, source.attributeGroups);
        _.merge(this.xmlns, source.xmlns);
      }
      return this;
    }
  }, {
    key: 'addChild',
    value: function addChild(child) {
      var name = child.$name;
      if (child.getTargetNamespace() === helper.namespaces.xsd && name in helper.schemaTypes) return;
      switch (child.name) {
        case 'include':
        case 'import':
          var location = child.$schemaLocation || child.$location;
          if (location) {
            this.includes.push({
              namespace: child.$namespace || child.$targetNamespace || this.$targetNamespace,
              location: location
            });
          }
          break;
        case 'complexType':
          this.complexTypes[name] = child;
          break;
        case 'simpleType':
          this.simpleTypes[name] = child;
          break;
        case 'element':
          this.elements[name] = child;
          break;
        case 'group':
          this.groups[name] = child;
          break;
        case 'attribute':
          this.attributes[name] = child;
          break;
        case 'attributeGroup':
          this.attributeGroups[name] = child;
          break;
      }
    }
  }, {
    key: 'postProcess',
    value: function postProcess(defintions) {
      var visited = new Set();
      visited.add(this);
      this.children.forEach(function (c) {
        visitDfs(defintions, visited, c);
      });
    }
  }]);

  return Schema;
}(XSDElement);

function visitDfs(defintions, nodes, node) {
  var visited = nodes.has(node);
  if (!visited && !node._processed) {
    node.postProcess(defintions);
    node._processed = true;

    node.children.forEach(function (child) {
      visitDfs(defintions, nodes, child);
    });
  }
}

Schema.elementName = 'schema';
Schema.allowedChildren = ['annotation', 'element', 'complexType', 'simpleType', 'include', 'import', 'group', 'attribute', 'attributeGroup'];

module.exports = Schema;