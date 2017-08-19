var express = require('express');
var fs = require('fs');
var app = express();
var fileName = './metervalue';
var currentKw = 0;

app.get('/meter', function (req, res) {
    var data = fs.readFileSync(fileName);
    res.set('Content-Type', 'text/html');
    res.send(data.toString());
});


app.post('/currentKw/:value', function (req, res) {

    var value = req.params.value;
    console.log('Received currentKw ' + value);

    var numVal = Number(value);

    if (isNaN(numVal)) {
        var status = 400;
    } else {
        status = 200;
        currentKw = numVal;
    }
    res.status(status).end()

});


try {
    var data = fs.readFileSync(fileName);
} catch (e) {
    data = 0;
    fs.writeFileSync(fileName, data.toString());
    console.log('File ' + fileName + ' created');
}

var frequency = 60; //per hour

setInterval(function () {
    try {
        var data = fs.readFileSync(fileName);
    } catch (e) {
        data = 0;
    }

    data = Number(data);
    if (isNaN(data)) {
        console.error('Invalid content in ' + fileName + ': ' + data + ' is NaN');
    }
    var delta = currentKw / frequency;
    data += delta;

    if (delta) {
        fs.writeFileSync(fileName, data);
        console.log('Meter value ' + data + '  written to '+ fileName);
    }

}, frequency*1000);

app.listen(10000, function () {
    console.log('Meter listening on port 10000!');
});
