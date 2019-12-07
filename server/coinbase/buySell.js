/*jshint esversion: 6 */
const mongo = require('../config/db');
var db;
mongo.connectToServer(function(err, client) {
    db = mongo.getDb();
});

module.exports = buySellSignals = {
    buySignal: (currency, period, RSI, OBV, ADL) => {
        let start, end, today, decision, tickers = ADL.prices;
        if ((RSI[1] <= 29.99) && (RSI[1] <= RSI[0])) {
            if (OBV.slope > 0) {
                if (ADL.slope > 0) {
                    decision = true;
                    /*TODO: Add Coinbase API request to buy*/
                    start = new Date(Date.now() - 300000).toLocaleString();
                    end = new Date(Date.now()).toLocaleString();
                    buySellSignals.logTransaction(currency, 'buy', period, decision, RSI, OBV, ADL, tickers, start, end);
                } else {
                    decision = false;
                }
            } else {
                decision = false;
            }
        } else {
            decision = false;
        }
        today = new Date(Date.now()).toLocaleString();
        console.log(currency + ': Buy Decision => ' + decision + ' @ ' + today);
    },

    sellSignal: (currency, period, RSI, OBV, ADL) => {
        let start, end, today, decision, tickers = ADL.prices;
        if ((RSI[1] >= 50) && (RSI[0] >= RSI[1])) {
            if (OBV.slope < 0) {
                if (ADL.slope < 0) {
                    decision = true;
                    /*TODO: Add Coinbase API request to sell*/
                    start = new Date(Date.now() - 300000).toLocaleString();
                    end = new Date(Date.now()).toLocaleString();
                    buySellSignals.logTransaction(currency, 'sell', period, decision, RSI, OBV, ADL, tickers, start, end);
                } else {
                    decision = false;
                }
            } else {
                decision = false;
            }
        } else {
            decision = false;
        }
        today = new Date(Date.now()).toLocaleString();
        console.log(currency + ': Sell Decision => ' + decision + ' @ ' + today);
    },

    logTransaction: (currency, type, period, decision, RSI, OBV, ADL, tickers, start, end) => {
        if (type == 'buy') {
            var buy_data = buySellSignals.create_data_obj(currency, type, period, decision, RSI, OBV, ADL, tickers, start, end);
            console.log(currency + ' Buy!');
            console.log(buy_data);
            var buy_collection = currency + '_Buys';
            db.collection(buy_collection).insertOne(buy_data, (err, result) => {
                if (err) return console.log(err);
                console.log('Buy successful!! Saved data to ' + currency + '_Buys @ ' + new Date(Date.now()).toLocaleString());
            });
        } else {
            var sell_data = buySellSignals.create_data_obj(currency, type, period, decision, RSI, OBV, ADL, tickers, start, end);
            console.log(currency + ' Sell!');
            console.log(sell_data);
            var sell_collection = currency + '_Sells';
            db.collection(sell_collection).insertOne(sell_data, (err, result) => {
                if (err) return console.log(err);
                console.log('Sell successful!! Saved data to ' + currency + '_Sells @ ' + new Date(Date.now()).toLocaleString());
            });
        }
    },

    create_data_obj: (currency, type, period, decision, RSI, OBV, ADL, tickers, start, end) => {
        let RSIs = [],
            OBVs = [],
            ADLs = [],
            prices = [];
        for (var i = 0; i < 5; i++) {
            RSIs.push(RSI[i]);
            OBVs.push(OBV.OBV[i]);
            ADLs.push(ADL.ADL[i]);
            prices.push(tickers[i]);
        }
        var data = {
            currency: currency,
            type: type,
            period: period,
            decision: decision,
            RSI: RSIs,
            OBV: OBVs,
            OBV_slope: OBV.slope,
            ADL: ADLs,
            ADL_slope: ADL.slope,
            prices: prices,
            start_time: start,
            end_time: end
        };
        return data;
    }
};