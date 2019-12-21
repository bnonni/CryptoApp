/*jshint esversion: 6 */

const mongo = require('../config/db'),
    buySellFunctions = require('./buySell'),
    RSI = require('technicalindicators').RSI,
    OBV = require('technicalindicators').OBV,
    ADL = require('technicalindicators').ADL,
    SMA = require('technicalindicators').SMA,
    EMA = require('technicalindicators').EMA,
    LR = require('simple-statistics').linearRegression,
    serverLogger = require('../logs/serverLogger');
var db;
mongo.connectToServer((err, client) => {
    if (err) serverLogger.log(err);
    db = mongo.getDb();
});

module.exports = calcIndicators = {
    calcIndHelper: (data) => {
        var RSI = calcIndicators.calcRSI(data);
        // serverLogger.log("RSI", RSI)
        var OBV = calcIndicators.calcOBV(data);
        // serverLogger.log("OBV", OBV)
        var ADL = calcIndicators.calcAccDist(data);
        // serverLogger.log("RSI", ADL)
        var obj = { 'RSI': RSI, 'OBV': OBV, 'ADL': ADL };
        return Promise.resolve(obj);
    },
    calcRSI: (data) => {
        let input = {
            values: data.prices,
            period: data.period
        };

        let RSIs = RSI.calculate(input);

        let RSI_log = {
            currency: data.currency,
            time: Date.now(),
            period: input.period,
            close: [input.values[0], input.values[1], input.values[2]],
            RSI: [RSIs[0], RSIs[1], RSIs[2]],
        };
        let collection = data.currency + '_RSI14_Data';
        db.collection(collection).insertOne(RSI_log, (err, result) => {
            if (err) serverLogger.log(err);
            serverLogger.log('Saved RSIs to ' + collection + '.');
        });

        return RSIs;
    },

    calcOBV: (data) => {
        let i = 0,
            prices = [],
            volumes = [];
        while (i <= 20) {
            let price = Number(parseFloat(data.prices[i]).toFixed(2));
            prices.push(price);
            let volume = Number(Math.round(data.volumes[i]));
            volumes.push(volume);
            i++;
        }

        let input = {
            close: prices,
            volume: volumes
        };

        let OBVs = OBV.calculate(input);

        let slope = LR([
            [OBVs[0], OBVs[1], OBVs[2]],
            [2, 1, 0]
        ]);

        let OBV_data = {
            OBV: OBVs,
            slope: slope.m
        };

        let OBV_log = {
            currency: data.currency,
            time: Date.now(),
            close: [input.close[0], input.close[1], input.close[2]],
            volume: [input.volume[0], input.volume[1], input.volume[2]],
            OBV: OBV_data.OBV[0],
            slope: OBV_data.slope
        };

        let collection = data.currency + '_OBV_Data';
        db.collection(collection).insertOne(OBV_log, (err, result) => {
            if (err) serverLogger.log(err);
            serverLogger.log('Saved OBVs to ' + collection + '.');
        });

        return OBV_data;
    },

    calcAccDist: (data) => {
        let input = {
            high: data.high,
            low: data.low,
            close: data.prices,
            volume: data.volumes
        };
        let ADLs = ADL.calculate(input);

        let slope = LR([
            [ADLs[0], ADLs[1], ADLs[2]],
            [2, 1, 0]
        ]);

        let ADL_data = {
            prices: data.prices,
            slope: slope.m,
            ADL: ADLs
        };

        let ADL_log = {
            currency: data.currency,
            time: Date.now(),
            close: [input.close[0], input.close[1], input.close[2]],
            volume: [input.volume[0], input.volume[1], input.volume[2]],
            ADL: ADL_data.ADL[0],
            slope: ADL_data.slope
        };

        let collection = data.currency + '_ADL_Data';
        db.collection(collection).insertOne(ADL_log, (err, result) => {
            if (err) serverLogger.log(err);
            serverLogger.log('Saved ADLs to ' + collection + '.');
        });

        return ADL_data;
    },

    calcMovAvg: () => { },
};

/*TODO:

Calc LTC Ticker RSI calcLtcRSI14: () => { let currency = 'LTC'; Find ETH tickers & calculate RSI db.collection('LTC_Tickers').find().toArray((err,ltc_tickers) => { if (err) serverLogger.log(err); let ltc_prices = []; for (let i = ltc_tickers.length - 1; i >= 0; i--) { if (ltc_tickers[i] != undefined) { ltc_prices.push(ltc_tickers[i].price); } } serverLogger.log('Line 148: BTC Price: ' + LTC_prices[0]);Input Object - RSI Calculationlet LTC_RSI_input = { values: ltc_prices, period: 14};serverLogger.log(LTC_RSI_input);Output Object - RSI Calculationlet LTC_RSI_output = RSI.calculate(LTC_RSI_input);serverLogger.log(LTC_RSI_output);buySellFunctions.buySignal(currency, LTC_RSI_input.period, LTC_RSI_output, ltc_prices); calcIndicators.logRSI(currency, LTC_RSI_output); setTimeout(() => { buySellFunctions.sellSignal(currency, LTC_RSI_input.period, LTC_RSI_output, ltc_prices); }, 100);});}};var btc_tickers = calcIndicators.pullBTCtickers(); var currency = 'BTC', btc_prices = [], btc_volume = []; for (var i = btc_tickers.prices.length - 1; i >= 0;i--) {if (btc_tickers[i] != undefined) {btc_prices.push(btc_tickers[i].price);btc_volume.push(btc_tickers[i].volume);}}serverLogger.log(btc_prices); serverLogger.log(btc_volume);Calculate RSI - ETH Tickers calcRSI14: () => {let currency = 'ETH';db.collection('ETH_Tickers').find().toArray((err, eth_tickers) => {let eth_prices = [];for (let i = eth_tickers.length - 1; i >= 0; i--) {if (eth_tickers[i] != undefined) {eth_prices.push(eth_tickers[i].price);}}let ETH_RSI_input = {values: eth_prices,period: 14};let ETH_RSI_output = RSI.calculate(ETH_RSI_input);buySellFunctions.buySignal(currency, ETH_RSI_input.period, ETH_RSI_output, eth_prices);calcIndicators.logRSI(currency, ETH_RSI_output);setTimeout(() => { buySellFunctions.sellSignal(currency, ETH_RSI_input.period, ETH_RSI_output, eth_prices); }, 100)});},
*/