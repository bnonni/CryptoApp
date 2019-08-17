var mongo = require('../config/db');
var authedClient = require('./Coinbase');
var calcIndicators = require('./calcIndicators');
var db;
mongo.connectToServer(function (err, client) {
 db = mongo.getDb();
});

module.exports = getTickers = {

 //Coinbase API call - BTC Tickers
 getBtcTickers: () => {
  const btc_ticker_cb = (err, response, btc) => {
   //  console.log(btc);
   db.collection("BTC_Tickers").insertOne(btc, (err, result) => {
    if (err) return console.log(err);
    console.log("Saved tickers to BTC_Tickers.");
    calcIndicators.calcBtcRSI14(db);
   });
  };
  authedClient.getProductTicker("BTC-USD", btc_ticker_cb);
  setTimeout(getTickers.getBtcTickers, 60000);
 },

 //Coinbase API call - ETH Tickers
 getEthTickers: () => {
  const eth_tickers_cb = (err, response, eth) => {
   //  console.log("ETH Ticker: " + eth[0]);
   db.collection("ETH_Tickers").insertOne(eth, (err, result) => {
    if (err) return console.log(err);
    console.log("Saved tickers to ETH_Tickers.");
    calcIndicators.calcEthRSI14(db);
   });
  };
  authedClient.getProductTicker("ETH-USD", eth_tickers_cb);
  setTimeout(getTickers.getEthTickers, 60100);
 },

 //Coinbase API call - LTC Tickers
 getLtcTickers: () => {
  const ltc_ticker_cb = (err, response, ltc) => {
   // console.log(ltc);
   db.collection("LTC_Tickers").insertOne(ltc, (err, result) => {
    if (err) return console.log(err);
    console.log("Saved tickers to LTC_Tickers.");
    calcIndicators.calcLtcRSI14(db);
   });
  };
  authedClient.getProductTicker("LTC-USD", ltc_ticker_cb);
  setTimeout(getTickers.getLtcTickers, 60200);
 }
}
