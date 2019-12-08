/*jshint esversion: 6 */
const mongo = require('../config/db'),
    authedClient = require('./Coinbase'),
    calcIndicators = require('./calcIndicators'),
    buySellFunctions = require('./buySell');
var db;
mongo.connectToServer(function (err, client) {
    db = mongo.getDb();
});

module.exports = getTickers = {
    getBtcTickers: () => {
        const btc_callback = (err, response, btc) => {
            db.collection('BTC_Tickers').insertOne(btc, (err, result) => {
                if (err) return console.log(err);
                console.log('\n/* -------------------------BTC------------------------- */\n\nSaved tickers to BTC_Tickers.');
            });
            var data = {
                currency: 'BTC',
                period: 14,
                high: [],
                low: [],
                volumes: [],
                prices: []
            };
            db.collection('BTC_Tickers').find().sort({ time: -1 }).limit(200).toArray((err, tickers) => {
                // console.log(tickers[0])
                if (err) return console.log(err);
                for (var i = tickers.length - 1; i >= 0; i -= 5) {
                    if (tickers[i] != undefined) {
                        data.prices.push(tickers[i].price);
                        data.volumes.push(tickers[i].volume);
                        data.low.push(tickers[i].bid);
                        data.high.push(tickers[i].ask);
                    }
                }

                let indicators = calcIndicators.calcIndHelper(data)
                    .then((indicators) => {
                        setTimeout(() => { buySellFunctions.buySignal(data.currency, 14, indicators.RSI, indicators.OBV, indicators.ADL); }, 150);
                        setTimeout(() => { buySellFunctions.sellSignal(data.currency, 14, indicators.RSI, indicators.OBV, indicators.ADL); }, 150);
                    })
                    .catch((err) => {
                        if (err) console.log(err);
                    })
            });
        };

        authedClient.getProductTicker('BTC-USD', btc_callback);
        setTimeout(getTickers.getBtcTickers, 60000);
    },

    getEthTickers: () => {
        const eth_tickers_cb = (err, response, eth) => {
            db.collection('ETH_Tickers').insertOne(eth, (err, result) => {
                if (err) return console.log(err);
                console.log('\n/* -------------------------ETH------------------------- */\n\nSaved tickers to ETH_Tickers.');
            });
            var data = {
                currency: 'ETH',
                period: 14,
                high: [],
                low: [],
                volumes: [],
                prices: []
            };
            db.collection('ETH_Tickers').find().limit(200).toArray((err, tickers) => {
                if (err) return console.log(err);
                for (var i = tickers.length - 1; i >= 0; i -= 5) {
                    if (tickers[i] != undefined) {
                        data.prices.push(tickers[i].price);
                        data.volumes.push(tickers[i].volume);
                        data.low.push(tickers[i].bid);
                        data.high.push(tickers[i].ask);
                    }
                }

                let indicators = calcIndicators.calcIndHelper(data)
                    .then((indicators) => {
                        setTimeout(() => { buySellFunctions.buySignal(data.currency, 14, indicators.RSI, indicators.OBV, indicators.ADL); }, 50);
                        setTimeout(() => { buySellFunctions.sellSignal(data.currency, 14, indicators.RSI, indicators.OBV, indicators.ADL); }, 50);
                    })
                    .catch((err) => {
                        if (err) console.log(err);
                    });
            });
        };
        authedClient.getProductTicker('ETH-USD', eth_tickers_cb);
        setTimeout(getTickers.getEthTickers, 60000);
    },

    getLtcTickers: () => {
        const ltc_ticker_cb = (err, response, ltc) => {
            db.collection('LTC_Tickers').insertOne(ltc, (err, result) => {
                if (err) return console.log(err);
                console.log('\n/* -------------------------LTC------------------------- */\n\nSaved tickers to LTC_Tickers.');
            });
            var data = {
                currency: 'LTC',
                period: 14,
                high: [],
                low: [],
                volumes: [],
                prices: []
            };
            db.collection('LTC_Tickers').find().limit(200).toArray((err, tickers) => {
                if (err) return console.log(err);
                for (var i = tickers.length - 1; i >= 0; i -= 5) {
                    if (tickers[i] != undefined) {
                        data.prices.push(tickers[i].price);
                        data.volumes.push(tickers[i].volume);
                        data.low.push(tickers[i].bid);
                        data.high.push(tickers[i].ask);
                    }
                }
                let indicators = calcIndicators.calcIndHelper(data)
                    .then((indicators) => {
                        setTimeout(() => { buySellFunctions.buySignal(data.currency, 14, indicators.RSI, indicators.OBV, indicators.ADL); }, 50);
                        setTimeout(() => { buySellFunctions.sellSignal(data.currency, 14, indicators.RSI, indicators.OBV, indicators.ADL); }, 50);
                    })
                    .catch((err) => {
                        if (err) console.log(err);
                    });
            });
        };
        authedClient.getProductTicker('LTC-USD', ltc_ticker_cb);
        setTimeout(getTickers.getLtcTickers, 60000);

    }
};