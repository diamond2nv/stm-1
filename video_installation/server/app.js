// Serves the game and assets.

/*jslint node: true, maxlen: 80 */

'use strict';

var WebSocketServer = require('websocket').server;
var http = require('http');
var mixer = require('./mixer');
var stm = require('./stm');
var args = process.argv.slice(2);

function onConnectedToStm() {
    var server = http.createServer(function (request, response) {
        console.log((new Date()) + ' Received request for ' + request.url);
        response.writeHead(404);
        response.end();
    });

    server.listen(8080, function () {
        console.log((new Date()) + ' Server is listening on port 8080');
    });

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on('request', function (request) {
        var connection = request.accept(null, request.origin);
        console.log((new Date()) + ' Connection accepted.');
        mixer.connection = connection;
    });
}

function onData(data) {
    var scanPixels = data.data.map(function (datum) {
        return {x: datum[0], y: datum[1], intensity: datum[2] / 0xffff};
    });
    mixer.onScanPixels(scanPixels);
}

if (args.length === 0) {
    stm.listSerialPorts(
        function (ports) {
            console.log('Specify serial port as first argument.');
            console.log('');
            console.log('Available ports:');
            ports.forEach(function (port) {
                console.log('');
                console.log('  * ' + port.comName);
            });
        }
    );
} else {
    stm.connect({
        comName: args[0],
        onConnected: onConnectedToStm,
        onData: onData
    });
}
