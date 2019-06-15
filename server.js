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

/**
 * MongoDB Setup
 */
const password = process.env.password;
const uri = "mongodb+srv://hu5ky5n0w:"+password+"@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
const mongo = new MongoClient(uri, { useNewUrlParser: true });
var db;
mongo.connect(err => {
 let port = 443;  
 if (err) return console.log(err);
 db = mongo.db("crypto_wallet");
 
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

 //Render ETH Tickers
 app.get("/eth-tickers", (req, res) => {
   // console.log(res);
   db.collection("ETH_Tickers").find().toArray((err, eth_ticker_data) => {
     res.render("eth-tickers.ejs", {
       ETH_tickers: eth_ticker_data,
       root: path.join(__dirname, "./views")
     });
   });
 });

function tickerBuySignal(RSIs, prices, currency, period){
 var rsi_buy_decision = false;
 var end_time = Date.now();
 var start_time = Date.now() - 300000;
 if(RSIs[0] >= RSIs[1]){
   if(RSIs[1] <= 28){
     if(RSIs[2] <= 29){
       if(RSIs[3] <= 32){
         rsi_buy_decision = true;
         logBtcBuyDataToMongo(currency, period, rsi_buy_decision, RSIs, prices, start_time, end_time);
        }
      }
    }
  }else{
    rsi_buy_decision = false;
  } 
 console.log("\n" + currency + " " + period + " Minute Buy Decision is " + rsi_buy_decision);   
}

function logBtcBuyDataToMongo(curr, per, dec, rsi, pri, st, ed){
  var new_rsi = [];
  for(var i = 0; i < 5; i++){
    new_rsi.push(rsi[i]);
  }
  var buy_data = {
    currency : curr,
    period : per,
    buy_decision : dec,
    RSIs : new_rsi,
    prices : pri,
    start_time : st,
    end_time : ed
  };
  if(curr == "BTC"){
    db.collection("BTC_RSI14_Buys").insertOne(buy_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Buy successful!! Saved data to BTC_RSI14_Buys.");
    });
  }else if(curr == "ETH"){
    db.collection("ETH_RSI14_Buys").insertOne(buy_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Buy successful!! Saved data to ETH_RSI14_Buys.");
    });
  }
}

/**
* BTC Functions
*/
//Coinbase API call - BTC Tickers
function getBtcTickers(){
 const btc_ticker_cb = (err, response, btc_tickers) => {
   //  console.log(tickers);
   db.collection("BTC_Tickers").insertOne(btc_tickers, (err, result) => {
     if (err) return console.log(err);
     console.log("Saved tickers to BTC_Tickers.");
   });
 };
 authedClient.getProductTicker("BTC-USD", btc_ticker_cb);
 calcBtcRSI14();
 setTimeout(getBtcTickers, 60000);
}getBtcTickers();

//Calc BTC Ticker RSI
function calcBtcRSI14 () {
 //Find ETH tickers & calculate RSI
 db.collection("BTC_Tickers").find().toArray((err, tickers) => {
  if (err) return console.log(err);
  var prices = [];
  var prices_log = [];
  var j = 0;
  for(var i = tickers.length - 1; i >= 0 ; i--){
    if(prices != undefined  && i%5==0){
      prices.push(tickers[i].price);
      if(j < 5){
        prices_log.push(tickers[j].price);
        j++;
      }
    }
  }
  //Input Object - RSI Calculation
   var RSI_input = {
     values : prices,
     period : 14
   };
   //Output Object - RSI Calculation
   var RSI_output = RSI.calculate(RSI_input);
   //New Object - RSI MongoDB Log
   var RSI_log = {
     currency : "BTC",
     time : Date.now(),
     period : 14,
     RSI : RSI_output
   };
   db.collection("BTC_RSI14_Data").insertOne(RSI_log, (err, result) => {
     if (err) return console.log(err);
     console.log("Saved RSIs to BTC_RSI14_Data.");
    });
    tickerBuySignal(RSI_output, prices, "BTC", RSI_input.period);
  });
}

 /**
   * ETH Functions
   */
  //Coinbase API call - ETH Tickers
  function getEthTickers(){
    const tickers_cb = (err, response, tickers) => {
      //  console.log(tickers);
      db.collection("ETH_Tickers").insertOne(tickers, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to ETH_Tickers.");
      });
    };
    authedClient.getProductTicker("ETH-USD", tickers_cb);
    calcEthRSI14();
    setTimeout(getEthTickers, 65000);
  }

  /**
   * Calculate RSI - ETH Tickers
   */
  function calcEthRSI14 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH_Tickers").find().toArray((err, tickers) => {
      var prices = [];
      var prices_log = [];
      var j = 0;
      for(var i = tickers.length - 1; i >= 0; i--){
        if(prices != undefined && i%5==0){
          prices.push(tickers[i].price);
          if(j < 5){
            prices_log.push(tickers[j].price);
            j++;
          }
        }
      }
      //Input Object - RSI Calculation
      var RSI_input = {
        values : prices,
        period : 14
      };
      //Output Object - RSI Calculation
      var RSI_output = RSI.calculate(RSI_input);
      //New Object - RSI MongoDB Log
      var RSI_log = {
        currency : "ETH",
        time : Date.now(),
        period : 14,
        RSI : RSI_output
      };
      db.collection("ETH_RSI14_Data").insertOne(RSI_log, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved RSIs to ETH_RSI14_Data.\n");
       });
      tickerBuySignal(RSI_output, prices, "ETH", RSI_input.period);
    });
  }setTimeout(getEthTickers, 10000);

 app.listen(port, () => {
   console.log("Server listening on port " + port);
  });
});