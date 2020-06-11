/*jshint esversion: 6 */
const MongoClient = require('mongodb').MongoClient,
    MongoURI = require('./keys').MongoURI;
var _db;

module.exports = {
    connectToServer: (callback) => {
        MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            _db = client.db('crypto_wallet_dev');
            console.log(`Connected to ${_db.namespace}`)
            if (err) return callback(err);
            else return _db;
        });
    },

    getDb: () => {
        return _db;
    }
};