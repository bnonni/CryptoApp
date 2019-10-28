/*jshint esversion: 6 */
const mongo_admin_pwd = process.env.db_pwd;
const MongoClient = require("mongodb").MongoClient;
const MongoURI = "mongodb://bryan:" + mongo_admin_pwd + "/crypto_wallet"
var _db;

module.exports = {
    connectToServer: function(callback) {
        MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            _db = client.db("crypto_wallet");
            return callback(err);
        });
    },

    getDb: function() {
        return _db;
    }
};