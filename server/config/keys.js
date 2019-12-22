/*jshint esversion: 6 */

var MongoAdminUsr = process.env.mausr;
var MongoAdminPwd = process.env.mapwd;

module.exports = {
    MongoURI: `mongodb://${MongoAdminUsr}:${MongoAdminPwd}@157.245.247.90:27017/admin`,
    secretOrKey: "secret"
}