/*jshint esversion: 6 */
const MongoClient = require('mongodb').MongoClient,
    MongoURI = require('./keys').MongoURI;
var db;


MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    db = client.db('crypto_wallet_dev');
    console.log(`Connected to ${db.namespace}`)
    if (err) return callback(err);
    else return db;
});

module.exports = db;