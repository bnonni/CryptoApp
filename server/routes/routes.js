/*jshint esversion: 6 */

var express = require('express');
var db = require('../config/db');
var router = express.Router();

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
    var cryptocurrency = req.query.currency, db_tickers = `${cryptocurrency}_Tickers`;
    db.collection(db_tickers)
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