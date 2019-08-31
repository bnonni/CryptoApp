const MongoClient = require("mongodb").MongoClient;
const MongoURI = "mongodb://localhost:27017/crypto_wallet"
var _db;

module.exports = {
 connectToServer: function (callback) {
  MongoClient.connect(MongoURI, { useNewUrlParser: true }, (err, client) => {
   console.log(client);
   _db = client.db("crypto_wallet");
   console.log("Connected to " + _db);
   return callback(err);
  });
 },

 getDb: function () {
  return _db;
 }
};