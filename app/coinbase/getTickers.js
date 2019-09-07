const mongo = require('../config/db'),
 authedClient = require('./Coinbase'),
 calcIndicators = require('./calcIndicators'),
 buySellFunctions = require('./buySell');
var db;
mongo.connectToServer(function (err, client) {
 db = mongo.getDb();
});

module.exports = getTickers = {

 // pullBTCtickers: () => { },/** */

 //Coinbase API call - BTC Tickers
 getBtcTickers: () => {
  const btc_callback = (err, response, btc) => {
   db.collection('BTC_Tickers').insertOne(btc, (err, result) => {
    if (err) return console.log(err);
    console.log('\n/* -------------------------BTC------------------------- */\n\nSaved tickers to BTC_Tickers.');
    // console.log(btc);
   });
   var data = {
    currency: 'BTC',
    period: 14,
    high: [],
    low: [],
    volumes: [],
    prices: []
   }
   db.collection('BTC_Tickers').find().toArray((err, tickers) => {
    if (err) return console.log(err);
    for (var i = tickers.length - 1; i >= 0; i -= 10) {
     if (tickers[i] != undefined) {
      data.prices.push(tickers[i].price);
      data.volumes.push(tickers[i].volume);
      data.low.push(tickers[i].bid);
      data.high.push(tickers[i].ask);
     }
    }
    // console.log(data);
    // calculate BTC RSI
    var RSI = calcIndicators.calcRSI(data);
    // console.log(RSI);

    // calculate BTC OBV
    var OBV = calcIndicators.calcOBV(data);
    // console.log(OBV);

    // calculate BTC accumulation distribution
    var ADL = calcIndicators.calcAccDist(data);
    // console.log(ADL);

    // detect buy/sell signal using RSI output @ 14 periods & OBV
    buySellFunctions.buySignal(data.currency, 14, RSI, OBV, ADL);
    // console.log('RSI');console.log(RSI);console.log('OBV');console.log(OBV);console.log('ADL');console.log(ADL);

    setTimeout(() => { buySellFunctions.sellSignal('BTC', 14, RSI, OBV, ADL); }, 100);
    // getTickers.getEthTickers();
   });
  };

  authedClient.getProductTicker('BTC-USD', btc_callback);
  setTimeout(getTickers.getBtcTickers, 60000);
 },

 //Coinbase API call - ETH Tickers
 getEthTickers: () => {
  const eth_tickers_cb = (err, response, eth) => {
   //  console.log('ETH Ticker: ' + eth[0]);
   db.collection('ETH_Tickers').insertOne(eth, (err, result) => {
    if (err) return console.log(err);
    console.log('\n/* -------------------------ETH------------------------- */\n\nSaved tickers to ETH_Tickers.');
   });
   var data = {
    currency: 'ETH',
    period: 14,
    high: [],
    low: [],
    volumes: [],
    prices: []
   }
   db.collection('ETH_Tickers').find().toArray((err, tickers) => {
    if (err) return console.log(err);
    for (var i = tickers.length - 1; i >= 0; i -= 10) {
     if (tickers[i] != undefined) {
      data.prices.push(tickers[i].price);
      data.volumes.push(tickers[i].volume);
      data.low.push(tickers[i].bid);
      data.high.push(tickers[i].ask);
     }
    }
    // console.log(data);
    // calculate BTC RSI
    var RSI = calcIndicators.calcRSI(data);
    // console.log(RSI);

    // calculate BTC OBV
    var OBV = calcIndicators.calcOBV(data);
    // console.log(OBV);

    // calculate BTC accumulation distribution
    var ADL = calcIndicators.calcAccDist(data);
    // console.log(ADL);

    // detect buy/sell signal using RSI output @ 14 periods & OBV
    buySellFunctions.buySignal('ETH', 14, RSI, OBV, ADL);
    // console.log('RSI');console.log(RSI);console.log('OBV');console.log(OBV);console.log('ADL');console.log(ADL);

    setTimeout(() => { buySellFunctions.sellSignal('ETH', 14, RSI, OBV, ADL); }, 100);

   });
  }
  authedClient.getProductTicker('ETH-USD', eth_tickers_cb);
  setTimeout(getTickers.getEthTickers, 60100);
 },

 //Coinbase API call - LTC Tickers
 getLtcTickers: () => {
  const ltc_ticker_cb = (err, response, ltc) => {
   // console.log(ltc);
   db.collection('LTC_Tickers').insertOne(ltc, (err, result) => {
    if (err) return console.log(err);
    console.log('\n/* -------------------------LTC------------------------- */\n\nSaved tickers to LTC_Tickers.');
   });
   var data = {
    currency: 'LTC',
    period: 14,
    high: [],
    low: [],
    volumes: [],
    prices: []
   }
   db.collection('LTC_Tickers').find().toArray((err, tickers) => {
    if (err) return console.log(err);
    for (var i = tickers.length - 1; i >= 0; i -= 10) {
     if (tickers[i] != undefined) {
      data.prices.push(tickers[i].price);
      data.volumes.push(tickers[i].volume);
      data.low.push(tickers[i].bid);
      data.high.push(tickers[i].ask);
     }
    }
    // console.log(data);
    // calculate BTC RSI
    var RSI = calcIndicators.calcRSI(data);
    // console.log(RSI);

    // calculate BTC OBV
    var OBV = calcIndicators.calcOBV(data);
    // console.log(OBV);

    // calculate BTC accumulation distribution
    var ADL = calcIndicators.calcAccDist(data);
    // console.log(ADL);

    // detect buy/sell signal using RSI output @ 14 periods & OBV
    buySellFunctions.buySignal('LTC', 14, RSI, OBV, ADL);
    // console.log('RSI');console.log(RSI);console.log('OBV');console.log(OBV);console.log('ADL');console.log(ADL);

    setTimeout(() => { buySellFunctions.sellSignal('LTC', 14, RSI, OBV, ADL); }, 100);
   });
  }
  authedClient.getProductTicker('LTC-USD', ltc_ticker_cb);
  setTimeout(getTickers.getLtcTickers, 60200);
 }
}