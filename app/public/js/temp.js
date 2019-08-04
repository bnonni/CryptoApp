
  function calcBtcRSI28 () {
    //Find ETH tickers & calculate RSI
    db.collection("BTC-tickers").find().toArray((err, btc_tickers) => {
      var btc_prices = [];
      for(var i = btc_tickers.length - 1; i >= 0 ; i--){
        if(btc_prices != undefined  && i%5==0){
          btc_prices.push(btc_tickers[i].price);
          // console.log(i + " " + btc_prices);
        }
      }
      // var len = btc_tickers.length - 1;
      // console.log("btc tickers len: " +  len);
      var btc28_RSI_input = {
        values : btc_prices,
        period : 28
      };
      var btc28_RSIs = RSI.calculate(btc28_RSI_input);  
      // console.log("\nBTC Ticker RSI: " + btc_RSI);
      tickerBuySignal(btc28_RSIs, "BTC", btc28_RSI_input.period);
    });
  }

  function calcEthRSI28 () {
    //Find ETH tickers & calculate RSI
    db.collection("ETH-tickers").find().toArray((err, eth_tickers) => {
      var eth_prices = [];
      for(var i = eth_tickers.length - 1; i >= 0; i--){
        if(eth_prices != undefined && i%5==0){
          eth_prices.push(eth_tickers[i].price);
          // console.log(i + " " + prices);
        }
      }
      var eth28_RSI_input = {
        values : eth_prices,
        period : 28
      };
      var eth28_RSIs = RSI.calculate(eth28_RSI_input);  
      // console.log("\nTick RSI: " + RSIs);
      tickerBuySignal(eth28_RSIs, "ETH", eth28_RSI_input.period);
    });
  }