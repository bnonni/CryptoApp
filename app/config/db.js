/*jshint esversion: 6 */
<<<<<<< HEAD
const AdminPwd = process.env.MongoAdminPwd;
const MongoClient = require("mongodb").MongoClient;
const MongoURI = "mongodb://CryptoMongoAdmin:"+AdminPwd+":@localhost:27017/crypto_wallet"
=======
const mongo_admin_pwd = process.env.db_pwd;
const MongoClient = require("mongodb").MongoClient;
const MongoURI = "mongodb://bryan:" + mongo_admin_pwd + "/crypto_wallet"
>>>>>>> 74593593da2aff7195dc6a494c87482b5b9b9d51
var _db;

module.exports = {
    connectToServer: function(callback) {
        MongoClient.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            _db = client.db("crypto_wallet");
            return callback(err);
        });
    },

<<<<<<< HEAD
 getDb: function () {
  return _db;
 }
};
=======
    getDb: function() {
        return _db;
    }
};
>>>>>>> 74593593da2aff7195dc6a494c87482b5b9b9d51
