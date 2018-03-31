// Nodejs encryption with CTR and CBC
var crypto = require('crypto');
var util = require('util');

const algoAesCtr = 'aes-256-ctr';
const algoAesCbc = 'aes-256-cbc';
const password = 'w3hRcQp5';
const sharedSecret = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
const initializationVector = '';

function aes256CtrEncrypt(text) {
    var cipher = crypto.createCipher(algoAesCtr, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
};

function aes256CtrDecrypt(text) {
    var decipher = crypto.createDecipher(algoAesCtr, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
};


function aes256CbcEncrypt(text) {
    var cipher = crypto.createCipheriv(algoAesCbc, sharedSecret, initializationVector);    
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

function aes256CbcDecrypt(text) {
    var decipher = crypto.createDecipher(algoAesCbc, sharedSecret, initializationVector);
    var dec = decipher.update(text, 'hex', 'utf-8');
    dec += decipher.final('utf-8');
    return dec;
};


// Create endpoint /api/beers for POSTS
exports.postCrypto = function (req, res) {

    console.log("\nRequest Header:");
    console.log(req.headers);
    console.log("\nRequest Body:");
    console.log(req.body);

    try {

        if (req.body.type == "encrypt") {
            if (req.body.algo == algoAesCtr) {
                res.json({ message: 'Encryption successful!', data: aes256CtrEncrypt(req.body.text) });
            }
            else if (req.body.algo == algoAesCbc) {
                console.log('algoAesCbc');
                res.json({ message: 'Encryption successful!', data: aes256CbcEncrypt(req.body.text) });
            }
            else {
                res.json({ message: 'Invalid Algo' });
            }
        }
        else if (req.body.type == "decrypt") {
            if (req.body.algo == algoAesCtr) {
                res.json({ message: 'Decryption successful!', data: aes256CtrDecrypt(req.body.text) });
            }
            else if (req.body.algo == algoAesCbc) {
                res.json({ message: 'Decryption successful!', data: aes256CbcDecrypt(req.body.text) });
            }
            else {
                res.json({ message: 'Invalid Algo' });
            }
        }
        else {
            res.json({ message: 'Invalid type' });
        }
    } catch (e) {
        res.json({ message: e });
    }
};

// Only for testing GET
exports.getCrypto = function (req, res) {
    res.json({message: "Connected" });
};

