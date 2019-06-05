/*jshint esversion: 6 */

/**
 * Node/Express Setup
 */
const express = require('express');
const app = express();

/**
 * BodyParser
 */
const bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '../public'));

/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require('coinbase-pro');

const key = '6719bd8885dca93f6c6e2f919e3434ae';
const secret = 'hL5HqYs38gLdWMSi/CNIY7nqMi1TdnfhJlx4A1mO7XOiUs6L49PiHPQEjcVJLWK4egDWleAu8b7txlvG7KmIpg==';
const passphrase = 'mm39ja8p9m';
const apiURI = 'https://api.pro.coinbase.com';

const authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);

/**
 * MongoDB Setup
 */
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hu5ky5n0w:MongoDB4243!!@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true";
const mongo = new MongoClient(uri, { useNewUrlParser: true });
var db;

mongo.connect(err => {
  let port = 3000;  
  if (err) return console.log(err);
  db = mongo.db("crypto_wallet");
  
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


