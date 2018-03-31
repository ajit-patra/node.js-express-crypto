'use strict';

var assert = require('assert');

var https = require('https'),
    fs = require('fs'),
    util = require('util');
 
var agent = new https.Agent({
    maxSockets : 10,
    rejectUnauthorized : false,
    ca: fs.readFileSync('resources/keys/ca.crt'),
    key: fs.readFileSync("resources/keys/userA.key"),
    cert: fs.readFileSync("resources/keys/userA.crt")
});

var session;
var createConnection = agent.createConnection;

//Override createConnection on agent to inject session.
//This is better than passing session to options directly because this might use an async lookup, etc.
agent.createConnection = function (opts) {
    if (session) {
        opts.session = session;
    }
    return createConnection.call(agent, opts);
};


var options = {
    scheme : 'https',
    host : 'localhost',
    method : 'POST',
    port: 8443,
    path: '/api/crypto/',
    headers: {
        'Content-Type': 'application/json'
    },
    agent : agent
};

function doEncryptionAndDecryption(input_data) {

    console.log(util.format("\n**** Encryption and decryption with algo: %s ****\n", input_data.algo));
    console.log(util.format("Plain text: %s\n", input_data.text));

    //First request, full handshake.
    var req = https.request(options, function (res) {

        //Different between 0.11.x and prior versions.
        var ssl = req.socket.ssl || req.socket.pair.ssl;

        // save this session to reuse in the 2nd request
        session = ssl.getSession();
        var responseString = ''
        res.on('data', function (data) {
            responseString += data;
        });

        res.once('end', function () {

            console.log('Response after encryption: ' + responseString);

            // second request, session should be reused now.
            var _req = https.request(options, function (_res) {
                
                responseString = '';
                _res.on('data', function (data) {
                    responseString += data;
                });

                _res.on('end', function () {
                    // is it reused?
                    assert(_req.socket.isSessionReused(), 'Expected session to be reused.');
                    console.log('Response after decryption: ' + responseString);
                });
            });

            input_data.type = 'decrypt';
            input_data.text = JSON.parse(responseString).data;

            _req.write(JSON.stringify(input_data));
            _req.end();
        });
    });

    req.write(JSON.stringify(input_data));
    req.end();
};


doEncryptionAndDecryption({
    type: 'encrypt',
    algo: 'aes-256-ctr',
    text: 'A1B2C3D4E5G6A1B2C3D4E5G6'
});

// Below call is not tested properly. During decryption, last block is failing.

//doEncryptionAndDecryption({
//    type: 'encrypt',
//    algo: 'aes-256-cbc',
//    text: 'aaaaaaaaaaaaaaaa8899667755443322'
//});
