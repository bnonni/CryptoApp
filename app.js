/*jshint esversion: 6 */

// app.js
const express = require('express');
const bodyParser = require('body-parser');
// initialize our express app
const transaction = require('./routes/crypto.route'); // Imports routes for the products
const app = express();

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://hu5ky5n0w:MongoDB4243!!@simpleapp-glvp8.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const crypto_route = require('./routes/crypto.route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/crypto', crypto_route);

let port = 8000;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});
