var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
 res.render("index");
});

router.get("/login", (req, res) => {
 res.render("login");
});

router.get("/register", (req, res) => {
 res.render("login");
});

//Render BTC Tickers
router.get("/btc-tickers", (req, res) => {
 // console.log(res);
 db.collection("BTC_Tickers").find().toArray((err, btc_ticker_data) => {
  res.render("btc-tickers.ejs", {
   BTC_tickers: btc_ticker_data,
   root: path.join(__dirname, "./views")
  });
 });
});

//Render BTC Tickers
router.get("/btctickers", (req, res) => {
 res.render("btctickers.ejs", {
  BTC_tickers: btc_ticker_data
 });
});
module.exports = router;
