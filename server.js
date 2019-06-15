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
 ((RSIs[0] >= RSIs[1]) && (RSIs[1] <= 28) && (RSIs[2] <= 29) && (RSIs[3] <= 32)) ? (rsi_buy_decision = true, logBtcBuyDataToMongo(currency, period, rsi_buy_decision, RSIs, prices, start_time, end_time)) : rsi_buy_decision = false;
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
    console.log("BTC Buy!");
    console.log(buy_data);
    db.collection("BTC_RSI14_Buys").insertOne(buy_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Buy successful!! Saved data to BTC_RSI14_Buys.");
    });
  }else if(curr == "ETH"){
    console.log("ETH Buy!");
    console.log(buy_data);
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
  const btc_ticker_cb = (err, response, btc) => {
    //  console.log(tickers);
    db.collection("BTC_Tickers").insertOne(btc, (err, result) => {
      if (err) return console.log(err);
      console.log("Saved tickers to BTC_Tickers.");
    });
  };
  authedClient.getProductTicker("BTC-USD", btc_ticker_cb);
  calcBtcRSI14();
  setTimeout(getBtcTickers, 60000);
 }

//Calc BTC Ticker RSI
function calcBtcRSI14 () {
 //Find ETH tickers & calculate RSI
 db.collection("BTC_Tickers").find().toArray((err, btc_tickers) => {
  if (err) return console.log(err);
  var btc_prices = [];
  var btc_prices_log = [];
  var j = 0;
  for(var i = btc_tickers.length - 1; i >= 0 ; i--){
    if(btc_tickers[i] != undefined  && i%5==0){
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
     time : Date.now(),
     period : 14,
     RSI : BTC_RSI_output
   };
  //  console.log(BTC_RSI_log);
   db.collection("BTC_RSI14_Data").insertOne(BTC_RSI_log, (err, result) => {
     if (err) return console.log(err);
     console.log("Saved RSIs to BTC_RSI14_Data.");
    });
    tickerBuySignal(BTC_RSI_output, btc_prices, "BTC", BTC_RSI_input.period);
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
    };
    authedClient.getProductTicker("ETH-USD", eth_tickers_cb);
    calcEthRSI14_FiveMin();
    setTimeout(getEthTickers, 65000);
  }
  //Calculate RSI - ETH Tickers
  function calcEthRSI14_FiveMin () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH_Tickers").find().toArray((err, eth_tickers) => {
      var eth_prices = [];
      var eth_prices_log = [];
      var j = 0;
      for(var i = eth_tickers.length - 1; i >= 0; i--){
        if(eth_tickers[i] != undefined && i%5==0){
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
        time : Date.now(),
        period : 14,
        RSI : ETH_RSI_output
      };
      // console.log(ETH_RSI_log);
      db.collection("ETH_RSI14_Data").insertOne(ETH_RSI_log, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved RSIs to ETH_RSI14_Data.");
       });
      tickerBuySignal(ETH_RSI_output, eth_prices, "ETH", ETH_RSI_input.period);
    });
  }
  
  getBtcTickers();
  setTimeout(getEthTickers, 1000);

 app.listen(port, () => {
   console.log("Server listening on port " + port);
  });
});