/*jshint esversion: 6 */
/**
 * Coinigy
 * Key: 2606c94b47054895b8eb53737942628f
 * Secret: bffd0f97f126441eac85d6b008bdd5fd
 */
const RSI = require('technicalindicators').RSI;

 
/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require('coinbase-pro');
const key = '6719bd8885dca93f6c6e2f919e3434ae';
const secret = 'hL5HqYs38gLdWMSi/CNIY7nqMi1TdnfhJlx4A1mO7XOiUs6L49PiHPQEjcVJLWK4egDWleAu8b7txlvG7KmIpg==';
const passphrase = 'mm39ja8p9m';
const apiURI = 'https://api.pro.coinbase.com';
const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);

const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser= require('body-parser');

// app.get('/', (req, res) => {
//   db.collection("ETH").find().toArray((err, results) => {
//     if (err) return console.log(err);
//     res.render('index.ejs', {ETH: results});
//   });
// });

app.get('/', (req, res) => {
  db.collection("ETH").find().toArray((err, data) => {
    // data=JSON.stringify(data);
    // console.log(data);
    res.render('index.ejs', {ETH: data});
    for(var i = 0; i < data.length; i++){
      var price = data[i].price;
      console.log(i + " " + price);
    }
  });
});


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

/**
 * MongoDB Setup
 */
const uri = "mongodb+srv://hu5ky5n0w:MongoDB4243!!@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
const mongo = new MongoClient(uri, { useNewUrlParser: true });
var db;

mongo.connect(err => {
  let port = 3000;  
  if (err) return console.log(err);
  db = mongo.db("crypto_wallet");
  const ETHcb = (err, response, data) => {
    db.collection("ETH").insertOne(data, (err, result) => {
      if (err) return console.log(err);
      console.log("Saved to database");
    });
  };
  const prices = authedClient.getProductTicker('ETH-USD', ETHcb);
  // const trades = authedClient.getProductTradeStream('ETH-USD',  0, 8408000);
  // db.collection("ETH").insertOne(trades, (err, result) => {
  //   if (err) return console.log(err);
  //   console.log("Saved to database");
  // });

  app.listen(port, () => {
    console.log("Server listening on port " + port + ".");
  });
});

/**
 * Render DB results on page
 */


// app.get('/', (req, res) => {
//   db.collection("ETH").find().toArray(function(err, results){
//     if (err) return console.log(err);
//     res.get('.html', {ETH: results});
//   });
//   res.sendFile('index.ejs', {
//     root: path.join(__dirname, './views')
//   });
// });