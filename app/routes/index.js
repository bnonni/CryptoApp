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
 var reqETH = req.body.ethereum;
 var reqBTC = req.body.bitcoin
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
 }
});

module.exports = router;
