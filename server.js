/*jshint esversion: 6 */
/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require('coinbase-pro');
const key = '****************************';
const secret = '********************************************************';
const passphrase = '';
const apiURI = 'https://api.pro.coinbase.com';
const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);

const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '../public'));

/**
 * MongoDB Setup
 */
const uri = "mongodb+srv://hu5ky5n0w:*******@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
const mongo = new MongoClient(uri, { useNewUrlParser: true });
var db;

mongo.connect(err => {
  let port = 3000;  
  if (err) return console.log(err);
  db = mongo.db("crypto_wallet");
  const ETHcb = (err, response, data) => {
    db.collection("transactions").insertOne(data, (err, result) => {
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
 * Ledger POST via UI
 */

app.post("/transactions", (req, res) => {
  db.collection("transactions").insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log("Saved to database");

    res.redirect("/");
  });
});

app.get('/', (req, res) => {
  db.collection("transactions").find().toArray(function(err, results){
    if (err) return console.log(err);
    res.render('index.ejs', {transactions: results});

  });
});


