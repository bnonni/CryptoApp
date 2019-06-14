/*jshint esversion: 6 */
/**
 * Coinigy
 * Key: *
 * Secret: *
 */


 
/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require('coinbase-pro');
const key = '*';
const secret = '*';
const passphrase = '*';
const apiURI = 'https://api.pro.coinbase.com';
const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);

const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser= require('body-parser');

app.get('/', (req, res) => {
  db.collection("ETH").find().toArray(function(err, results){
    if (err) return console.log(err);
    res.render('index.ejs', {ETH: results});
    
  });
});

function usejQuery(html){
  var jsdom = require('jsdom');
  app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
  const { JSDOM } = jsdom;
  const { window } = new JSDOM();
  var $ = require('jquery')(window);
  const { document } = (new JSDOM('')).window;
  global.document = document;
  $(document).ready(() => {
    console.log('Test!');
    $('.ETH').text('Hello World!');
  });
  }
  usejQuery();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

/**
 * MongoDB Setup
 */
const uri = "mongodb+srv://hu5ky5n0w:*@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
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
  
  authedClient.getProductTicker('ETH-USD', ETHcb);
  
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
