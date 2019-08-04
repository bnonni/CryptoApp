/*jshint esversion: 6 */
mongo.connect(err => {
  if (err) return console.log(err);
  db = mongo.db("crypto_wallet");

  function getLtcTickers(){
    const ltc_ticker_cb = (err, response, ltc) => {
       console.log(ltc);
      db.collection("LTC_Tickers").insertOne(ltc, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to LTC_Tickers.");
      });
      calcLtcRSI14();
    };
    authedClient.getProductTicker("LTC-USD", ltc_ticker_cb);
    setTimeout(getLtcTickers, 60000);
  }

  //Calc LTC Ticker RSI
  function calcLtcRSI14 () {
  //Find ETH tickers & calculate RSI
  db.collection("LTC_Tickers").find().toArray((err, ltc_tickers) => {
    if (err) return console.log(err);
    var ltc_prices = [];
    // var ltc_prices_log = [];
    // var j = 0;
    for(var i = ltc_tickers.length - 1; i >= 0 ; i--){
      if(ltc_tickers[i] != undefined){
        ltc_prices.push(ltc_tickers[i].price);
        // if(j < 5){
        //   ltc_prices_log.push(ltc_tickers[j].price);
        //   j++;
        // }
      }
    }
    // console.log("Line 148: BTC Price: " + LTC_prices[0]);
    //Input Object - RSI Calculation
    var LTC_RSI_input = {
      values : ltc_prices,
      period : 14
    };
     console.log(LTC_RSI_input);
    //Output Object - RSI Calculation
    var LTC_RSI_output = RSI.calculate(LTC_RSI_input);
     console.log(LTC_RSI_output);
    //New Object - RSI MongoDB Log
  //   var LTC_RSI_log = {
  //     currency : "LTC",
  //     time : new Date(Date.now()).toLocaleString();,
  //     period : 14,
  //     RSI : LTC_RSI_output
  //   };
  //   //  console.log(LTC_RSI_log);
  //   db.collection("LTC_RSI14_Data").insertOne(LTC_RSI_log, (err, result) => {
  //     if (err) return console.log(err);
  //     console.log("Saved RSIs to LTC_RSI14_Data.");
  //     });
      buySignalRSI("LTC",  LTC_RSI_input.period, LTC_RSI_output, ltc_prices);
      sellSignalRSI("LTC",  LTC_RSI_input.period, LTC_RSI_output, ltc_prices);
    });
  }
  getLtcTickers();
});