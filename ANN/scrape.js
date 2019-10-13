const axios = require('request');
const cheerio = require('cheerio');
const fs = require('fs');


const url = 'https://coinmarketcap.com/currencies/bitcoin/historical-data/?start=20190615&end=20190912';



function write(data){
 fs.writeFile('BTC_Real_Prices.txt', data, {
  function(err){
   if (err) throw err;
   console.log("Data written successfully.");
  }
 });
}