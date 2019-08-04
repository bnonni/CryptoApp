 //Render ETH Trades 
 app.get('/eth-trades', (req, res) => {
  // console.log(res);
  db.collection("ETH-trades").find().toArray((err, eth_trade_data) => {
    res.render('ETH-trades.ejs', {
      ETH_trades: eth_trade_data,
      root: path.join(__dirname, './views')
    });
  });
});

/**
   * Coinbase API call - ETH Trades
   */

  function getEthTrades(){
   const eth_trades_cb = (err, response, trades) => {
     if (err) return console.log(err);
     // console.log(trades);
     db.collection("ETH-trades").insertOne(trades, (err, result) => {
       console.log("Saved trades to ETH-trades.");
     });
   };
   authedClient.getProductTrades('ETH-USD', eth_trades_cb);
   var today = Date.now();
   const trades = authedClient.getProductTradeStream('ETH-USD', 1559869200, today);
   calcEthTradeRSI();
 }
 getEthTrades();

 function calcEthTradeRSI () {
   //Find ETH tickers & calculate RSI
   db.collection("ETH-trades").find().toArray((err, trade_data) => {
     var prices = [];
     for(var i = 0; i < trade_data.length; i++){
       if(prices != undefined){
         prices.push(trade_data[i].price);
         // console.log(i + " " + prices);
       }
     }
     var inputRSI = {
       values : prices,
       period : 14
     };
     var RSIs = RSI.calculate(inputRSI);  
     // console.log("Trade RSI: " + RSIs);
   });
 }