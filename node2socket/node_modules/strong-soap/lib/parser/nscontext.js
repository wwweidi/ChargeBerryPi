'use strict';

/**
 * Scope for XML namespaces
 * @param {NamespaceScope} [parent] Parent scope
 * @returns {NamespaceScope}
 * @constructor
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NamespaceScope = function () {
  function NamespaceScope(parent) {
    _classCallCheck(this, NamespaceScope);

    this.parent = parent;
    this.namespaces = {};
    this.prefixCount = 0;
  }

  /**
   * Look up the namespace URI by prefix
   * @param {String} prefix Namespace prefix
   * @param {Boolean} [localOnly] Search current scope only
   * @returns {String} Namespace URI
   */


  _createClass(NamespaceScope, [{
    key: 'getNamespaceURI',
    value: function getNamespaceURI(prefix, localOnly) {
      switch (prefix) {
        case 'xml':
          return 'http://www.w3.org/XML/1998/namespace';
        case 'xmlns':
          return 'http://www.w3.org/2000/xmlns/';
        default:
          var nsURI = this.namespaces[prefix];
          /*jshint -W116 */
          if (nsURI != null) {
            return nsURI.uri;
          } else if (!localOnly && this.parent) {
            return this.parent.getNamespaceURI(prefix);
          } else {
            return null;
          }
      }
    }
  }, {
    key: 'getNamespaceMapping',
    value: function getNamespaceMapping(prefix) {
      switch (prefix) {
        case 'xml':
          return {
            uri: 'http://www.w3.org/XML/1998/namespace',
            prefix: 'xml',
            declared: true
          };
        case 'xmlns':
          return {
            uri: 'http://www.w3.org/2000/xmlns/',
            prefix: 'xmlns',
            declared: true
          };
        default:
          var mapping = this.namespaces[prefix];
          /*jshint -W116 */
          if (mapping != null) {
            return mapping;
          } else if (this.parent) {
            return this.parent.getNamespaceMapping(prefix);
          } else {
            return null;
          }
      }
    }

    /**
     * Look up the namespace prefix by URI
     * @param {String} nsURI Namespace URI
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace prefix
     */

  }, {
    key: 'getPrefix',
    value: function getPrefix(nsURI, localOnly) {
      switch (nsURI) {
        case 'http://www.w3.org/XML/1998/namespace':
          return 'xml';
        case 'http://www.w3.org/2000/xmlns/':
          return 'xmlns';
        default:
          for (var p in this.namespaces) {
            if (this.namespaces[p].uri === nsURI) {
              return p;
            }
          }
          if (!localOnly && this.parent) {
            return this.parent.getPrefix(nsURI);
          } else {
            return null;
          }
      }
    }

    /**
     * Look up the namespace prefix by URI
     * @param {String} nsURI Namespace URI
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace prefix
     */

  }, {
    key: 'getPrefixMapping',
    value: function getPrefixMapping(nsURI, localOnly) {
      switch (nsURI) {
        case 'http://www.w3.org/XML/1998/namespace':
          return 'xml';
        case 'http://www.w3.org/2000/xmlns/':
          return 'xmlns';
        default:
          for (var p in this.namespaces) {
            if (this.namespaces[p].uri === nsURI && this.namespaces[p].declared === true) {
              return this.namespaces[p];
            }
          }
          if (!localOnly && this.parent) {
            return this.parent.getPrefixMapping(nsURI);
          } else {
            return null;
          }
      }
    }

    /**
     * Generate a new prefix that is not mapped to any uris
     * @param base {string} The base for prefix
     * @returns {string}
     */

  }, {
    key: 'generatePrefix',
    value: function generatePrefix(base) {
      base = base || 'ns';
      while (true) {
        var prefix = 'ns' + ++this.prefixCount;
        if (!this.getNamespaceURI(prefix)) {
          // The prefix is not used
          return prefix;
        }
      }
    }
  }]);

  return NamespaceScope;
}();

/**
 * Namespace context that manages hierarchical scopes
 * @returns {NamespaceContext}
 * @constructor
 */


