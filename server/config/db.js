/*jshint esversion: 6 */
const AdminPwd = process.env.MongoAdminPwd;
const MongoClient = require("mongodb").MongoClient;
const MongoURI = `mongodb://CryptoAlgoAdmin:${AdminPwd}@157.245.247.90:27017/admin`
var _db;

module.exports = {
    connectToServer: function (callback) {
        MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            _db = client.db("crypto_wallet_dev");
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    }
};


// db.createUser({ user: "CryptoAlgoAdmin", pwd: "cryptowallet", roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"] })
// db.createUser({ user: "CryptoAlgoAdmin", pwd: passwordPrompt(), roles: [{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"] })

// db.BTC_RSI14_Data.find({ "RSI": { $in: [null, null, null] } }).forEach(function(doc) { db.BTC_RSI14_Data.remove({ _id: doc._id }); })