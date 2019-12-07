/*jshint esversion: 6 */

var express = require('express');
var mongo = require('../config/db');
var db;
var router = express.Router();
mongo.connectToServer((err, client) => {
    db = client.getDb();

    router.get('/', (req, res, db) => {
        res.render('index');
    });

    router.get('/login', (req, res, db) => {
        res.render('login');
    });

    router.get('/register', (req, res, db) => {
        res.render('register');
    });

    router.get('/getAll', (req, res, db) => {
        Rental.find({},
            function (err, rentals) {
                if (err) res.send(err);
                res.json(rentals);
            });
    });

    router.post('/tickers', (req, res, db) => {
        var CCreq = req.body, BTC = CCreq.bitcoin, ETH = CCreq.ethereum, LTC = CCreq.litecoin, cryptocurrency;
        ((cryptocurrency = BTC) ? (BTC != null) : (cryptocurrency = ETH) ? (ETH != null) : (cryptocurrency = LTC))
        console.log(cryptocurrency);
        db.collection(cryptocurrency + '_Tickers').find(50).toArray((err, crypto) => {
            if (err) res.send(err);
            res.json({ title: cryptocurrency, tickers: crypto });
        });
    });
});
module.exports = router;