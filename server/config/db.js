/*jshint esversion: 6 */
const MongoClient = require("mongodb").MongoClient,
MongoURI = require('./keys').MongoURI;
var _db;

module.exports = {
    connectToServer: (callback) => {
        MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            _db = client.db('crypto_wallet_dev');
            return callback(err);
        });
    },

    getDb: () => {
        return _db;
    }
};