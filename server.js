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
    db.collection("BTC-trades").find().toArray((err, btc_trade_data) => {
      res.render('BTC-trades.ejs', {
        BTC_trades: btc_trade_data,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Render BTC Tickers
  app.get('/btc-tickers', (req, res) => {
    // console.log(res);
    db.collection("BTC-tickers").find().toArray((err, btc_ticker_data) => {
      res.render('BTC-tickers.ejs', {
        BTC_tickers: btc_ticker_data,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Coinbase API call - BTC Tickers
  function getBtcTickers(){
    const btc_ticker_cb = (err, response, btc_tickers) => {
      //  console.log(tickers);
      db.collection("BTC-tickers").insertOne(btc_tickers, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to BTC-tickers.");
      });
    };
    authedClient.getProductTicker('BTC-USD', btc_ticker_cb);
  }
  getBtcTickers();


  function calcBtcTickerRSI () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-tickers").find().toArray((err, ticker_data) => {
      var btc_prices = [];
      for(var i = 0; i < ticker_data.length; i++){
        if(btc_prices != undefined){
          btc_prices.push(ticker_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var inputRSI = {
        values : btc_prices,
        period : 14
      };
      var RSIs = RSI.calculate(inputRSI);  
      // console.log("\nTick RSI: " + RSIs);
      // tradeETH(RSIs);
    });
  }
  calcBtcTickerRSI();

  //Coinbase API call - BTC Trades
  function getBtcTrades(){
    const btc_trades_cb = (err, response, btc_trades) => {
      if (err) return console.log(err);
      // console.log(trades);
      db.collection("BTC-trades").insertOne(btc_trades, (err, result) => {
        console.log("Saved trades to BTC-trades.");
      });
    };
    authedClient.getProductTrades('BTC-USD', btc_trades_cb);
    var today = Date.now();
    const trades = authedClient.getProductTradeStream('BTC-USD', 1559869200, today);
  }
  getBtcTrades();

  /**
   * Calculate RSI - BTC Trades
   */

  function calcEthTradeRSI () {
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
      // console.log("Trade RSI: " + RSIs);
    });
  }
  calcEthTradeRSI();

  

  /**
   * ETH Functions
   */
  //Render ETH Trades 
  app.get('/eth-trades', (req, res) => {
    // console.log(res);
    db.collection("ETH-trades").find().toArray((err, eth_trade_data) => {
      res.render('ETH-trades.ejs', {
        ETH_trades: eth_trade_data,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Render ETH Tickers
  app.get('/eth-tickers', (req, res) => {
    // console.log(res);
    db.collection("ETH-tickers").find().toArray((err, eth_ticker_data) => {
      res.render('ETH-tickers.ejs', {
        ETH_tickers: eth_ticker_data,
        root: path.join(__dirname, './views')
      });
    });
  });

  //Coinbase API call - ETH Tickers
  function getEthTickers(){
    const eth_tickers_cb = (err, response, eth_tickers) => {
      //  console.log(tickers);
      db.collection("ETH-tickers").insertOne(eth_tickers, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to ETH-tickers.");
      });
    };
    authedClient.getProductTicker('ETH-USD', eth_tickers_cb);
  }
  getEthTickers();

  /**
   * Calculate RSI - ETH Tickers
   */

  function calcEthTickerRSI () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-tickers").find().toArray((err, ticker_data) => {
      var eth_prices = [];
      for(var i = 0; i < ticker_data.length; i++){
        if(eth_prices != undefined){
          eth_prices.push(ticker_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var inputRSI = {
        values : eth_prices,
        period : 14
      };
      var RSIs = RSI.calculate(inputRSI);  
      // console.log("\nTick RSI: " + RSIs);
      // tradeETH(RSIs);
    });
  }
  calcEthTickerRSI();

  /**
   * Coinbase API call - ETH Trades
   */

  function getEthTrades(){
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
  getEthTrades();

  /**
   * Calculate RSI - ETH Trades
   */

  function calcEthTradeRSI () {
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
      // console.log("Trade RSI: " + RSIs);
    });
  }
  calcEthTradeRSI();
  
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