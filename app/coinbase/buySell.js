var mongo = require('../config/db');
var calcLogRSI = require('./*')
var db;
mongo.connectToServer(function (err, client) {
 db = mongo.getDb();
});

module.exports = buySellSignals = {

 buySignalRSI: (currency, period, RSIs, prices) => {
  var start_time, end_time, today, RSI5 = RSIs;;
  var rsi5_buy_decision, rsi14_buy_decision;
  /**
   * (period == 5 && RSI5[4] < 50 && RSI5[3] < 45 && RSI5[2] < 30 && RSI5[1] < 28)
   */
  if (period == 5) {
   if (RSI5[4] < 50)
    if (RSI5[3] < 45)
     if (RSI5[2] < 30)
      if (RSI5[1] < 28)
       if (RSI5[0] > RSI5[1])
        if (RSI5[0] > 32) {
         rsi5_buy_decision = true;
         calcLogRSI.calcBtcRSI14()
        } else {
         rsi5_buy_decision = false;
        }
  }

  if (RSIs[1] <= 29) {
   if (RSIs[1] >= RSIs[0]) {
    rsi14_buy_decision = true;
    /*TODO: Add Coinbase API request to buy*/
    start_time = new Date(Date.now() - 300000).toLocaleString();
    end_time = new Date(Date.now()).toLocaleString();
    buySellSignals.logBuySellDataToMongo(currency, "buy", period, rsi_buy_decision, RSIs, prices, start_time, end_time);
   }
  } else {
   rsi14_buy_decision = false;
  }
 }
  today = new Date(Date.now()).toLocaleString();
 console.log(currency + ": " + period + " Period Buy Decision => " + rsi_buy_decision + " @ " + today);
},

 sellSignalRSI: (currency, period, RSIs, prices) => {
  let start_time, end_time, today;
  var rsi_sell_decision = false;
  if (RSIs[1] >= 50) {
   if (RSIs[0] >= RSIs[1]) {
    rsi_sell_decision = true;
    /*TODO: Add Coinbase API request to sell*/
    start_time = new Date(Date.now() - 300000).toLocaleString();
    end_time = new Date(Date.now()).toLocaleString();
    buySellSignals.logBuySellDataToMongo(currency, "sell", period, rsi_sell_decision, RSIs, prices, start_time, end_time);
   }
  } else {
   rsi_sell_decision = false;
  }
  today = new Date(Date.now()).toLocaleString();
  console.log(currency + ": " + period + " Period Sell Decision => " + rsi_sell_decision + " @ " + today);
 },

  logBuySellDataToMongo: (curr, type, per, dec, rsi, pri, st, ed) => {
   if (type == "buy") {
    var buy_data = buySellSignals.create_buy_obj(curr, type, per, dec, rsi, pri, st, ed);
    console.log(curr + " Buy!");
    console.log(buy_data);
    var buy_collection = curr + "_RSI14_Buys";
    db.collection(buy_collection).insertOne(buy_data, (err, result) => {
     if (err) return console.log(err);
     console.log("Buy successful!! Saved data to " + curr + "_RSI14_Buys @ " + new Date(Date.now()).toLocaleString() + "\n");
    });
   } else {
    var sell_data = buySellSignals.create_sell_obj(curr, type, per, dec, rsi, pri, st, ed);
    console.log(curr + " Sell!");
    console.log(sell_data);
    var sell_collection = curr + "_RSI14_Sells";
    db.collection(sell_collection).insertOne(sell_data, (err, result) => {
     if (err) return console.log(err);
     console.log("Sell successful!! Saved data to " + curr + "_RSI14_Sells @ " + new Date(Date.now()).toLocaleString() + "\n");
    });
   }
  },

   create_buy_obj: (c, t, p, d, r, pr, s, e) => {
    var new_r = [];
    var new_p = [];
    for (var i = 0; i < 5; i++) {
     new_r.push(r[i]);
     new_p.push(pr[i]);
    }
    var buy_data = {
     currency: c,
     type: t,
     period: p,
     buy_decision: d,
     RSIs: new_r,
     prices: new_p,
     start_time: s,
     end_time: e
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
