/*jshint esversion: 6 */

var express = require('express');
var mongo = require('../config/db');
var db, BTC_Tickers, ETH_Tickers, LTC_Tickers;
var querystring = require('querystring');
var router = express.Router();
mongo.connectToServer((err, client) => {
    db = mongo.getDb();
    BTC_Tickers = db.collection('BTC_Tickers');
    ETH_Tickers = db.collection('ETH_Tickers');
    LTC_Tickers = db.collection('LTC_Tickers');
    // console.log(BTC_Tickers.namespace, ETH_Tickers.namespace, LTC_Tickers.namespace);
});

router.get('/', (req, res, db) => {
    res.render('index');
});

router.get('/login', (req, res, db) => {
    res.render('login');
});

router.get('/register', (req, res, db) => {
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

// router.post('/tickers', (req, res, db) => {
    
// });

module.exports = router;

/**
 * // BTC_Tickers.find()
//     .limit(50)
//     .sort({ time: -1 })
.toArray((err, btc) => {
if (err) res.send(err);
res.json(btc);        
});
*   ETH_Tickers.find()
.limit(50)
.sort({ time: -1 })
.toArray((err, eth) => {
if (err) res.send(err);
LTC_Tickers.find()
.limit(50)
.sort({ time: -1 })
.toArray((err, ltc) => {
if (err) res.send(err);
const tickers = {
BTC: btc,
ETH: eth,
LTC: ltc
};});});
 */