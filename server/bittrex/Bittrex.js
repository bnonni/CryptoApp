const apiKey = process.env.bittrexApiKey,
      apiSecret = process.env.bittrexSecret,
      Bittrex = require('bittrex-wrapper'),
      bittrex = new Bittrex(apiKey, apiSecret);

bittrex.publicGetTicker('USD-ETH').then((response) => {
 console.log(response);
}).catch((error) => {
 console.log(error);
});