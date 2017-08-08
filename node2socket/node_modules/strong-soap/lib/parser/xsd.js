'use strict';

var helper = require('./helper');
var builtinTypes;

function getBuiltinTypes() {
  if (builtinTypes) return builtinTypes;
  builtinTypes = {};
  var SimpleType = require('./xsd/simpleType');
  for (var t in helper.schemaTypes) {
    var type = new SimpleType('xsd:simpleType', { name: t, 'xmlns:xsd': helper.namespaces.xsd }, {});
    type.targetNamespace = helper.namespaces.xsd;
    type.jsType = helper.schemaTypes[t];
    builtinTypes[t] = type;
  }
  return builtinTypes;
}

exports.getBuiltinTypes = getBuiltinTypes;

exports.getBuiltinType = function (name) {
  return getBuiltinTypes()[name];
};

function parse(value, type) {
  var SimpleType = require('./xsd/simpleType');
}