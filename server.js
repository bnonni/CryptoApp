#!/usr/bin/env nodejs
/*jshint esversion: 6 */
require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
require("@tensorflow/tfjs-node-gpu");
const RSI = require("technicalindicators").RSI;

/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require("coinbase-pro");
const key = process.env.key;
const secret = process.env.secret;
const passphrase = process.env.passphrase;
const apiURI = "https://api.pro.coinbase.com";
const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);


const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const path = require("path");
app.set('view engine', 'ejs');
let port = 443;  
app.listen(port, () => {
  console.log("Server listening on port " + port);
 });
 /**
  * Render HP
  */
 app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./views")
  });
});

//Render BTC Tickers
app.get("/btc-tickers", (req, res) => {
  // console.log(res);
  db.collection("BTC_Tickers").find().toArray((err, btc_ticker_data) => {
    res.render("btc-tickers.ejs", {
      BTC_tickers: btc_ticker_data,
      root: path.join(__dirname, "./views")
    });
  });
});

/**
 * MongoDB Setup
 */
const password = process.env.password;
const uri = "mongodb+srv://hu5ky5n0w:"+password+"@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
const mongo = new MongoClient(uri, { useNewUrlParser: true });
var db;
mongo.connect(err => {
 if (err) return console.log(err);
 db = mongo.db("crypto_wallet");

function buySignalRSI(currency, period, RSIs, prices){
  var start_time, end_time, today;
  var rsi_buy_decision = false;
  if(RSIs[0] >= RSIs[1]){
    if(RSIs[1] <= 28){
      if(RSIs[2] <= 29){
        if(RSIs[3] <= 32){
          rsi_buy_decision = true;
          start_time = new Date(Date.now() - 300000).toLocaleString();
          end_time = new Date(Date.now()).toLocaleString();
          logBuySellDataToMongo(currency, "buy", period, rsi_buy_decision, RSIs, prices, start_time, end_time);
        }
      }
    }
  }else{
    rsi_buy_decision = false;
  }
  today = new Date(Date.now()).toLocaleString();
  console.log(currency + ": " + period + " Period Buy Decision => " + rsi_buy_decision + " @ " + today);
}

function sellSignalRSI(currency, period, RSIs, prices){
  var start_time, end_time, today;
  var rsi_sell_decision = false;
  if(RSIs[0] >= RSIs[1]){
    if(RSIs[1] >= RSIs[2]){
      if(RSIs[2] >= RSIs[3]){
        if(RSIs[3] >= 50){
          if(RSIs[4] >= RSIs[3]){
            rsi_sell_decision = true;
            start_time = new Date(Date.now() - 300000).toLocaleString();
            end_time = new Date(Date.now()).toLocaleString();
            logBuySellDataToMongo(currency, "sell", period, rsi_sell_decision, RSIs, prices, start_time, end_time);
          }
        }
      }
    }
  }else{
    rsi_sell_decision = false;
  }
  today = new Date(Date.now()).toLocaleString();
  console.log(currency + ": " + period + " Period Sell Decision => " + rsi_sell_decision + " @ " + today);
 }

function logBuySellDataToMongo(curr, type, per, dec, rsi, pri, st, ed){
  if(type == "buy"){
    var buy_data = create_buy_obj(curr, type, per, dec, rsi, pri, st, ed);
    console.log(curr + " Buy!");
    console.log(buy_data);
    var buy_collection = curr + "_RSI14_Buys";
    db.collection(buy_collection).insertOne(buy_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Buy successful!! Saved data to " + curr + "_RSI14_Buys @ " + new Date(Date.now()).toLocaleString());
    });
  }else{
    var sell_data = create_sell_obj(curr, type, per, dec, rsi, pri, st, ed);
    console.log(curr + " Sell!");
    console.log(sell_data);
    var sell_collection = curr + "_RSI14_Sells";
    db.collection(sell_collection).insertOne(sell_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Sell successful!! Saved data to " + curr + "_RSI14_Sells @ " + new Date(Date.now()).toLocaleString());
    });
  }
}

