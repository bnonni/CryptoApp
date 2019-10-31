/*jshint esversion: 6 */
const AdminPwd = process.env.MongoAdminPwd;
const MongoClient = require("mongodb").MongoClient;
const MongoURI = "mongodb://CryptoMongoAdmin:"+AdminPwd+":@localhost:27017/crypto_wallet"
var _db;

module.exports = {
    connectToServer: function(callback) {
        MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            _db = client.db("crypto_wallet");
            return callback(err);
        });
    },

 getDb: function () {
  return _db;
 }
};