var NamespaceContext = function () {
  function NamespaceContext() {
    _classCallCheck(this, NamespaceContext);

    this.scopes = [];
    this.pushContext();
  }

  /**
   * Add a prefix/URI namespace mapping
   * @param {String} prefix Namespace prefix
   * @param {String} nsURI Namespace URI
   * @param {Boolean} [localOnly] Search current scope only
   * @returns {boolean} true if the mapping is added or false if the mapping
   * already exists
   */


  _createClass(NamespaceContext, [{
    key: 'addNamespace',
    value: function addNamespace(prefix, nsURI, localOnly) {
      if (this.getNamespaceURI(prefix, localOnly) === nsURI) {
        return false;
      }
      if (this.currentScope) {
        this.currentScope.namespaces[prefix] = {
          uri: nsURI,
          prefix: prefix,
          declared: false
        };
        return true;
      }
      return false;
    }

    /**
     * Push a scope into the context
     * @returns {NamespaceScope} The current scope
     */

  }, {
    key: 'pushContext',
    value: function pushContext() {
      var scope = new NamespaceScope(this.currentScope);
      this.scopes.push(scope);
      this.currentScope = scope;
      return scope;
    }

    /**
     * Pop a scope out of the context
     * @returns {NamespaceScope} The removed scope
     */

  }, {
    key: 'popContext',
    value: function popContext() {
      var scope = this.scopes.pop();
      if (scope) {
        this.currentScope = scope.parent;
      } else {
        this.currentScope = null;
      }
      return scope;
    }

    /**
     * Look up the namespace URI by prefix
     * @param {String} prefix Namespace prefix
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace URI
     */

  }, {
    key: 'getNamespaceURI',
    value: function getNamespaceURI(prefix, localOnly) {
      return this.currentScope && this.currentScope.getNamespaceURI(prefix, localOnly);
    }

    /**
     * Look up the namespace prefix by URI
     * @param {String} nsURI Namespace URI
     * @param {Boolean} [localOnly] Search current scope only
     * @returns {String} Namespace prefix
     */

  }, {
    key: 'getPrefix',
    value: function getPrefix(nsURI, localOnly) {
      return this.currentScope && this.currentScope.getPrefix(nsURI, localOnly);
    }

    /**
     * Look up the namespace mapping by nsURI
     * @param {String} nsURI Namespace URI
     * @returns {String} Namespace mapping
     */

  }, {
    key: 'getPrefixMapping',
    value: function getPrefixMapping(nsURI) {
      return this.currentScope && this.currentScope.getPrefixMapping(nsURI);
    }

    /**
     * Generate a new prefix that is not mapped to any uris
     * @param base {string} The base for prefix
     * @returns {string}
     */

  }, {
    key: 'generatePrefix',
    value: function generatePrefix(base) {
      return this.currentScope && this.currentScope.generatePrefix(base);
    }

    /**
     * Register a namespace
     * @param {String} prefix Namespace prefix
     * @param {String} nsURI Namespace URI
     * @returns {Object} The matching or generated namespace mapping
     */

  }, {
    key: 'registerNamespace',
    value: function registerNamespace(prefix, nsURI) {
      var mapping;
      if (!prefix) {
        prefix = this.generatePrefix();
      } else {
        mapping = this.currentScope.getNamespaceMapping(prefix);
        if (mapping && mapping.uri === nsURI) {
          // Found an existing mapping
          return mapping;
        }
      }
      if (this.getNamespaceURI(prefix)) {
        // The prefix is already mapped to a different namespace
        prefix = this.generatePrefix();
      }
      if (this.currentScope) {
        mapping = {
          uri: nsURI,
          prefix: prefix,
          declared: false
        };
        this.currentScope.namespaces[prefix] = mapping;
        return mapping;
      }
      return null;
    }

    /**
     * Declare a namespace prefix/uri mapping
     * @param {String} prefix Namespace prefix
     * @param {String} nsURI Namespace URI
     * @returns {Boolean} true if the declaration is created
     */

  }, {
    key: 'declareNamespace',
    value: function declareNamespace(prefix, nsURI) {
      var mapping = this.registerNamespace(prefix, nsURI);
      if (!mapping) return null;
      if (mapping.declared) {
        return null;
      }
      mapping = this.currentScope.namespaces[mapping.prefix];
      if (mapping) {
        mapping.declared = true;
      } else {
        mapping = {
          prefix: mapping.prefix,
          uri: nsURI,
          declared: true
        };
        this.currentScope.namespaces[mapping.prefix] = mapping;
      }
      return mapping;
    }
  }]);

  return NamespaceContext;
}();

module.exports = NamespaceContext;