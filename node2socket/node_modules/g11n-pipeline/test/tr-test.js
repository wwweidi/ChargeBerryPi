/*	
 * Copyright IBM Corp. 2015,2017
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

// test of Translation Request API

// load locals
require('./lib/localsetenv').applyLocal();

//return true;

// var Q = require('q');

var minispin = require('./lib/minispin');
var randHex = require('./lib/randhex');
var gaasTest = require('./lib/gp-test');
var GaasHmac = require('../lib/gp-hmac');

const testData = gaasTest.testData;


if (process.env.NO_TR_TEST) { describe = describe.skip; }

var gaas = require('../index.js'); // required, below
var gaasClient;

var ourReaderKey; // to be filled in - API key.
var ourReaderClient; // to be filled in - separate client that's just a reader.

var expect = require('chai').expect;
var assert = require('assert');

var VERBOSE = process.env.GP_VERBOSE || false;
var NO_DELETE = process.env.NO_DELETE || false;
if (VERBOSE) console.dir(module.filename);

var projectId = process.env.GP_TR_PROJECT || 'MyTRProject' + Math.random();

var DELAY_AVAIL = process.env.DELAY_AVAIL || false;


// MS to loop when waiting for things to happen.
var UNTIL_DELAY = 1024;

const srcLang = 'en';
const targLang0 = 'es';

var opts = {
  credentials: gaasTest.getCredentials()
};

function resterr(o) {
  if (!o) {
    return Error("(falsy object)");
  }
  if (o.data && o.message) {
    return Error(o.data.message);
  } else if (o.message) {
    return Error(o.message);
  }
}
var urlEnv = gaas._normalizeUrl(opts.credentials.url); // use GaaS normalize

describe('Setting up GP-HPE test', function () {
  if (urlEnv) {
    it('requiring gaas with options', function (done) {
      gaasClient = gaas.getClient(opts);
      //if(VERBOSE) console.log( gaasClient._getUrl() );
      done();
    });
  } else {
    // no creds
    it('should have had credentials', function (done) {
      done('please create local-credentials.json or have GP_URL/GP_USER_ID/GP_PASSWORD/GP_INSTANCE set');
    });
  }
});

// ping
describe('GP-HPE Verifying again that we can reach the server', function () {
  it('Should let us call gaasClient.ping', function (done) {
    if (process.env.BAIL_ON_ERR && !gaasClient.hasOwnProperty('ping')) {
      console.error('Could not reach server');
      process.exit(1);
    }
    gaasClient.ping({}, function (err, data) {

      if (err && process.env.BAIL_ON_ERR) {
        console.error('Could not reach server');
        process.exit(1);
      }

      if (err) { done(err); return; }
      if (VERBOSE) console.dir(data);
      done();
    });
  });
});

var randInstanceName = randHex() + '-' + randHex()
var instanceName = (opts.credentials.instanceId) // given
  || randInstanceName;  // random

describe('GP-HPE.setup instance ' + instanceName, function () {
  if (opts.credentials.isAdmin) it('should let us create our instance', function (done) {
    gaasClient.ready(done, function (err, done, apis) {
      if (err) { done(err); return; }
      apis.admin.createServiceInstance({
        serviceInstanceId: instanceName,
        body: {
          serviceId: 'rand-' + randHex(),
          orgId: 'rand-' + randHex(),
          spaceId: 'rand-' + randHex(),
          planId: 'rand-' + randHex(),
          disabled: false
        }
      }, function onSuccess(o) {
        if (o.obj.status !== 'SUCCESS') {
          done(Error(o.obj.status));
        } else {
          //console.dir(o.obj, {depth: null, color: true});
          done();
        }
      }, function onFailure(o) {
        done(resterr(o));
      });
    });
  });
  // just make sure it's OK
  it('should now let me call bundles() (cb)', function (done) {
    gaasClient.bundles({ serviceInstance: instanceName }, function (err, data) {
      if (err) {
        done(err);
      } else {
        if (opts.credentials.isAdmin) {
          expect(data).to.be.ok;
          expect(data).to.eql({});
        } else {
          if (VERBOSE && data.length > 0) {
            console.log('Note: You have pre existing instances. That’s probably ok, though best to run this test with a clean slate.');
          }
        }
        done();
      }
    });
  });
});

describe('GP-HPE tr() and trs() api test', function () {
  it('Should be able to let us construct a default tr', function () {
    const tr = gaasClient.tr();
    expect(tr).to.be.ok;
  });
  it('Should be able to let us construct a tr with some ID', function () {
    const tr = gaasClient.tr('someId');
    expect(tr).to.be.ok;
    expect(tr.id).to.equal('someId');
  });
  it('Should be able to let us construct a tr with some fields', function () {
    const tr = gaasClient.tr({ a: 'one', b: 'two' });
    expect(tr).to.be.ok;
    expect(tr.a).to.equal('one');
    expect(tr.b).to.equal('two');
  });
  it('Should let us call trs() and have an empty list', function (done) {
    gaasClient.trs(function (err, trs) {
      if (err) return done(err);
      expect(trs).to.be.ok;
      expect(trs).to.deep.equal({});
      return done();
    });
  });
});

describe('GP-HPE.bundle()', function () {
  it('Should let us create', function (done) {
    var proj = gaasClient.bundle({ id: projectId, serviceInstance: instanceName });
    proj.create({
      sourceLanguage: srcLang,
      targetLanguages: [targLang0],
      notes: ['Note to self']
    }, function (err, resp) {
      if (err) return done(err);
      return done();
    });
  });

  it('GP-HPE Should let us upload some ' + srcLang + ' strings ' + projectId, function (done) {
    if(VERBOSE) console.dir(testData('t1', '0', srcLang));
    var proj = gaasClient.bundle({ id: projectId, serviceInstance: instanceName });
    proj.uploadStrings({
      languageId: srcLang,
      strings: testData('t1', '0', srcLang)
    }, done);
  });
  it('GP-HPE Should let us upload some ' + targLang0 + ' strings ' + projectId, function (done) {
    if(VERBOSE) console.dir(testData('t1', '0', targLang0));
    var proj = gaasClient.bundle({ id: projectId, serviceInstance: instanceName });
    proj.uploadStrings({
      languageId: targLang0,
      strings: testData('t1', '0', targLang0)
    }, done);
  });


  it('GP-HPE should let us verify the target data(es)', function (done) {
    var proj = gaasClient.bundle({ id: projectId, serviceInstance: instanceName });
    proj.getStrings({ languageId: targLang0 },
      function (err, data) {
        if (err) { done(err); return; }
        expect(data).to.have.a.property('resourceStrings');
        expect(data.resourceStrings).to.deep.equal(testData('t1', '0', targLang0));
        done();
      });
  });

  it('GP-HPE Should let me update the review status of a bundle', function (done) {
    var entry = gaasClient
      .bundle({ id: projectId, serviceInstance: instanceName })
      .entry({ languageId: targLang0, resourceKey: 'hi' });
    entry.update({
      reviewed: false,
      sequenceNumber: 42,
      notes: [ '{{10,10,IBM}}' ]
    }, function (err, data) {
      if (err) return done(err);

      entry.getInfo({},
        function (err, entry2) {
          if (err) return done(err);
          expect(entry2.reviewed).to.be.false;
          return done();
        });
    });
  });
});

// OK now 'hi' is marked not reviewed. 
// open a TR.

var trId1;

describe.skip('GP-HPE: Requesting our first TR', function () {
  it('Should request the first TR', function (done) {
    const requestData = {
      name: 'FirstTR',
      emails: ['noname@example.com'],
      partner: 'IBM',
      targetLanguagesByBundle: {}, // to fill in
      status: 'SUBMITTED' // request to submit it right away.
    };
    requestData.targetLanguagesByBundle[projectId] = [targLang0];
    gaasClient.tr(requestData)
      .create(function cb(err, tr) {
        if (err) return done(err);
        expect(tr.id).to.be.ok;
        trId1 = tr.id;

        expect(tr.gp).to.be.ok; // Internal prop: it's an object

        expect(tr.status).to.equal('SUBMITTED');
        expect(tr.wordCountsByBundle).to.be.ok;
        expect(tr.createdAt).to.be.ok;

        return done();
      });
  });
      var t = 8192;

  // It's possible that the TR is merged by the time we get to it.
  it('should eventually show the TR as STARTED (or MERGED or TRANSLATED)', function (done) {
      var timeout;
      var c = 100;
      var loopy = function(c) {
        minispin.step();
        c--;
        if(c === 0) {
          return done(Error('Patience exceeded!'));
        } else if(timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }
        if(VERBOSE) console.log('Will try',c,'more times for',trId1);
        gaasClient.tr(trId1)
          .getInfo(function cb(err, tr) {
            if(err) {
              return done(err);
            } else if(tr.status !== 'STARTED' && tr.status !== 'MERGED' && tr.status !== 'TRANSLATED') {
              if(VERBOSE) console.log(tr.id,'=',tr.status);
              timeout = setTimeout(loopy, t, c);
            } else {
              expect(tr.id).to.equal(trId1);
              // TODO: more here.
              expect(tr.startedAt).to.be.ok;
              expect(tr.startedAt).to.be.at.least(tr.createdAt);
              if(VERBOSE) console.dir(tr);
              return done();
            }
          });
      };
      process.nextTick(loopy, c); // first run
  });
  it('should eventually show the TR as MERGED', function (done) {
      var timeout;
      var c = 100;
      var loopy = function(c) {
        if(VERBOSE) console.log('Will try',c,'more times for',trId1);
        minispin.step();
        c--;
        if(c === 0) {
          return done(Error('Patience exceeded!'));
        }else if(timeout) {
          clearTimeout(timeout);
          timeout = undefined;
        }
        gaasClient.tr(trId1)
          .getInfo(function cb(err, tr) {
            if(err) {
              return done(err);
            } else if(tr.status !== 'MERGED') {
              if(VERBOSE) console.log(tr.id,'=',tr.status);
              timeout = setTimeout(loopy, t, c);
            } else {
              expect(tr.id).to.equal(trId1);
              expect(tr.translatedAt).to.be.ok;
              expect(tr.translatedAt).to.be.at.least(tr.startedAt);
              expect(tr.mergedAt).to.be.ok;
              expect(tr.mergedAt).to.be.at.least(tr.translatedAt);


              // TODO: more here.
              delete tr.gp; // for console.dir
              if(VERBOSE) console.dir(tr, {depth: null, color: true});
              return done();
            }
          });
      };
      process.nextTick(loopy, c); // first run
  });
  it('Should now have a reviewed field and translated content thanks to the TR', function (done) {
    var entry = gaasClient
      .bundle({ id: projectId, serviceInstance: instanceName })
      .entry({ languageId: targLang0, resourceKey: 'hi' });
    entry.getInfo({},
      function (err, entry2) {
        if (err) return done(err);
        expect(entry2.reviewed).to.be.true;
        expect(entry2.updatedBy).to.equal('$IBM.AUTOTEST');
        expect(entry2.value).to.equal(testData('t1', '1', targLang0)[entry2.resourceKey]);
        expect(entry2.translationStatus).to.equal('TRANSLATED');
        if(VERBOSE) console.dir(entry2);
        return done();
      });
  });
  it('Should be able to delete the TR', function(done) {
    gaasClient.tr(trId1).delete(function(err, data) {
      if(err) return done(err);
      if(VERBOSE) console.dir(data);
      return done();
    });
  });
});

var trId2;

describe('GP-HPE now try using tr.update', function() {
  it('GP-HPE Should let me update the review status of a bundle', function (done) {
    var entry = gaasClient
      .bundle({ id: projectId, serviceInstance: instanceName })
      .entry({ languageId: targLang0, resourceKey: 'hi' });
    entry.update({
      reviewed: false, // reset reviewd status
      value: testData('t1', '0', targLang0)[entry.resourceKey], // reset the value
      notes: ['Take note.', 'note: Take.']
    }, function (err, data) {
      if (err) return done(err);

      entry.getInfo({},
        function (err, entry2) {
          if (err) return done(err);
          expect(entry2.reviewed).to.be.false;
          expect(entry2.value).to.equal(testData('t1', '0', targLang0)[entry.resourceKey])
          return done();
        });
    });
  });

  it('Should create the second TR', function (done) {
    const requestData = {
      name: 'Second TR draft', // TODO: docs say this is optional?
      emails: ['my_real_name_not_really@example.com'], // TODO: docs say this is optional?
      partner: 'IBM', // TODO: try changing partner name in update
      targetLanguagesByBundle: {}, // to fill in
      status: 'DRAFT', // do not submit yet
      domains: [ 'FINSVCS', 'CNSTRCT' ],
      notes: [ 'a', 'b', 'c' ]
    };
    requestData.targetLanguagesByBundle[projectId] = [targLang0];
    if(VERBOSE) console.dir(requestData);
    gaasClient.tr(requestData)
      .create(function cb(err, tr) {
        if (err) return done(err);
        expect(tr.id).to.be.ok;
        trId2 = tr.id;

        expect(tr.gp).to.be.ok; // Internal prop: it's an object

        expect(tr.status).to.equal('DRAFT');
        expect(tr.wordCountsByBundle).to.be.ok;
        expect(tr.createdAt).to.be.ok;
        if(VERBOSE) { delete tr.gp; console.dir(tr); }
        expect(tr.domains).to.contain('CNSTRCT');
        expect(tr.domains).to.contain('FINSVCS');
        expect(tr.notes).to.deep.equal(['a','b','c']);
        expect(tr.wordCountsByBundle[projectId]).to.deep.equal({sourceLanguage: srcLang, counts: { es: 1 } });
        return done();
      });
  });

    const updateData = { 
      notes: [ 'b', 'c', 'a' ]
    };
  it('Should be able to update the TR', function(done) {
    gaasClient.tr(trId2)
    .update(updateData, function(err, data) {
      if(err) return done(err);

      if(VERBOSE) console.dir(data);
      return done();
    });
  });

  it('Should be able to verify the updated TR values', function(done) {
    gaasClient.tr(trId2)
    .getInfo(function(err, tr) {
      if(err) return done(err);

      if(VERBOSE) console.dir(tr);

      expect(tr.notes).to.deep.equal(updateData.notes);

      return done();
    });
  });

});


if (!NO_DELETE && !opts.credentials.isAdmin) {
  describe('GP-HPE Clean-up time for ' + instanceName, function () {
    // it('should let me delete an admin user', function (done) {
    //   expect(myUserInfo.userId).to.be.ok;
    //   gaasClient.user(myUserInfo.userId).delete(done);
    // });
    // it('should let me delete a reader user', function (done) {
    //   expect(readerInfo.credentials.userId).to.be.ok;
    //   gaasClient.user(readerInfo.credentials.userId).delete(done);
    // });
    // it('Should let us call client.users() and verify users gone', function (done) {
    //   gaasClient.users({ serviceInstance: instanceName }, function (err, users) {
    //     if (err) return done(err);
    //     expect(users).to.be.ok;
    //     expect(users).to.not.contain.keys([myUserInfo.userId, readerInfo.credentials.userId])
    //     done();
    //   });
    // });
  });
}

// unless !delete?
if (NO_DELETE) {
  describe('GP-HPE.delete', function () {
    it('(skipped- NO_DELETE)');
  });
} else if (opts.credentials.isAdmin) {
  describe('GP-HPE.delete instance ' + instanceName, function () {
    it('should let us delete our instance', function (done) {
      gaasClient.ready(done, function (err, done, apis) {
        if (err) { done(err); return; }
        apis.admin.deleteServiceInstance({
          serviceInstanceId: instanceName
        }, function onSuccess(o) {
          if (o.obj.status !== 'SUCCESS') {
            done(Error(o.obj.status));
          } else {
            //console.dir(o.obj, {depth: null, color: true});
            done();
          }
        }, function onFailure(o) {
          done(Error('Failed: ' + o));
        });
      });
    });
  });
}

//  END NO_DELETE

// end of tr-test
