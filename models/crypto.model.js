/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CryptoSchema = new Schema({
	cAcct: {type: Number, required: true},
	cAmt: {type: Number, required: true},
	dAcct: {type: Number, required: true},
	dAmt: {type: Number, required: true},
	currency: {type: String, required: true},
	transactionID: {type: Number, required: true},
	hash: {type: String, required: true, max: 128},
});

// Export
module.exports = mongoose.model('Crypto', CryptoSchema);
