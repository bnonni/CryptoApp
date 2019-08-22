/**
 * Coinbase Connection Setup
 */
const CoinbasePro = require('coinbase-pro'),
 key = process.env.key,
 secret = process.env.secret,
 passphrase = process.env.passphrase,
 apiURI = 'https://api.pro.coinbase.com',
 authedClient = new CoinbasePro.AuthenticatedClient(key, secret, passphrase, apiURI);

module.exports = authedClient;