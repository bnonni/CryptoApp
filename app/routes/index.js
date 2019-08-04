var express = require('express');
var mongo = require('../config/db');
var db;
mongo.connectToServer(function (err, client) {
 db = mongo.getDb();
});
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
 // var eth = req.body.ethereum;
 // var btc = req.body.bitcoin
 if (req.body.ethereum) {
  db.collection("BTC_Tickers").find().toArray((err, btc) => {
   res.render("tickers", { BTC_tickers: btc });
  });
 } else {
  db.collection("ETH_Tickers").find().toArray((err, eth) => {
   res.render("tickers", { ETH_tickers: eth });
  });
 }
});

module.exports = router;
