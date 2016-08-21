var express = require("express");
var SfdcOauther = require('./sfdc-oauther');

var app = express();
var client = new SfdcOauther('production OR sandbox', 'consumer id', 'consumer secret', 'instance url OPTIONAL');

app.get("/authorize", function (req, res) {
    // example scopes: api id profile refresh_token
    res.redirect(client.getAuthorizeUrl('scopes', 'http://localhost:3000/callback'));
});

app.get("/callback", function (req, res) {
    client.getAccessToken(req.query.code, 'callback url').then(function (result) {
        console.log(result);
        res.send('<html><body><h1>Success!</h1></body></html>');
    }).catch(function (error) {
        res.send(error);
    });
});

app.listen(3000);
