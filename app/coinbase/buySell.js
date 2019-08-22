const mongo = require('../config/db');
var db;
mongo.connectToServer(function (err, client) {
    db = mongo.getDb();
});

module.exports = buySellSignals = {
    //'BTC', 14, RSI, OBV, ADL.ADL, ADL.prices
    buySignal: (currency, period, RSI, OBV, ADL) => {
        let start, end, today, decision, tickers = ADL.prices;
        // IF( RSI14[1] < 29 && RSI14[1] < RSI[0] )
        if ((RSI[1] < 29) && (RSI[1] < RSI[0])) {

            // IF(Slope(OBV[0],OBV[1],OBV[2])>0
            if (OBV.slope > 0) {

                // IF(Slope(AccDis[0],AccDis[1],AccDis[2])>0
                if (ADL.slope > 0) {

                    decision = true;
                    /*TODO: Add Coinbase API request to buy*/
                    start = new Date(Date.now() - 300000).toLocaleString();
                    end = new Date(Date.now()).toLocaleString();
                    buySellSignals.logBuySellDataToMongo(currency, 'buy', period, decision, RSI, OBV.OBV, ADL.ADL, tickers, start, end);
                }
            }
        } else {
            decision = false;
        }
        today = new Date(Date.now()).toLocaleString();
        console.log(currency + ': ' + period + ' Period Buy Decision => ' + decision + ' @ ' + today);
    },

    sellSignal: (currency, period, RSI, OBV, ADL) => {
        let start_time, end_time, today;
        var rsi_sell_decision;
        if (RSIs[1] >= 50) {
            if (RSIs[0] >= RSIs[1]) {
                rsi_sell_decision = true;
                /*TODO: Add Coinbase API request to sell*/
                start_time = new Date(Date.now() - 300000).toLocaleString();
                end_time = new Date(Date.now()).toLocaleString();
                buySellSignals.logBuySellDataToMongo(currency, 'sell', period, rsi_sell_decision, RSI, prices, start_time, end_time);
            }
        } else {
            rsi_sell_decision = false;
        }
        today = new Date(Date.now()).toLocaleString();
        console.log(currency + ': ' + period + ' Period Sell Decision => ' + rsi_sell_decision + ' @ ' + today);
    },

    logBuySellDataToMongo: (currency, type, period, decision, RSI, OBV, ADL, tickers, start, end) => {
        if (type == 'buy') {
            var buy_data = buySellSignals.create_buy_obj(currency, type, period, decision, RSI, OBV, ADL, tickers, start, end)
            console.log(currency + ' Buy!');
            console.log(buy_data);
            var buy_collection = currency + '_Buys';
            db.collection(buy_collection).insertOne(buy_data, (err, result) => {
                if (err) return console.log(err);
                console.log('Buy successful!! Saved data to ' + currency + '_Buys @ ' + new Date(Date.now()).toLocaleString());
            });
        } else {
            var sell_data = buySellSignals.create_sell_obj(currency, type, per, dec, rsi, pri, st, ed);
            console.log(currency + ' Sell!');
            console.log(sell_data);
            var sell_collection = currency + '_Sells';
            db.collection(sell_collection).insertOne(sell_data, (err, result) => {
                if (err) return console.log(err);
                console.log('Sell successful!! Saved data to ' + currency + '_Sells @ ' + new Date(Date.now()).toLocaleString());
            });
        }
    },

    create_buy_obj: (currency, type, period, decision, RSI, OBV, ADL, tickers, start, end) => {
        let RSIs = [], OBVs = [], ADLs = [], prices = [];
        for (var i = 0; i < 5; i++) {
            RSIs.push(RSI[i]);
            OBVs.push(OBV[i]);
            ADLs.push(ADL[i]);
            prices.push(tickers[i]);
        }
        var buy_data = {
            currency: currency,
            type: type,
            period: period,
            buy_decision: decision,
            RSI: RSIs,
            OBV: OBVs,
            ADL: ADLs,
            prices: prices,
            start_time: start,
            end_time: end
        };
        return buy_data;
    },

    create_sell_obj: (c, t, p, d, r, pr, s, e) => {
        var new_r = [];
        var new_p = [];
        for (var i = 0; i < 5; i++) {
            new_r.push(r[i]);
            new_p.push(pr[i]);
        }
        var sell_data = {
            currency: c,
            type: t,
            period: p,
            sell_decision: d,
            RSIs: new_r,
            prices: new_p,
            start_time: s,
            end_time: e
        };
        return sell_data;
    }
};