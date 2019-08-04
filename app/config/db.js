const mongo = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
// var password = process.env.MongoPassword;
var MongoURI = "mongodb://localhost:27017/crypto_wallet";
//"mongodb+srv://hu5ky5n0w:" + password + "@cryptowallet-glvp8.mongodb.net/crypto_wallet?retryWrites=true&w=majority";
var _db;

module.exports = {
 connectToServer: function (callback) {
  MongoClient.connect(MongoURI, { useNewUrlParser: true }, (err, client) => {
   _db = client.db('crypto_wallet');
   return callback(err);
  });
 },

 getDb: function () {
  return _db;
 }
};