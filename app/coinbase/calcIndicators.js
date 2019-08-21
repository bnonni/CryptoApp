var mongo = require('../config/db');
const RSI = require('technicalindicators').RSI;
const OBV = require('technicalindicators').OBV;
const ADL = require('technicalindicators').ADL;
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
   OBV: [obv_out[0], obv_out[1], obv_out[2]]
  };

  var collection = curr + "_OBV_Data";
  db.collection(collection).insertOne(OBV_log, (err, result) => {
   if (err) return console.log(err);
   console.log("Saved OBV Data to " + collection + ".");
   // console.log(OBV_log);

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
   // console.log(btc_prices);
   // console.log(btc_volume);

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
   calcIndicators.calcBtcOBV(btc_prices, btc_volume, RSI_output);
  });
 },

 calcBtcOBV: (prices, volumes, rsi) => {
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

  //log the OBV to Mongo
  calcIndicators.logOBV("BTC", OBV_output, OBV_input);

  //calculate accumulation distribution for BTC
  calcIndicators.calcAccDist("BTC", 14, rsi, OBV_output, btc_pri, btc_vol);
 },

 calcAccDist: (currency, RSI_period, RSI, OBV, closing, volumes) => {
  let ADL_input = {
   high: [62.3400, 62.0500, 62.2700, 60.7900, 59.9300, 61.7500, 60.0000, 59.0000, 59.0700, 59.2200, 58.7500, 58.6500, 58.4700, 58.2500, 58.3500, 59.8600, 59.5299, 62.1000, 62.1600, 62.6700, 62.3800, 63.7300, 63.8500, 66.1500, 65.3400, 66.4800, 65.2300, 63.4000, 63.1800, 62.7000],
   low: [61.3700, 60.6900, 60.1000, 58.6100, 58.7120, 59.8600, 57.9700, 58.0200, 57.4800, 58.3000, 57.8276, 57.8600, 57.9100, 57.8333, 57.5300, 58.5800, 58.3000, 58.5300, 59.8000, 60.9300, 60.1500, 62.2618, 63.0000, 63.5800, 64.0700, 65.2000, 63.2100, 61.8800, 61.1100, 61.2500],
   close: closing,
   volume: volumes
  }
  //detect buy/sell signal using RSI output @ 14 periods & OBV
  buySellFunctions.buySignalRSI(currency, RSI_period, RSI, OBV, btc_prices);
  setTimeout(() => {
   buySellFunctions.sellSignalRSI(currency, RSI_period, RSI, btc_prices);
  }, 100);
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