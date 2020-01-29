# Crypto Currency Trading Algorithm
[![Codeship Status for Crypto_Algo](https://app.codeship.com/projects/a06143f0-1e93-0138-b580-4a54e7b00208/status?branch=master)](https://app.codeship.com/projects/382175)

Technologies Leveraged:

-   Node
-   Express
-   MongoDB
-   CoinbasePro API

Purpose:

-   Leverage the Coinbase API to pull and store cryptocurrency data (tickers, volume, datetime)
-   Retrieve data from MongoDB and calculate technical indicators (RSI, OBV, ADL, EMA/SMA) to inform buy/sell decisions
-   Leverage neural networks to test assumptions about features and determine best target variable to optmize trading decisions on
-   Currencies: BTC, ETH, LTC

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
   - Not using VSCode? No problem! Simply open the repo in your favorite editor, and navigate to Crypto_Algo folder.


3. Inside app/ folder, install dependencies:
   ```
   yarn install
   ```

4. Inside the repo folder, create a file called crypto.env, add your database and Coinbase API credentials to the file.
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
   **To source this file everytime you open bash, run this line of code in your terminal. Replace "path/to/file" with the path to your crypto.env file**
   ```
   echo "source path/to/crypto.env" >> ~/.bashrc

6. Finally, let's run our app!
   ```
   yarn start
   ```
