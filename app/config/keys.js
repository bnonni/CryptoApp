var user = process.env.user;
var password = process.env.MongoPassword;

module.exports = {
 // : "mongodb+srv://" + + ":" + ,
 MongoURI: "mongodb+srv://" + user + ":" + password + "@cryptowallet-glvp8.mongodb.net/",

 secretOrKey: "secret"
}