function create_buy_obj(c, t, p, d, r, pr, s, e){
  var new_r = [];
  var new_p = [];
  for(var i = 0; i < 5; i++){
    new_r.push(r[i]);
    new_p.push(pr[i]);
  }
  var buy_data = {
    currency : c,
    type : t,
    period : p,
    buy_decision : d,
    RSIs : new_r,
    prices : new_p,
    start_time : s,
    end_time : e
  };
  return buy_data;
}

function create_sell_obj(c, t, p, d, r, pr, s, e){
  var new_r = [];
  var new_p = [];
  for(var i = 0; i < 5; i++){
    new_r.push(r[i]);
    new_p.push(pr[i]);
  }
  var sell_data = {
    currency : c,
    type : t,
    period : p,
    sell_decision : d,
    RSIs : new_r,
    prices : new_p,
    start_time : s,
    end_time : e
  };
  return sell_data;
}
/**
* BTC Functions
*/
//Coinbase API call - BTC Tickers
function getBtcTickers(){
  const btc_ticker_cb = (err, response, btc) => {
    //  console.log(btc);
    db.collection("BTC_Tickers").insertOne(btc, (err, result) => {
      if (err) return console.log(err);
      console.log("Saved tickers to BTC_Tickers.");
    });
    calcBtcRSI14();
  };
  authedClient.getProductTicker("BTC-USD", btc_ticker_cb);
  setTimeout(getBtcTickers, 60000);
 }

