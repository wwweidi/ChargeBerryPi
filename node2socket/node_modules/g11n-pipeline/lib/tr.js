/*	
 * Copyright IBM Corp. 2017
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

const utils = require('./utils.js');

/**
 * Callback returned by trs()
 * @callback TranslationRequest~getTranslationRequestsCallback
 * @param {Object} err -  error, or null
 * @param {Object.<string, TranslationRequest>} trs - map from translation request ID to TranslationRequest
 * Example: `{ 1dec633b: {…}}` if there was just one TR, id `1dec633b`
 */

/**
 * Callback returned by getInfo and create
 * @callback TranslationRequest~getTranslationRequestCallback
 * @param {Object} err -  error, or null
 * @param {TranslationRequest} tr - the returned TranslationRequest
 */


/**
 * @typedef WordCountsInfo
 * @type {object}
 * @prop {string} sourceLanguage - bcp47 id of the source language, such as 'en'
 * @prop {object.<string,number>} counts - map from target language to word count
 */

/**
 * Possible status values for Translation Requests
 * @enum {string}
 * @prop {string} DRAFT - The translation request has not been submitted for processing. It may modified or cancelled.
 * @prop {string} SUBMITTED - The translation request has been submitted for processing, but has not been accepted by the partner yet.
 * @prop {string} STARTED - Work has started on the translation request.
 * @prop {string} TRANSLATED - All work has been completed on the translation request. It has not been merged into the target resource data yet.
 * @prop {string} MERGED - The translation results have been merged into the original resource bundles.
 */
const TranslationRequestStatus = {
  // No values here, just @prop lines for documentation.
};

/** 
 * Possible translation domains. These provide hints as to the type of translation expected.
 * @enum {string}
 */
const TranslationDomain = {
    AEROMIL: "Aerospace and the military-industrial complex",
    CNSTRCT: "Construction",
    GDSSVCS: "Goods and service",
    EDUCATN: "Education",
    FINSVCS: "Financial Services",
    GOVPUBL: "Government and public sector",
    HEALTHC: "Healthcare and social services",
    INDSTMF: "Industrial manufacturing",
    TELECOM: "Telecommunication",
    DMEDENT: "Digital media and entertainment",
    INFTECH: "Information technology",
    TRVLTRS: "Travel and transportation",
    INSURNC: "Insurance",
    ENGYUTL: "Energy and utilities",
    AGRICLT: "Agriculture"
}

/**
 * This class represents a request for professional editing of machine-translated content.
 * Note: this constructor is not usually called directly, use Client.tr(id) or Client.tr({fields…})
 * @class TranslationRequest
 * @param {Client} gp - parent g11n-pipeline client object
 * @param {Object} props - properties to inherit
 * 
 * @prop {string} id - Translation Request ID
 * @prop {string} serviceInstance - the Service Instance that this Translation Request belongs to
 * @prop {string} partner - the three letter Partner ID to be used. Use 'IBM' for the Professional Plan
 * @prop {string} name - descriptive title for this translation request
 * @prop {Object.<String,String[]>} targetLanguagesByBundle - map from Bundle ID to array of target languages
 * @prop {String[]} emails - array of email addresses for the requester
 * @prop {TranslationDomain[]} domains - A list of applicable translation domains.
 * @prop {TranslationRequestStatus} status - Status of this TR. 
 * @prop {Object.<String,WordCountsInfo>} wordCountsByBundle - map of bundle IDs to word count data
 * @prop {string} updatedBy - last updated user ID
 * @prop {Date} updatedAt - date when the TR was updated
 * @prop {Date} createdAt - date when the TR was first submitted
 * @prop {Date} estimatedCompletion - date when the TR is expected to be complete
 * @prop {Date} startedAt - date when the TR was accepted for processing
 * @prop {Date} translatedAt - date when the TR had completed translation review
 * @prop {Date} mergedAt - date when the TR was merged back into the target bundles
 * @prop {String[]} [notes=[]] - optional array of notes to the translators
 * @prop {Object.<string,string>} metadata - array of user-defined metadata
 */
function TranslationRequest(gp, props) {
  utils.initSubObject(this, gp, props);
  // turn some string dates into date objects
  if(this.createdAt) {
    this.createdAt = utils.datify(this.createdAt);
  }
  if(this.startedAt) {
    this.startedAt = utils.datify(this.startedAt);
  }
  if(this.translatedAt) {
    this.translatedAt = utils.datify(this.translatedAt);
  }
  if(this.mergedAt) {
    this.mergedAt = utils.datify(this.mergedAt);
  }
  if(this.updatedAt) {
    this.updatedAt = utils.datify(this.updatedAt);
  }
  if(this.estimatedCompletion) {
    this.estimatedCompletion = utils.datify(this.estimatedCompletion);
  }
}

