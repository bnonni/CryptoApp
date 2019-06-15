//Render ETH Tickers
app.get("/eth-tickers", (req, res) => {
 // console.log(res);
 db.collection("ETH_Tickers").find().toArray((err, eth_ticker_data) => {
   res.render("eth-tickers.ejs", {
     ETH_tickers: eth_ticker_data,
     root: path.join(__dirname, "./views")
   });
 });
});

/**
   * ETH Functions
   */
  //Coinbase API call - ETH Tickers
  function getEthTickers(){
    const eth_tickers_cb = (err, response, eth) => {
      //  console.log("ETH Ticker: " + eth[0]);
      db.collection("ETH_Tickers").insertOne(eth, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved tickers to ETH_Tickers.");
      });
    };
    authedClient.getProductTicker("ETH-USD", eth_tickers_cb);
    calcEthRSI14_FiveMin();
    setTimeout(getEthTickers, 65000);
  }
  //Calculate RSI - ETH Tickers
  function calcEthRSI14_FiveMin () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH_Tickers").find().toArray((err, eth_tickers) => {
      var eth_prices = [];
      var eth_prices_log = [];
      var j = 0;
      for(var i = eth_tickers.length - 1; i >= 0; i--){
        if(eth_tickers[i] != undefined && i%5==0){
          eth_prices.push(eth_tickers[i].price);
          if(j < 5){
            eth_prices_log.push(eth_tickers[j].price);
            j++;
          }
        }
      }
      // console.log("ETH Price: " + eth_prices[0]);
      //Input Object - RSI Calculation
      var ETH_RSI_input = {
        values : eth_prices,
        period : 14
      };
      // console.log(ETH_RSI_input);
      //Output Object - RSI Calculation
      var ETH_RSI_output = RSI.calculate(ETH_RSI_input);
      // console.log(ETH_RSI_output);
      //New Object - RSI MongoDB Log
      var ETH_RSI_log = {
        currency : "ETH",
        time : Date.now(),
        period : 14,
        RSI : ETH_RSI_output
      };
      // console.log(ETH_RSI_log);
      db.collection("ETH_RSI14_Data").insertOne(ETH_RSI_log, (err, result) => {
        if (err) return console.log(err);
        console.log("Saved RSIs to ETH_RSI14_Data.");
       });
       buySignalRSILow(ETH_RSI_output, eth_prices, "ETH", ETH_RSI_input.period);
    });
  }