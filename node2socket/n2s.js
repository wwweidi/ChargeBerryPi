// One-shot server.  Note that the server cannot send a reply;
// UNIX datagram sockets are unconnected and the client is not addressable.
var unix = require('unix-dgram');
var fs = require('fs');
var SOCKNAME= '/tmp/python2ocpp';

try { fs.unlinkSync(SOCKNAME); } catch (e) { /* swallow */ }

var server = unix.createSocket('unix_dgram', function(buf) {
  console.log('received ' + buf);
});
server.bind(SOCKNAME);