/**
 * Fetch the full record for this translation request.
 * Example:  `client.tr('1dec633b').getInfo((err, tr) => { console.log(tr.status); });`
 * @param {Object} [opts={}] - Options object - if present, overrides values in `this`
 * @param {TranslationRequest~getTranslationRequestCallback} cb
 */
TranslationRequest.prototype.getInfo = function getTranslationRequest(opts, cb) {
  if( !cb ) {
    cb = opts;
    opts = {};
  }

  const serviceInstance = opts.serviceInstanceId || this.serviceInstance;
  const requestId = opts.requestId || this.id;
  const that = this;

  this.gp.restCall("translation_request.getTranslationRequest", {serviceInstanceId: serviceInstance, requestId: requestId}, function(err, resp) {
      if(err) return cb(err); // bail out, error.
      const newTr = new TranslationRequest(that.gp, resp.translationRequest);
      newTr.id = resp.id;
      return cb(null, newTr);
  });
};

/**
 * Delete this translation request.
 * @param {Object} [opts={}] - Options object - if present, overrides values in `this`
 * @param {BasicCallBack} cb
 */
TranslationRequest.prototype.delete = function deleteTranslationRequest(opts, cb) {
  if( !cb ) {
    cb = opts;
    opts = {};
  }

  const serviceInstance = opts.serviceInstanceId || this.serviceInstance;
  const requestId = opts.requestId || this.id;
  const that = this;

  return this.gp.restCall("translation_request.deleteTranslationRequest", {serviceInstanceId: serviceInstance, requestId: requestId}, cb);
};

/**
 * Create a translation request with the specified options. The callback returns a new TranslationRequest object
 * with the `id` and other fields populated.
 * Example:  `client.tr({ status: 'SUBMITTED', … }).create((err, tr) => { console.log(tr.id); });`
 * @param {Object} [opts={}] - Options object - if present, overrides values in `this`
 * @param {TranslationRequest~getTranslationRequestCallback} cb
 */
TranslationRequest.prototype.create = function createTranslationRequest(opts, cb) {
  if( !cb ) {
    cb = opts;
    opts = {};
  }
  const translationRequest = {};
  utils.copyProps(translationRequest, this); // first, props from obj
  utils.copyProps(translationRequest, opts); // then, extra opts

  // clear out stuff
  delete(translationRequest.serviceInstance);
  delete(translationRequest.gp);

  const that = this;

  this.gp.restCall("translation_request.createTranslationRequest",
     {serviceInstanceId: this.serviceInstance, body: translationRequest}, function(err, resp) {
      if(err) return cb(err); // bail out, error.
      const newTr = new TranslationRequest(that.gp, resp.translationRequest);
      newTr.id = resp.id;
      return cb(null, newTr);
     });
};

// TODO: enumerate fields here

/**
 * Update a translation request with the specified values.
 * If any property of `opts` is missing, that value will not be updated.
 * @param {Object} opts - Options object - contains fields to update
 * @param {String} [opts.partner] - optional: update partner.
 * @param {String} [opts.name] - optional: update name
 * @param {Object.<String,String[]>} [opts.targetLanguagesByBundle] - optional: update target bundle/language list
 * @param {String[]} [opts.emails] - optional: update email list
 * @param {TranslationDomain[]} [opts.domains] - optional: update domain list 
 * @param {TranslationRequestStatus} [opts.status] - optional: update TR status. May only change from `DRAFT` to `SUBMITTED` here. 
 * @param {Object.<String,String>} [opts.metadata] - optional: update metadata
 * @param {basicCallback} cb - callback with update status
 */
TranslationRequest.prototype.update = function updateTranslationRequest(opts, cb) {
  const that = this;
  const serviceInstance = opts.serviceInstance || this.serviceInstance;
  const requestId = opts.requestId || this.id;
  delete opts.serviceInstance;
  delete opts.requestId;

  this.gp.restCall("translation_request.updateTranslationRequest",
     {serviceInstanceId: serviceInstance,  requestId: requestId, body: opts}, cb);
};

module.exports = TranslationRequest;
