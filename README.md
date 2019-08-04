# Crypto Currency Trading Algorithm

Technologies Leveraged: 
* Node
* Express
* MongoDB
* CoinbasePro API

Purpose:
- Leverage the Coinbase API to pull and store cryptocurrency data (tickers, trades, volume, price, etc.)
- Retrieve data from MongoDB, calculate technical indicators using data and use basic logic to make buy/sell decisions
- Currencies: BTC, ETH, LTC

## How to Install and Run Crypto Algo 
1. Clone the Crypto_Algo repo <br/>
  **SSH**
   ```
   git clone git@github.com:bnonni/Crypto_Algo.git
   ```
   **HTTPS**
   ```
   git clone https://github.com/bnonni/Crypto_Algo.git
   ```

2. Next, if you're using VScode, run the following commands:
    **terminal/git bash/powershell**
      ```
      cd Crypto_Algo
      code .
      ```
   **VScode integrated terminal**
      ```
      cd app
      ```
   - Not using VSCode? No problem! Simply open the repo in your favorite editor, and navigate to app folder.


3. Inside app/ folder, install dependencies:
   ```
   npm install
   ```

4. Inside the app/ folder, create a file called crypto.env, add your database and Coinbase API credentials to the file.
   ```
   export user="YOUR USERNAME"
   export key="YOUR COINBASE API KEY"
   export secret="YOUR COINBASE API SECRET"
   export passphrase="YOUR COINBASE API PASSPHRASE"
   export password="YOUR PASSWORD"
   ```

5. Source the crypto.env file to export env variables.
   ```
   source crypto.env
   ```

6. Finally, let's run our app!
   ```
   npm run dev
   ```