//Calc BTC Ticker RSI
function calcBtcRSI14 () {
 db.collection("BTC_Tickers").find().toArray((err, btc_tickers) => {
  if (err) return console.log(err);
  var btc_prices = [];
  var btc_prices_log = [];
  var j = 0;
  for(var i = btc_tickers.length - 1; i >= 0 ; i--){
    if(btc_tickers[i] != undefined){
      btc_prices.push(btc_tickers[i].price);
      if(j < 5){
        btc_prices_log.push(btc_tickers[j].price);
        j++;
      }
    }
  }
  // console.log("Line 148: BTC Price: " + btc_prices[0]);
  //Input Object - RSI Calculation
   var BTC_RSI_input = {
     values : btc_prices,
     period : 14
   };
  //  console.log(BTC_RSI_input);
   //Output Object - RSI Calculation
   var BTC_RSI_output = RSI.calculate(BTC_RSI_input);
  //  console.log(BTC_RSI_output);
   //New Object - RSI MongoDB Log
   var BTC_RSI_log = {
     currency : "BTC",
     time : new Date(Date.now()).toLocaleString(),
     period : 14,
     RSI : BTC_RSI_output
   };
  //  console.log(BTC_RSI_log);
   db.collection("BTC_RSI14_Data").insertOne(BTC_RSI_log, (err, result) => {
     if (err) return console.log(err);
     console.log("Saved RSIs to BTC_RSI14_Data.");
    });
    setTimeout(() => {
      buySignalRSI("BTC", BTC_RSI_input.period, BTC_RSI_output, btc_prices);
    }, 500);
    setTimeout(() => {
      sellSignalRSI("BTC", BTC_RSI_input.period, BTC_RSI_output, btc_prices);
    }, 1000);
  });
}
  /**
   * LTC Functions
   */
  //Coinbase API call - LTC Tickers
  function getLtcTickers(){
    const ltc_ticker_cb = (err, response, ltc) => {
      // console.log(ltc);
      db.collection("LTC_Tickers").insertOne(ltc, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to LTC_Tickers.");
      });
      calcLtcRSI14();
    };
    authedClient.getProductTicker("LTC-USD", ltc_ticker_cb);
    setTimeout(getLtcTickers, 60500);
  }
  //Calc LTC Ticker RSI
  function calcLtcRSI14 () {
  //Find ETH tickers & calculate RSI
  db.collection("LTC_Tickers").find().toArray((err, ltc_tickers) => {
    if (err) return console.log(err);
    var ltc_prices = [];
    var ltc_prices_log = [];
    var j = 0;
    for(var i = ltc_tickers.length - 1; i >= 0 ; i--){
      if(ltc_tickers[i] != undefined){
        ltc_prices.push(ltc_tickers[i].price);
        if(j < 5){
          ltc_prices_log.push(ltc_tickers[j].price);
          j++;
        }
      }
    }
    // console.log("Line 148: BTC Price: " + LTC_prices[0]);
    //Input Object - RSI Calculation
    var LTC_RSI_input = {
      values : ltc_prices,
      period : 14
    };
    //  console.log(LTC_RSI_input);
    //Output Object - RSI Calculation
    var LTC_RSI_output = RSI.calculate(LTC_RSI_input);
    //  console.log(LTC_RSI_output);

    //New Object - RSI MongoDB Log
    var LTC_RSI_log = {
      currency : "LTC",
      time : new Date(Date.now()).toLocaleString(),
      period : 14,
      RSI : LTC_RSI_output
    };
    //console.log(LTC_RSI_log);
    db.collection("LTC_RSI14_Data").insertOne(LTC_RSI_log, (err, result) => {
      if (err) return console.log(err);
      console.log("Saved RSIs to LTC_RSI14_Data.");
      });
      setTimeout(() => {
        buySignalRSI("LTC",  LTC_RSI_input.period, LTC_RSI_output, ltc_prices);
      }, 500);
      setTimeout(() => {
        sellSignalRSI("LTC",  LTC_RSI_input.period, LTC_RSI_output, ltc_prices);
      }, 1000);
    });
  }
  /**
   * ETH Functions
   */
  //Coinbase API call - ETH Tickers
  function getEthTickers(){
    const eth_tickers_cb = (err, response, eth) => {
      //  console.log("ETH Ticker: " + eth[0]);
      db.collection("ETH_Tickers").insertOne(eth, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to ETH_Tickers.");
      });
      calcEthRSI14();
    };
    authedClient.getProductTicker("ETH-USD", eth_tickers_cb);
    setTimeout(getEthTickers, 61000);
  }
  //Calculate RSI - ETH Tickers
  function calcEthRSI14 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH_Tickers").find().toArray((err, eth_tickers) => {
      var eth_prices = [];
      var eth_prices_log = [];
      var j = 0;
      for(var i = eth_tickers.length - 1; i >= 0; i--){
        if(eth_tickers[i] != undefined){
          eth_prices.push(eth_tickers[i].price);
          if(j < 5){
            eth_prices_log.push(eth_tickers[j].price);
            j++;
          }
        }
      }
      // console.log("ETH Price: " + eth_prices[0]);
      //Input Object - RSI Calculation
      var ETH_RSI_input = {
        values : eth_prices,
        period : 14
      };
      // console.log(ETH_RSI_input);
      //Output Object - RSI Calculation
      var ETH_RSI_output = RSI.calculate(ETH_RSI_input);
      // console.log(ETH_RSI_output);

      //New Object - RSI MongoDB Log
      var ETH_RSI_log = {
        currency : "ETH",
        time : new Date(Date.now()).toLocaleString(),
        period : 14,
        RSI : ETH_RSI_output
      };
      // console.log(ETH_RSI_log);
      db.collection("ETH_RSI14_Data").insertOne(ETH_RSI_log, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved RSIs to ETH_RSI14_Data.");
       });
       setTimeout(() => {
        buySignalRSI("ETH",  ETH_RSI_input.period, ETH_RSI_output, eth_prices);
      }, 500);
      setTimeout(() => {
        sellSignalRSI("ETH",  ETH_RSI_input.period, ETH_RSI_output, eth_prices);
      }, 1000);
    });
  }
  getBtcTickers();
  setTimeout(() => {
    getLtcTickers();
  }, 500);
  setTimeout(() => {
    getEthTickers();
  }, 1000);
});
