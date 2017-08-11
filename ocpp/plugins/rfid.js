/**
 *  Hello world plugins
 *
 */

// One-shot server.  Note that the server cannot send a reply;
// UNIX datagram sockets are unconnected and the client is not addressable.
// var unix = require('unix-dgram');
// var fs = require('fs');
// var SOCKNAME= '/tmp/python2ocpp';
//
// try { fs.unlinkSync(SOCKNAME); } catch (e) { /* swallow */ }
//
// var server = unix.createSocket('unix_dgram', function(buf) {
//     console.log('received ' + buf);
//
//     // call plugin below
//     plugin.authorize('' + buf)
//
// });
// server.bind(SOCKNAME);

setTimeout(function () {
    plugin.authorize("12345a")
}, 1000);


var plugin = {

    name: 'rfid',
    description: 'reads rfid from socket',
    author: '',

    ocpp_version: '1.5',
    system: 'cp',

    authorize: function (id) {
        this.cp.call('Authorize', {"idTag": id});
    },

    onLoad: function () {

        var self = this;
        plugin.cp = self.cp;

        this.log('Hi, I\'m the ' + plugin.name + ' plugin !');

        self.onResult('Authorize', function (values) {
            self.log('Authorize response:' + JSON.stringify(values));
        });
    },


    onUnload: function () {
        this.log('Goodbye rfid!');
    }

};

module.exports = plugin;

