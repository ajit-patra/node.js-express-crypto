var express = require('express');
var fs = require('fs');
var https = require('https');
var bodyParser = require('body-parser');

var cryptoController = require('./controllers/crypto');


var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /crypto
router.route('/crypto')
    .post(cryptoController.postCrypto)
    .get(cryptoController.getCrypto);

// Register all our routes with /api
app.use('/api', router);

app.get('*', function (req, res, next) {
    var err = new Error();
    err.status = 404;
    next(err);
});


var privateKey = fs.readFileSync('resources/keys/server.key', 'utf8');
var certificate = fs.readFileSync('resources/keys/server.crt', 'utf8');
var caCert = fs.readFileSync('resources/keys/ca.crt', 'utf8');

var tlsOptions = { key: privateKey, cert: certificate, ca: caCert };

https.createServer(tlsOptions, app).listen(8443);
