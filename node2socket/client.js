var OCPP =  require('ocpp-js');
var fs = require('fs');
var SOCKNAME= '/tmp/python2ocpp';

try { fs.unlinkSync(SOCKNAME); } catch (e) { /* swallow */ }


var options = {
centralSystem: {
    port: 9220
  },
  chargingPoint: {
    serverURI: 'http://192.168.2.113:9221/Ocpp/ChargePointService',
    name: 'Simulator 1'
  },
  chargingPointServer: {
    port: 9221
  }
}

var ocppJS = new OCPP(options);

// Create Charging Point Client
var chargingPoint1 = ocppJS.createChargingPoint('http://192.168.2.113:8081/ChargeBox/Ocpp', "chargingPoint1-Simulator");
var chargingPoint2 = ocppJS.createChargingPoint('http://192.168.2.113:9221/Ocpp/ChargePointService', "chargingPoint2-Simulator");


// One-shot server.  Note that the server cannot send a reply;
// UNIX datagram sockets are unconnected and the client is not addressable.
var unix = require('unix-dgram');
var server = unix.createSocket('unix_dgram', function(buf) {
  console.log('received ' + buf);
  chargingPoint1.authorize({idTag:'"'+buf+'"'});
  chargingPoint2.authorize({idTag:'"'+buf+'"'});
});

server.bind(SOCKNAME);

setTimeout(function() {
chargingPoint1.bootNotification({
        chargePointVendor: 'Shneider Electric',
        chargePointModel: 'NQC-ACDC',
        chargePointSerialNumber: 'gir.vat.mx.000e48',
        chargeBoxSerialNumber: 'gir.vat.mx.000e48',
        firmwareVersion: '1.0.49',
        iccid: '1',
        imsi: '',
        meterType: 'DBT NQC-ACDC',
        meterSerialNumber: 'gir.vat.mx.000e48'
    });

}, 3000);

