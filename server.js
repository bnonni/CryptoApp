#!/usr/bin/env nodejs
/*jshint esversion: 6 */
require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
require('@tensorflow/tfjs-node-gpu');
const RSI = require('technicalindicators').RSI;

/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require('coinbase-pro');
const key = process.env.key;
const secret = process.env.secret;
const passphrase = process.env.passphrase;
const apiURI = 'https://api.pro.coinbase.com';
const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);


const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const path = require('path');

/**
 * MongoDB Setup
 */
const password = process.env.password;
const uri = "mongodb+srv://hu5ky5n0w:"+password+"@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
const mongo = new MongoClient(uri, { useNewUrlParser: true });
var db;

/**
 * Mongo Connection + Collection Access & Price Parsing + RSI Calculation
 */
mongo.connect(err => {
  let port = 443;  
  if (err) return console.log(err);
  db = mongo.db("crypto_wallet");
  
  /**
   * Render HP
   */
  app.get('/', (req, res) => {
    res.sendFile('index.html', {
      root: path.join(__dirname, './views')
    });
  });
  /**
   * BTC Functions
   */
  //Render BTC Trades 
  app.get('/btc-trades', (req, res) => {
    // console.log(res);
    db.collection("BTC-trades").find().toArray((err, trads) => {
      res.render('BTC-trades.ejs', {
        ETHtrades: trads,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Render BTC Tickers
  app.get('/btc-tickers', (req, res) => {
    // console.log(res);
    db.collection("BTC-tickers").find().toArray((err, trads) => {
      res.render('BTC-tickers.ejs', {
        ETHtickers: trads,
        root: path.join(__dirname, './views')
      });
    });
  });

  /**
   * ETH Functions
   */
  //Render ETH Trades 
  app.get('/eth-trades', (req, res) => {
    // console.log(res);
    db.collection("ETH-trades").find().toArray((err, eth_trades) => {
      res.render('ETH-trades.ejs', {
        ETH_trades: eth_trades,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Render ETH Tickers
  app.get('/eth-tickers', (req, res) => {
    // console.log(res);
    db.collection("ETH-tickers").find().toArray((err, eth_tickers) => {
      res.render('ETH-tickers.ejs', {
        ETH_tickers: eth_tickers,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Coinbase API call - ETH Tickers
  function ethTickers(){
    const eth_ticker_cb = (err, response, tickers) => {
       console.log(tickers);
      db.collection("ETH-tickers").insertOne(tickers, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to ETH-tickers.");
      });
    };
    authedClient.getProductTicker('ETH-USD', eth_ticker_cb);
  }
  ethTickers();

  /**
   * Calculate RSI - ETH Tickers
   */


   /** Five Minute RSI Calculation - need to edit to pull every fifth minute ticker  bew shit*/
  function calculateTickerRSIMin5 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-tickers").find().toArray((err, ticker_data) => {
      var prices = [];
      for(var i = 0; i < ticker_data.length && i+1%3==0; i++){
        if(prices != undefined){
          prices.push(ticker_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var inputRSI = {
        values : prices,
        period : 14
      };
      var RSIs = RSI.calculate(inputRSI);  
      console.log("\nTick RSI 5 min: " + RSIs);
      // tradeETH(RSIs);
    });
  }
  calculateTickerRSIMin5();

  /**
   * Coinbase API call - ETH Trades
   */

  function ethTrades(){
    const eth_trades_cb = (err, response, trades) => {
      if (err) return console.log(err);
      // console.log(trades);
      db.collection("ETH-trades").insertOne(trades, (err, result) => {
        console.log("Saved trades to ETH-trades.");
      });
    };
    authedClient.getProductTrades('ETH-USD', eth_trades_cb);
    var today = Date.now();
    const trades = authedClient.getProductTradeStream('ETH-USD', 1559869200, today);
  }
  ethTrades();

  /**
   * Calculate RSI - ETH Trades
   */
  function tradeSignalOne(arr){
    var buyCompOne = false;
    if(arr[0] >= arr[1]){
      if(arr[1] <= 28){
        if(arr[2] <= 29){
          if(arr[4] <= 32){
            buyCompOne = true;
          }
        }
      }
    }
    else buyCompOne = false;
    console.log("The Comp Decision " + buyCompOne);   
    }


  function calculateTradesRSI14Min () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-trades").find().toArray((err, trade_data) => {
      var prices = [];
      for(var i = 0; i < trade_data.length; i++){
        if(prices != undefined){
          prices.push(trade_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var inputRSI = {
        values : prices,
        period : 14
      };
      var RSIs = RSI.calculate(inputRSI);  
      console.log("Trade RSI: " + RSIs);      
      tradeSignalOne(RSIs);
    });
  }
  calculateTradesRSI14Min();
  
  function calculateTradesRSI28Min () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-trades").find().toArray((err, trade_data) => {
      var prices = [];
      for(var i = 0; i < trade_data.length; i++){
        if(prices != undefined){
          prices.push(trade_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var inputRSI = {
        values : prices,
        period : 28
      };
      var RSIs2 = RSI.calculate(inputRSI);  
      console.log("Trade RSI: " + RSIs2);      
      tradeSignalOne(RSIs2);
    });
  }
  calculateTradesRSI28Min();
  


//Init app
  app.listen(port, () => {
    console.log("Server listening on port " + port + ".");
  });
}); /* End mongo.connect*/

/**
 * jQuery Setup
 */
//   var jsdom = require('jsdom');
//   app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
//   const { JSDOM } = jsdom;
//   const { window } = new JSDOM();
//   var $ = require('jquery')(window);
//   const { document } = (new JSDOM('')).window;
//   global.document = document;
//   $(document).ready(() => {
//     console.log('Test!');
//     $('.ETH').text('Hello World!');
//   });

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());