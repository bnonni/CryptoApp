var express = require('express');
var mongo = require('../config/db');
var db;
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
 res.render("index");
});

router.get("/login", (req, res) => {
 res.render("login");
});

router.get("/register", (req, res) => {
 res.render("register");
});

router.post("/tickers", (req, res) => {
 var reqETH = req.body.ethereum, reqBTC = req.body.bitcoin, reqLTC = req.body.litecoin;
 if (reqBTC != null) {
  console.log(reqBTC);
  mongo.connectToServer(function (err, client) {
   db = mongo.getDb();
   db.collection("BTC_Tickers").find().toArray((err, btc) => {
    res.render("tickers", { title: reqBTC, tickers: btc });
   });
  });
 } else if (reqETH != null) {
  console.log(reqETH);
  mongo.connectToServer(function (err, client) {
   db = mongo.getDb();
   db.collection("ETH_Tickers").find().toArray((err, eth) => {
    res.render("tickers", { title: reqETH, tickers: eth });
   });
  });
 } else if (reqLTC != null) {
  console.log(reqLTC);
  mongo.connectToServer(function (err, client) {
   db = mongo.getDb();
   db.collection("LTC_Tickers").find().toArray((err, ltc) => {
    res.render("tickers", { title: reqLTC, tickers: ltc });
   });
  });
 }
});

module.exports = router;
