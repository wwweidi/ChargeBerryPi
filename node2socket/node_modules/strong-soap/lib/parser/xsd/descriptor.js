'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var assert = require('assert');
var QName = require('../qname');

/**
 * Descriptor for an XML attribute
 */

var AttributeDescriptor = function AttributeDescriptor(qname, type, form) {
  _classCallCheck(this, AttributeDescriptor);

  assert(qname == null || qname instanceof QName, 'Invalid qname: ' + qname);
  this.qname = qname;
  this.type = type;
  form = form || 'qualified';
  assert(form === 'qualified' || form === 'unqualified', 'Invalid form: ' + form);
  this.form = form;
};

/**
 * Descriptor for an XML type
 */


var TypeDescriptor = function () {
  function TypeDescriptor(qname) {
    _classCallCheck(this, TypeDescriptor);

    this.elements = [];
    this.attributes = [];
  }

  _createClass(TypeDescriptor, [{
    key: 'addElement',
    value: function addElement(element) {
      assert(element instanceof ElementDescriptor);
      this.elements.push(element);
      return element;
    }
  }, {
    key: 'addAttribute',
    value: function addAttribute(attribute) {
      assert(attribute instanceof AttributeDescriptor);
      this.attributes.push(attribute);
      return attribute;
    }
  }, {
    key: 'add',
    value: function add(item, isMany) {
      if (item instanceof ElementDescriptor) {
        this.addElement(item.clone(isMany));
      } else if (item instanceof AttributeDescriptor) {
        this.addAttribute(item);
      } else if (item instanceof TypeDescriptor) {
        var i, n;
        for (i = 0, n = item.elements.length; i < n; i++) {
          this.addElement(item.elements[i]);
        }
        for (i = 0, n = item.attributes.length; i < n; i++) {
          this.addAttribute(item.attributes[i]);
        }
        if (item.extension) {
          this.extension = item.extension;
        }
      }
    }
  }, {
    key: 'findElement',
    value: function findElement(name) {
      for (var i = 0, n = this.elements.length; i < n; i++) {
        if (this.elements[i].qname.name === name) {
          return this.elements[i];
        }
      }
      return null;
    }
  }, {
    key: 'findAttribute',
    value: function findAttribute(name) {
      for (var i = 0, n = this.attributes.length; i < n; i++) {
        if (this.attributes[i].qname.name === name) {
          return this.attributes[i];
        }
      }
      return null;
    }
  }, {
    key: 'find',
    value: function find(name) {
      var element = this.findElement(name);
      if (element) return element;
      var attribute = this.findAttribute(name);
      return attribute;
    }
  }]);

  return TypeDescriptor;
}();

/**
 * Descriptor for an XML element
 */


var ElementDescriptor = function (_TypeDescriptor) {
  _inherits(ElementDescriptor, _TypeDescriptor);

  function ElementDescriptor(qname, type, form, isMany) {
    _classCallCheck(this, ElementDescriptor);

    var _this = _possibleConstructorReturn(this, (ElementDescriptor.__proto__ || Object.getPrototypeOf(ElementDescriptor)).call(this));

    assert(qname == null || qname instanceof QName, 'Invalid qname: ' + qname);
    _this.qname = qname;
    _this.type = type;
    form = form || 'qualified';
    assert(form === 'qualified' || form === 'unqualified', 'Invalid form: ' + form);
    _this.form = form;
    _this.isMany = !!isMany;
    _this.isSimple = false;
    return _this;
  }

  _createClass(ElementDescriptor, [{
    key: 'clone',
    value: function clone(isMany) {
      // Check if the referencing element or this element has 'maxOccurs>1'
      isMany = !!isMany || this.isMany;
      var copy = new ElementDescriptor(this.qname, this.type, this.form, isMany);
      copy.isNillable = this.isNillable;
      copy.isSimple = this.isSimple;
      if (this.jsType) copy.jsType = this.jsType;
      if (this.elements != null) copy.elements = this.elements;
      if (this.attributes != null) copy.attributes = this.attributes;
      if (this.mixed != null) copy.mixed = this.mixed;
      copy.refOriginal = this;
      return copy;
    }
  }]);

  return ElementDescriptor;
}(TypeDescriptor);

module.exports = {
  ElementDescriptor: ElementDescriptor,
  AttributeDescriptor: AttributeDescriptor,
  TypeDescriptor: TypeDescriptor
};