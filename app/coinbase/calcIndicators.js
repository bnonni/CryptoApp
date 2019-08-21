var mongo = require('../config/db');
let RSI = require("technicalindicators").RSI;
let OBV = require("technicalindicators").OBV;
var buySellFunctions = require('./buySell');
var db = mongo.getDb();
mongo.connectToServer((err, client) => {
 db = mongo.getDb();
});

module.exports = calcIndicators = {
 logRSI: (curr, rsi_output) => {
  //New Object - RSI MongoDB Log
  var RSI_log = {
   currency: curr,
   time: new Date(Date.now()).toLocaleString(),
   period: 14,
   RSI: rsi_output[0]
  };
  var collection = curr + "_RSI14_Data";
  db.collection(collection).insertOne(RSI_log, (err, result) => {
   if (err) return console.log(err);
   console.log("Saved RSIs to " + collection + ".");
  });
 },

 logOBV: (curr, obv_out, obv_in) => {
  //log OBV to Mongo
  var OBV_log = {
   currency: curr,
   time: new Date(Date.now()).toLocaleString(),
   close: [obv_in.close[0], obv_in.close[1], obv_in.close[2]],
   volume: [obv_in.volume[0], obv_in.volume[1], obv_in.volume[2]],
   OBV: [OBV_output[0], OBV_output[1], OBV_output[2]]
  };
  var collection = curr + "_OBV_Data";
  db.collection(collection).insertOne(OBV_log, (err, result) => {
   if (err) return console.log(err);
   console.log("Saved OBVs to " + collection + ".");
  });
 },

 //Calc BTC Ticker RSI
 calcBtcRSI14: () => {
  var currency = "BTC";
  db.collection("BTC_Tickers").find().toArray((err, btc_tickers) => {
   if (err) return console.log(err);
   var btc_prices = [], btc_volume = [];
   for (var i = btc_tickers.length - 1; i >= 0; i--) {
    if (btc_tickers[i] != undefined) {
     btc_prices.push(btc_tickers[i].price);
     btc_volume.push(btc_tickers[i].volume);
    }
   }
   console.log(btc_prices);
   console.log(btc_volume);
   //Input Object - RSI Calculation
   var RSI_input = {
    values: btc_prices,
    period: 14
   };
   //console.log(input);
   //Output Object - RSI Calculation
   var RSI_output = RSI.calculate(RSI_input);

   //log RSI output for record keeping
   calcIndicators.logRSI(currency, RSI_output);

   //calculate the OBV for BTC
   calcIndicators.calcBtcOBV(btc_prices, btc_volume);
  });
 },

 calcBtcOBV: (prices, volumes) => {
  var i = 0, btc_pri = [], btc_vol = [];
  while (i <= 20) {
   var pri = Number(parseFloat(prices[i]).toFixed(2));
   btc_pri.push(pri);
   var vol = Number(Math.round(volumes[i]));
   btc_vol.push(vol);
   i++;
  }
  // console.log(typeof (btc_pri[0]));
  var OBV_input = {
   close: btc_pri,
   volume: btc_vol
  }
  //OBV Output Object
  //console.log(OBV_input);
  var OBV_output = OBV.calculate(OBV_input)
  //console.log(OBV_output)
  calcIndicators.logOBV("BTC", OBV_output, OBV_input);
 },

 calcAccDist: () => {
  //detect buy/sell signal using RSI output @ 14 periods & OBV
  buySellFunctions.buySignalRSI(currency, RSI_input.period, RSI_output, btc_prices);
  setTimeout(() => { buySellFunctions.sellSignalRSI(currency, input.period, RSI_output, btc_prices); }, 100);
 },

 //Calculate RSI - ETH Tickers
 calcEthRSI14: () => {
  var currency = "ETH";
  //Find ETH tickers & calculate RSI
  db.collection("ETH_Tickers").find().toArray((err, eth_tickers) => {
   var eth_prices = [];
   for (var i = eth_tickers.length - 1; i >= 0; i--) {
    if (eth_tickers[i] != undefined) {
     eth_prices.push(eth_tickers[i].price);
    }
   }
   // console.log("ETH Price: " + eth_prices[0]);
   //Input Object - RSI Calculation
   var ETH_RSI_input = {
    values: eth_prices,
    period: 14
   };
   // console.log(ETH_RSI_input);
   //Output Object - RSI Calculation
   var ETH_RSI_output = RSI.calculate(ETH_RSI_input);
   // console.log(ETH_RSI_output);

   buySellFunctions.buySignalRSI(currency, ETH_RSI_input.period, ETH_RSI_output, eth_prices);

   calcIndicators.logRSI(currency, ETH_RSI_output);

   setTimeout(() => { buySellFunctions.sellSignalRSI(currency, ETH_RSI_input.period, ETH_RSI_output, eth_prices); }, 100)

  });
 },

 //Calc LTC Ticker RSI
 calcLtcRSI14: () => {
  var currency = "LTC";
  //Find ETH tickers & calculate RSI
  db.collection("LTC_Tickers").find().toArray((err, ltc_tickers) => {
   if (err) return console.log(err);
   var ltc_prices = [];
   for (var i = ltc_tickers.length - 1; i >= 0; i--) {
    if (ltc_tickers[i] != undefined) {
     ltc_prices.push(ltc_tickers[i].price);
    }
   }
   // console.log("Line 148: BTC Price: " + LTC_prices[0]);
   //Input Object - RSI Calculation
   var LTC_RSI_input = {
    values: ltc_prices,
    period: 14
   };
   //  console.log(LTC_RSI_input);
   //Output Object - RSI Calculation
   var LTC_RSI_output = RSI.calculate(LTC_RSI_input);
   //  console.log(LTC_RSI_output);
   buySellFunctions.buySignalRSI(currency, LTC_RSI_input.period, LTC_RSI_output, ltc_prices);

   calcIndicators.logRSI(currency, LTC_RSI_output);

   setTimeout(() => { buySellFunctions.sellSignalRSI(currency, LTC_RSI_input.period, LTC_RSI_output, ltc_prices); }, 100);

  });
 }
}