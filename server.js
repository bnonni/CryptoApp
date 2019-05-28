/*jshint esversion: 6 */
// app.js
const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hu5ky5n0w:MongoDB4243!!@cryptowallet-glvp8.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
var db;

client.connect(err => {
  let port = 3000;
  const collection = client.db("CryptoWallet").collection("transactions");
  if (err) return console.log(err);
  db = client.db("CryptoWallet");
  
  app.listen(port, () => {
    console.log("Server is up and running on port number " + port);
    app.use(bodyParser.urlencoded({extended: true}));
    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });
    app.post("/transaction", (req, res) => {
      db.collection("transactions").save(req.body, (err, result) => {
        if (err) return console.log(err);
    
        console.log("saved "+ req +" to database");
        res.redirect("/");
      });
    });
  });
  client.close();
});