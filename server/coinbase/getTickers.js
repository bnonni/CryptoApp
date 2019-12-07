/*jshint esversion: 6 */
const mongo = require('../config/db'),
    authedClient = require('./Coinbase'),
    calcIndicators = require('./calcIndicators'),
    buySellFunctions = require('./buySell');
var db;
mongo.connectToServer(function(err, client) {
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
            db.collection('BTC_Tickers').find().limit(200).toArray((err, tickers) => {
                if (err) return console.log(err);
                for (var i = tickers.length - 1; i >= 0; i -= 5) {
                    if (tickers[i] != undefined) {
                        data.prices.push(tickers[i].price);
                        data.volumes.push(tickers[i].volume);
                        data.low.push(tickers[i].bid);
                        data.high.push(tickers[i].ask);
                    }
                }

                let promise = getTickers.calcIndHelper(data);
                promise.then((d, e) => {
                    if (e) return console.log(e);
                    // console.log("promise:", d.ADL.prices)
                    // console.log("promise:", d.ADL.ADL)
                    buySellFunctions.buySignal("BTC", 14, d.RSI, d.OBV, d.ADL);
                    buySellFunctions.sellSignal("BTC", 14, d.RSI, d.OBV, d.ADL);
                }, console.log('err'));


                // setTimeout(() => { buySellFunctions.buySignal(data.currency, 14, RSI, OBV, ADL); }, 50);

                // setTimeout(() => { buySellFunctions.sellSignal('BTC', 14, RSI, OBV, ADL); }, 50);
            });
        };

        authedClient.getProductTicker('BTC-USD', btc_callback);
        setTimeout(getTickers.getBtcTickers, 60000);
    },

    calcIndHelper: (data) => {
        var RSI = calcIndicators.calcRSI(data);
        // console.log("RSI", RSI)
        var OBV = calcIndicators.calcOBV(data);
        // console.log("OBV", OBV)
        var ADL = calcIndicators.calcAccDist(data);
        // console.log("RSI", ADL)
        var obj = { RSI, OBV, ADL };
        return Promise.resolve(obj);
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
                var RSI = calcIndicators.calcRSI(data);

                var OBV = calcIndicators.calcOBV(data);

                var ADL = calcIndicators.calcAccDist(data);

                setTimeout(() => { buySellFunctions.buySignal('ETH', 14, RSI, OBV, ADL); }, 50);

                setTimeout(() => { buySellFunctions.sellSignal('ETH', 14, RSI, OBV, ADL); }, 50);

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
                var RSI = calcIndicators.calcRSI(data);

                var OBV = calcIndicators.calcOBV(data);

                var ADL = calcIndicators.calcAccDist(data);

                setTimeout(() => { buySellFunctions.buySignal('LTC', 14, RSI, OBV, ADL); }, 50);

                setTimeout(() => { buySellFunctions.sellSignal('LTC', 14, RSI, OBV, ADL); }, 50);
            });
        };
        authedClient.getProductTicker('LTC-USD', ltc_ticker_cb);
        setTimeout(getTickers.getLtcTickers, 60000);

    }
};