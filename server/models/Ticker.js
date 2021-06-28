/*jshint esversion: 6 */

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TickerSchema = new Schema({
 trade_id: {
  type: Number,
  required: true
 },
 price: {
  type: String,
  required: true
 },
 size: {
  type: String,
  required: true
 },
 time: {
  type: Date,
  default: Date.now
 },
 bid: {
  type: String,
  required: true
 },
 ask: {
  type: String,
  required: true
 },
 volume: {
  type: String,
  required: true
 }
});

module.exports = User = mongoose.model("users", UserSchema);