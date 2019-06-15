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
  * Global Time Variables
  */
 var start_time = new Date(Date.now() - 300000).toLocaleString();
 var end_time = new Date(Date.now()).toLocaleString();
 var today = new Date(Date.now()).toLocaleString();
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

/**
 * Mongo Connection + Collection Access & Price Parsing + RSI Calculation
 */
mongo.connect(err => {
<<<<<<< HEAD
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

  //Render ETH Tickers
  app.get("/eth-tickers", (req, res) => {
    // console.log(res);
    db.collection("ETH-tickers").find().toArray((err, eth_ticker_data) => {
      res.render("eth-tickers.ejs", {
        ETH_tickers: eth_ticker_data,
        root: path.join(__dirname, "./views")
      });
=======
 if (err) return console.log(err);
 db = mongo.db("crypto_wallet");

function buySignalRSI(currency, period, RSIs, prices){
 var rsi_buy_decision = false;
//  var end_time = new Date(Date.now()).toLocaleString();
//  var start_time = new Date(Date.now() - 300000).toLocaleString();
 ((RSIs[0] >= RSIs[1]) && (RSIs[1] <= 28) && (RSIs[2] <= 29) && (RSIs[3] <= 32)) ? (rsi_buy_decision = true, logBuySellDataToMongo(currency, "buy", period, rsi_buy_decision, RSIs, prices, start_time, end_time)) : rsi_buy_decision = false;
 console.log(currency + ": " + period + " Period Buy Decision => " + rsi_buy_decision + " @ " + today);
}

function sellSignalRSI(currency, period, RSIs, prices){
  var rsi_sell_decision = false;
  // var end_time = Date.now();
  // var start_time = Date.now() - 300000;
  ((RSIs[0] >= RSIs[1]) && (RSIs[1] >= RSIs[2]) && (RSIs[2] >= RSIs[3]) && (RSIs[3] >= 50) && (RSIs[4] >= RSIs[3])) ? (rsi_sell_decision = true, logBuySellDataToMongo(currency, "sell", period, rsi_sell_decision, RSIs, prices, start_time, end_time, "sell")) : rsi_sell_decision = false;
  console.log(currency + ": " + period + " Period Sell Decision => " + rsi_sell_decision + " @ " + today);
 }

function logBuySellDataToMongo(curr, type, per, dec, rsi, pri, st, ed){
  if(type == "buy"){
    var buy_data = create_btc_buy_obj(curr, type, per, dec, rsi, pri, st, ed);
    console.log("BTC Buy!");
    console.log(buy_data);
    db.collection("BTC_RSI14_Buys").insertOne(buy_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Buy successful!! Saved data to BTC_RSI14_Buys @ " + today);
    });
  }else{
    var sell_data = create_btc_sell_obj(curr, type, per, dec, rsi, pri, st, ed);
    console.log("BTC Sell!");
    console.log(sell_data);
    db.collection("BTC_RSI14_Sells").insertOne(sell_data, (err, result) => {
      if (err) return console.log(err);
      console.log("Sell successful!! Saved data to BTC_RSI14_Sells @ " + today);
>>>>>>> f47e214e6374ec08e6202490c182a04be95f2a5c
    });
  });

<<<<<<< HEAD
  //Render BTC Tickers
  app.get("/btc-tickers", (req, res) => {
    // console.log(res);
    db.collection("BTC-tickers").find().toArray((err, btc_ticker_data) => {
      res.render("btc-tickers.ejs", {
        BTC_tickers: btc_ticker_data,
        root: path.join(__dirname, "./views")
      });
=======
function create_btc_buy_obj(c, t, p, d, r, pr, s, e){
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

function create_btc_sell_obj(c, t, p, d, r, pr, s, e){
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
>>>>>>> f47e214e6374ec08e6202490c182a04be95f2a5c
    });
  });

  /**
   * trade signal logic
   */
  function tickerBuySignal(RSIs, currency, period){
    var buy_comp_one = false;
    if(RSIs[0] >= RSIs[1]){
      if(RSIs[1] <= 28){
        if(RSIs[2] <= 29){
          if(RSIs[4] <= 32){
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
    authedClient.getProductTicker("BTC-USD", btc_ticker_cb);
    calcBtcRSI14();
    calcBtcRSI28();
    setTimeout(getBtcTickers, 60000);
  };

  //Calc BTC Ticker RSI
  function calcBtcRSI14 () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-tickers").find().toArray((err, btc_tickers) => {
      var btc_prices = [];
      for(var i = btc_tickers.length - 1; i >= 0 ; i--){
        if(btc_prices != undefined  && i%5==0){
          btc_prices.push(btc_tickers[i].price);
          // console.log(i + " " + btc_prices);
        }
      }
      var btc_Rsi14_input = {
        values : btc_prices,
        period : 14
      };
      var btc_Rsi_14 = RSI.calculate(btc_Rsi14_input);
      // console.log(btc_Rsi_14);
      
        // db.collection("btcRsi14").insert(btc_Rsi_14, (err, result) => {
        //   if (err) return console.log(err);
        //   console.log("Saved BTC 14 min RSIs to btcRsi14.");
        // });
      
      tickerBuySignal(btc_Rsi_14, "BTC", btc_Rsi14_input.period);
    });
  }

  function calcBtcRSI28 () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-tickers").find().toArray((err, btc_tickers) => {
      var btc_prices = [];
      for(var i = btc_tickers.length - 1; i >= 0 ; i--){
        if(btc_prices != undefined  && i%5==0){
          btc_prices.push(btc_tickers[i].price);
          // console.log(i + " " + btc_prices);
        }
      }
      // var len = btc_tickers.length - 1;
      // console.log("btc tickers len: " +  len);
      var btc28_RSI_input = {
        values : btc_prices,
        period : 28
      };
      var btc28_RSIs = RSI.calculate(btc28_RSI_input);  
      // console.log("\nBTC Ticker RSI: " + btc_RSI);
      tickerBuySignal(btc28_RSIs, "BTC", btc28_RSI_input.period);
    });
<<<<<<< HEAD
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
    authedClient.getProductTicker("ETH-USD", eth_tickers_cb);
    setTimeout(calcEthRSI14, 500);
    setTimeout(calcEthRSI28, 500);
    setTimeout(getEthTickers, 60000);
  }

  /**
   * Calculate RSI - ETH Tickers
   */
  function calcEthRSI14 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-tickers").find().toArray((err, eth_tickers) => {
      var eth_prices = [];
      for(var i = eth_tickers.length - 1; i >= 0; i--){
        if(eth_prices != undefined && i%5==0){
          eth_prices.push(eth_tickers[i].price);
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
    db.collection("ETH-tickers").find().toArray((err, eth_tickers) => {
      var eth_prices = [];
      for(var i = eth_tickers.length - 1; i >= 0; i--){
        if(eth_prices != undefined && i%5==0){
          eth_prices.push(eth_tickers[i].price);
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
//   var jsdom = require("jsdom");
//   app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist/"));
//   const { JSDOM } = jsdom;
//   const { window } = new JSDOM();
//   var $ = require("jquery")(window);
//   const { document } = (new JSDOM("")).window;
//   global.document = document;
//   $(document).ready(() => {
//     console.log("Test!");
//     $(".ETH").text("Hello World!");
//   });

// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
=======
    buySignalRSI("BTC",  BTC_RSI_input.period, BTC_RSI_output, btc_prices);
    sellSignalRSI("BTC",  BTC_RSI_input.period, BTC_RSI_output, btc_prices);
  });
}
  getBtcTickers();
});
>>>>>>> f47e214e6374ec08e6202490c182a04be95f2a5c
