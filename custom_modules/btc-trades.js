//Render BTC Trades 
app.get('/btc-trades', (req, res) => {
  // console.log(res);
  db.collection("BTC-trades").find().toArray((err, btc_trade_data) => {
    res.render('BTC-trades.ejs', {
      BTC_trades: btc_trade_data,
      root: path.join(__dirname, './views')
    });
  });
});
// //Coinbase API call - BTC Trades
function getBtcTrades(){
  const btc_trades_cb = (err, response, btc_trades) => {
    if (err) return console.log(err);
    // console.log(trades);
    db.collection("BTC-trades").insertOne(btc_trades, (err, result) => {
      console.log("Saved trades to BTC-trades.");
    });
  };
  authedClient.getProductTrades('BTC-USD', btc_trades_cb);
  var today = Date.now();
  const trades = authedClient.getProductTradeStream('BTC-USD', 1559869200, today);
  calcBtcTradeRSI();
}
/**
   * Calculate RSI - BTC Trades
   */
  function calcBtcTradeRSI () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-trades").find().toArray((err, trade_data) => {
      var btc_trades = [];
      for(var i = 0; i < trade_data.length; i++){
        if(btc_trades != undefined){
          btc_trades.push(trade_data[i].price);
          // console.log(i + " " + prices);
        }
      }
      var inputRSI = {
        values : btc_trades,
        period : 14
      };
      var RSIs = RSI.calculate(inputRSI);  
      // console.log("Trade RSI: " + RSIs);
    });
  }
  getBtcTrades();