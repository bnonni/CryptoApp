module.exports = function(app, uri, opts) {
 if (typeof uri !== 'string') {
throw new TypeError('Error: Unexpected mongodb connection url');
}

opts = opts || {};
var property = opts.property || 'db';

var connection;
return function expressMongoDb(req, res, next) {
 if (!connection) {
  connection = MongoClient.connect(uri, opts);
 }
 connection
 .then(function (db) {
  req[property] = db;
  app.set('mongodb', db);
  next();
 })
 .catch(function (err) {
  connection = undefined;
  next(err);
 });
};
};