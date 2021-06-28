/*jshint esversion: 6 */

var express = require('express');
var mongo = require('../config/db');
var db;
var router = express.Router();
mongo.connectToServer((err, client) => {
    db = mongo.getDb();
    console.log(`Connected to ${db.namespace}.`);
});

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/tickers', (req, res) => {
    var cryptocurrency = req.query.currency, db_collection = `${cryptocurrency}_Tickers`;
    db.collection(db_collection)
        .find()
        .limit(50)
        .sort({ time: -1 })
        .toArray((err, crypto) => {
            if (err) res.send(err);
            res.json(crypto);
        });
});

module.exports = router;

// var querystring = require('querystring');