/*jshint esversion: 6 */
// app.js
const express = require('express');
const bodyParser= require('body-parser');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hu5ky5n0w:MongoDB4243!!@cryptowallet-glvp8.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
var db;

client.connect(err => {
  let port = 3000;  
  if (err) return console.log(err);
  db = client.db("crypto_wallet");
  
  app.listen(port, () => {
    console.log("Server running. Listening on port " + port);
  });
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static(__dirname + '../public'));


app.get('/', (req, res) => {
  db.collection("transactions").find().toArray(function(err, results){
    if (err) return console.log(err);
    res.render('index.ejs', {transactions: results})

  });
});

app.post("/transactions", (req, res) => {
  db.collection("transactions").insertOne(req.body, (err, result) => {
    if (err) return console.log(err);
    console.log("Saved to database");

    res.redirect("/");
  });
});