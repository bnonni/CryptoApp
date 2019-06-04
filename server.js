/*jshint esversion: 6 */
// app.js
const express = require('express');
const bodyParser= require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hu5ky5n0w:MongoDB4243!!@cryptowallet-glvp8.mongodb.net/test?retryWrites=true";
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

app.post("/transactions", (req, res) => {
  db.collection("transactions").insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log("Saved to database");

    res.redirect("/");
  });
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(__dirname + '../public'));


app.get('/', (req, res) => {
  db.collection("transactions").find().toArray(function(err, results){
    if (err) return console.log(err);
    res.render('index.ejs', {transactions: results});

  });
});


var Client = require('coinbase').Client;
var client = new Client({'apiKey': 'RusruCA3DYsReba5',
                         'apiSecret': 'API SECRET'});

client.getAccounts({}, function(err, accounts) {
  // account.getTransactions(function(err, txs) {console.log(txs);});\
  console.log(accounts);
});