var OCPP =  require('ocpp-js');
var fs = require('fs');
var SOCKNAME= '/tmp/python2ocpp';

try { fs.unlinkSync(SOCKNAME); } catch (e) { /* swallow */ }


var options = {
  centralSystem: {
    port: 9220
  },
  chargingPointServer: {
    port: 9221
  }
}

var ocppJS = new OCPP(options);

// Create Central System
var centralSystem = ocppJS.createCentralSystem();

// Create Charging Point Server
var chargingPointServer = ocppJS.createChargingPointServer(9221);

