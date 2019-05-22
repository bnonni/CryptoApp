/*jshint esversion: 6 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CryptoSchema = new Schema({
	Account: {type: Number, required: true},
	ID: {type: Number, required: true},
	hash: {type: String, required: true, max: 128},
	Credit: {type: Number, required: true},
	Debit: {type: Number, required: true}
});

// Export
module.exports = mongoose.model('Crypto', CryptoSchema);
