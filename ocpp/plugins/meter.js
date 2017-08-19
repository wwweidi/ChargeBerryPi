/**
 *  Hello world plugins
 *
 */
var http = require('http');

var plugin = {

    name: 'kwh meter',
    description: 'read a kwh meter',
    author: '',

    ocpp_version: '1.5',
    system: 'cp',

    cfg: {
        interval: 60000,
        meterPort: 10000
    },

    onLoad: function () {
        var self = this;

        plugin.cp = this.cp;

        this.log('Hi, I\'m the ' + plugin.name + ' plugin !');

        var options = {
            host: 'localhost',
            port: plugin.cfg.meterPort,
            path: '/meter'
        };

        setInterval(function () {

            http.get(options, function (res) {
                var body = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body = chunk;
                });

                self.cp.call('MeterValues',
                    {
                        id: self.cp.id,
                        values: [
                            {
                                timestamp: new Date().toISOString(),
                                value: body
                            }
                        ]
                    }
                );
            })
        }, plugin.cfg.interval)

    },

    onUnload: function () {
        this.log('Goodbye !');
    }

};

module.exports = plugin;

