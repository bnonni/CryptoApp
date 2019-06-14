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
app.set('view engine', 'ejs');

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
  let port = 8080;
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

  //Render ETH Tickers
  app.get('/eth-tickers', (req, res) => {
    // console.log(res);
    db.collection("ETH-tickers").find().toArray((err, eth_ticker_data) => {
      res.render('eth-tickers', {
        ETH_tickers: eth_ticker_data,
	root: path.join(__dirname, "./views")
      });
    });
  });

  //Render BTC Tickers
  app.get('/btc-tickers', (req, res) => {
    // console.log(res);
    db.collection("BTC-tickers").find().toArray((err, btc_ticker_data) => {
      res.render('btc-tickers', {
        BTC_tickers: btc_ticker_data,
        root: path.join(__dirname, './views')
      });
    });
  });

  /**
   * trade signal logic
   */
  function tickerBuySignal(tickers, currency, period){
    var buy_comp_one = false;
    if(tickers[0] >= tickers[1]){
      if(tickers[1] <= 28){
        if(tickers[2] <= 29){
          if(tickers[4] <= 32){
            buy_comp_one = true;
          }
        }
      }
    }
    else buy_comp_one = false;
    console.log(currency + " " + period + " Minute Buy Decision is " + buy_comp_one);   
  }

  /**
   * BTC Functions
   */
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
    calcBtcRSI14();
    calcBtcRSI28();
    setTimeout(getBtcTickers, 60000);
  };

  //Calc BTC Ticker RSI
  function calcBtcRSI14 () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-tickers").find().toArray((err, btc_tickers) => {
      var btc_prices = [];
      for(var i = 0; i < btc_tickers.length; i++){
        if(btc_prices != undefined  && i%3==0){
          btc_prices.push(btc_tickers[i].price);
          // console.log(i + " " + btc_prices);
        }
      }
      var btc14_RSI_input = {
        values : btc_prices,
        period : 14
      };
      var btc14_RSIs = RSI.calculate(btc14_RSI_input);  
      // console.log("\nBTC Ticker RSI: " + btc_RSI);
      tickerBuySignal(btc14_RSIs, "BTC", btc14_RSI_input.period);
    });
  }

  function calcBtcRSI28 () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-tickers").find().toArray((err, btc_tickers) => {
      var btc_prices = [];
      for(var i = 0; i < btc_tickers.length; i++){
        if(btc_prices != undefined  && i%3==0){
          btc_prices.push(btc_tickers[i].price);
          // console.log(i + " " + btc_prices);
        }
      }
      var btc28_RSI_input = {
        values : btc_prices,
        period : 28
      };
      var btc28_RSIs = RSI.calculate(btc28_RSI_input);  
      // console.log("\nBTC Ticker RSI: " + btc_RSI);
      tickerBuySignal(btc28_RSIs, "BTC", btc28_RSI_input.period);
    });
  }

  /**
   * ETH Functions
   */
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
    setTimeout(calcEthRSI14, 500);
    setTimeout(calcEthRSI28, 500);
    setTimeout(getEthTickers, 60000);
  }

  /**
   * Calculate RSI - ETH Tickers
   */
  function calcEthRSI14 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-tickers").find().toArray((err, price_data) => {
      var eth_prices = [];
      for(var i = 0; i < price_data.length; i++){
        if(eth_prices != undefined && i%3==0){
          eth_prices.push(price_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var eth14_RSI_input = {
        values : eth_prices,
        period : 14
      };
      var eth14_RSIs = RSI.calculate(eth14_RSI_input);  
      // console.log("\nTick RSI: " + RSIs);
      tickerBuySignal(eth14_RSIs, "ETH", eth14_RSI_input.period);
    });
  }

  function calcEthRSI28 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-tickers").find().toArray((err, price_data) => {
      var eth_prices = [];
      for(var i = 0; i < price_data.length; i++){
        if(eth_prices != undefined && i%3==0){
          eth_prices.push(price_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var eth28_RSI_input = {
        values : eth_prices,
        period : 28
      };
      var eth28_RSIs = RSI.calculate(eth28_RSI_input);  
      // console.log("\nTick RSI: " + RSIs);
      tickerBuySignal(eth28_RSIs, "ETH", eth28_RSI_input.period);
    });
  }

  getBtcTickers();

  setTimeout(getEthTickers, 1000);

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
