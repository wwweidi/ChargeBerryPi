
/*	
 * Copyright IBM Corp. 2015
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * 
 * @param {*} f 
 * @ignore
 */
const Fields = module.exports.Fields = function Fields(f) {
	if(typeof(f)==="string") {
		f = f.split(/[, ]/);
	}
	this.fields = f;
}

/**
 * Given a parameter 'opts' return a 'fields' parameter in comma-separated form.
 * @ignore
 */
Fields.prototype.processFields = function processFields(opts) {
  if(!opts) opts = {};
  var fields = [];
  if(opts.fields) {
    fields = opts.fields.split(',');
  }
  for(var i in this.fields) {
    if(opts[this.fields[i]]) {
      fields.push(this.fields[i]);
    }
  }
  opts.fields = fields.join(',');
  if(opts.fields === "") {
    opts.fields = undefined;
  }
  return opts.fields;
}

/**
 * Copy all properties from props to o
 * @param {object} o - target of properties
 * @param {object} props - source of properties (map)
 * @ignore
 */
const copyProps = module.exports.copyProps = function copyProps(o, props) {
  if ( props ) {
    // copy properties to this
    for(var k in props) {
      if(props.hasOwnProperty(k)) {
        o[k] = props[k];
      }
    }
  }
};

/**
 * Init a subsidiary client object from a Client
 * @param {Object} o - client object to init
 * @param {Client} gp - parent g11n-pipeline client object
 * @param {Object} props - properties to inherit
 * @ignore
 */
const initSubObject = module.exports.initSubObject = function initSubObject(o, gp, props) {
  copyProps(o, props);
  o.gp = gp; // actually Client
  o.serviceInstance = gp.getServiceInstance(o); // get the service instance ID
};

/**
 * Convert a String into a Date
 * @param {String} d - input, if not a string it is ignored
 * @return {Date}
 * @ignore
 */
const datify = module.exports.datify = function datify(d) {
  if(typeof d !== 'string') {
    return d;
  } else {
    return new Date(d);
  }
}
