const MongoClient = require("mongodb").MongoClient;
const user = process.env.user;
const password = process.env.password;
//mongodb://192.241.152.52:27017/
const MongoURI = "mongodb://" + user + ":" + password + "192.241.152.52:27017";
// "mongodb://localhost:27017/crypto_wallet"
var _db;

module.exports = {
 connectToServer: function (callback) {
  MongoClient.connect(MongoURI, { useNewUrlParser: true }, (err, client) => {
   _db = client.db("crypto_wallet");
   console.log("Connected to " + _db);
   return callback(err);
  });
 },

 getDb: function () {
  return _db;
 }
};