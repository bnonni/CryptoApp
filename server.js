#!/usr/bin/env nodejs
/*jshint esversion: 6 */
const tf = require('@tensorflow/tfjs');
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
 * Render HP
 */
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, './views')
  });
});


/**
 * Render ETH Trades
 */
app.get('/eth-trades', (req, res) => {
  // console.log(res);
  db.collection("ETHtrades").find().toArray((err, trads) => {
    res.render('ETHtrades.ejs', {
      ETHtrades: trads,
      root: path.join(__dirname, './views')
    });
  });
});

/**
 * Render ETH Tickers
 */
app.get('/eth-tickers', (req, res) => {
  // console.log(res);
  db.collection("ETHtickers").find().toArray((err, trads) => {
    res.render('ETHtickers.ejs', {
      ETHtickers: trads,
      root: path.join(__dirname, './views')
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

/**
 * Mongo Connection + Collection Access & Price Parsing + RSI Calculation
 */
mongo.connect(err => {
  let port = 3000;  
  if (err) return console.log(err);
  db = mongo.db("crypto_wallet");
  
  /**
   * API calls
   */
function ethTickers(){
  const eth_ticker_cb = (err, response, tickers) => {
    // console.log(tickers);
    db.collection("ETHtickers").insertOne(tickers, (err, result) => {
      if (err) return console.log(err);
      console.log("Saved tickers to ETHtickers.");
    });
  };
  authedClient.getProductTicker('ETH-USD', eth_ticker_cb);
}
ethTickers();

function calculateTickerRSI () {
  //Find ETH tickers & calculate RSI
  db.collection("ETHtickers").find().toArray((err, ticker_data) => {
    var prices = [];
    for(var i = 0; i < ticker_data.length; i++){
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
    // console.log("\nTick RSI: " + RSIs);
    // tradeETH(RSIs);
  });
}
calculateTickerRSI();

function ethTrades(){
  const eth_trades_cb = (err, response, trades) => {
    if (err) return console.log(err);
    // console.log(trades);
    db.collection("ETHtrades").insertOne(trades, (err, result) => {
      console.log("Saved trades to ETHtrades.");
    });
  };
  authedClient.getProductTrades('ETH-USD', eth_trades_cb);
  var today = Date.now();
  const trades = authedClient.getProductTradeStream('ETH-USD', 1559869200, today);
}
ethTrades();


function calculateTradesRSI () {
  //Find ETH tickers & calculate RSI
  db.collection("ETHtrades").find().toArray((err, trade_data) => {
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
  });
}
calculateTradesRSI();
  
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