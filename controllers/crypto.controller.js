/*jshint esversion: 6 */

const Crypto = require('../models/crypto.model');

// exports.test = function(req, res){
//  res.send('Greetings from the Test controller!');
// };

exports.transaction_create = function (req, res) {
 let transaction = new Transaction(
     {
        //  name: req.body.name,
        //  price: req.body.price
        cAcct: req.body.cAcct,
        cAmt: req.body.cAmt,
        dAcct: req.body.dAcct,
        dAmt: req.body.dAmt,
        currency: req.body.currency,
        transactionID: req.body.transactionID,
        hash: req.body.hash,
     }
 );

 transaction.save(function (err) {
     if (err) {
         return next(err);
        }
     res.send('Transaction Created successfully');
 });
};