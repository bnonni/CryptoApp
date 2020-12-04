/*jshint esversion: 6 */
'use strict'
/**
 * Coinbase Connection Setup
 */
require('dotenv').config({path: '../.env'})
const CoinbasePro = require('coinbase-pro'),
    key = process.env.CB_KEY,
    secret = process.env.CB_SECRET,
    passphrase = process.env.CB_PASSPHRASE,
    authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, 'https://api.pro.coinbase.com')

module.exports = authedClient;