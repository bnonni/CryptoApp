var mongo = require('../config/db');
const RSI = require('technicalindicators').RSI;
const OBV = require('technicalindicators').OBV;
const ADL = require('technicalindicators').ADL;
var LR = require('simple-statistics').linearRegression;
var buySellFunctions = require('./buySell');
var db;
mongo.connectToServer((err, client) => {
 db = mongo.getDb();
});

module.exports = calcIndicators = {

 pullBTCtickers: () => {
  var data = {
   prices: [],
   volumes: [],
   low: [],
   high: []
  }
  db.collection("BTC_Tickers").find().toArray((err, tickers) => {
   if (err) return console.log(err);
   for (var i = tickers.length - 1; i >= 0; i--) {
    if (tickers[i] != undefined) {
     data.prices.push(tickers[i].price);
     data.volume.push(tickers[i].volume);
     data.low.push(btc_tickers[i].bid);
     data.high.push(btc_tickers[i].ask);
    }
   }
   console.log(data)
   return data;
  });
 },

 //Calc BTC Ticker RSI
 calcBtcRSI14: () => {
  var btc_tickers = calcIndicators.pullBTCtickers();
  var currency = "BTC", btc_prices = [], btc_volume = [];
  for (var i = btc_tickers.prices.length - 1; i >= 0; i--) {
   if (btc_tickers[i] != undefined) {
    btc_prices.push(btc_tickers[i].price);
    btc_volume.push(btc_tickers[i].volume);
   }
  }
  // console.log(btc_prices); console.log(btc_volume);

  // Input Object - RSI Calculation
  var input = {
   values: btc_prices,
   period: 14
  };//console.log(input);

  // Output Object - RSI Calculation
  var RSIs = RSI.calculate(input);

  // Log RSI output for record keeping
  calcIndicators.logRSI(currency, RSIs);

  return RSIs;
 },

 logRSI: (curr, rsi_output) => {
  //New Object - RSI MongoDB Log
  var RSI_log = {
   currency: curr,
   time: new Date(Date.now()).toLocaleString(),
   period: 14,
   RSI: [rsi_output[0], rsi_output[1], rsi_output[2]]
  };
  var collection = curr + "_RSI14_Data";
  db.collection(collection).insertOne(RSI_log, (err, result) => {
   if (err) return console.log(err);
   console.log("Saved RSIs to " + collection + ".");
  });
 },

 calcBtcOBV: () => {
  var btc_tickers = calcIndicators.pullBTCtickers();
  var i = 0, prices = [], volumes = [];
  while (i <= 20) {
   var price = Number(parseFloat(btc_tickers.price[i]).toFixed(2));
   btc_prices.push(price);
   var volume = Number(Math.round(btc_tickers.volume[i]));
   btc_volumes.push(volume);
   i++;
  }
  // console.log(typeof (btc_pri[0]));
  var input = {
   close: prices,
   volume: volumes
  }
  //OBV Output Object - console.log(OBV_input);
  var OBVs = OBV.calculate(input)
  //console.log(OBV_output)

  //log the OBV to Mongo
  calcIndicators.logOBV("BTC", input, OBVs);

  var slope = LR(OBV);
  console.log("slope");
  console.log(slope);

  //IF(Slope(OBV[0],OBV[1],OBV[2])>0

  //return OBV data
  return OBVs;
 },

 logOBV: (curr, obv_in, OBV) => {

  //log OBV to Mongo
  var OBV_log = {
   currency: curr,
   time: new Date(Date.now()).toLocaleString(),
   close: [obv_in.close[0], obv_in.close[1], obv_in.close[2]],
   volume: [obv_in.volume[0], obv_in.volume[1], obv_in.volume[2]],
   OBV: [OBV[0], OBV[1], OBV[2]]
  };

  var collection = curr + "_OBV_Data";
  db.collection(collection).insertOne(OBV_log, (err, result) => {
   if (err) return console.log(err);
   console.log("Saved OBV Data to " + collection + ".");
   // console.log(OBV_log);
  });
 },

 calcAccDist: () => {
  var btc_tickers = calcIndicators.pullBTCtickers();

  let ADL_input = {
   high: btc_tickers.high,
   low: btc_tickers.low,
   close: btc_tickers.prices,
   volume: btc_tickers.volumes
  }
  var ADLs = ADL.calculate(ADL_input);

  calcIndicators.logADL("BTC", ADL_input, ADLs);

  var data = {
   prices: btc_tickers.prices,
   ADL: ADLs
  }

  return data;
 },

 logADL: (curr, adl_in, adl) => {
  //log OBV to Mongo
  var ADL_log = {
   currency: curr,
   time: new Date(Date.now()).toLocaleString(),
   close: [adl_in.close[0], adl_in.close[1], adl_in.close[2]],
   volume: [adl_in.volume[0], adl_in.volume[1], adl_in.volume[2]],
   OBV: [adl[0], adl[1], adl[2]]
  };

  var collection = curr + "_ADL_Data";
  db.collection(collection).insertOne(ADL_log, (err, result) => {
   if (err) return console.log(err);
   console.log("Saved ADL Data to " + collection + ".");
   console.log(ADL_log);
  });
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