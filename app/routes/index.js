var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
 res.render("index");
});

//Render BTC Tickers
router.get("/btctickers", (req, res) => {
 // console.log(res);
 res.render("btctickers.ejs", {
  BTC_tickers: btc_ticker_data
 });
});
module.exports = router;
