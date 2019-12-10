# Crypto Currency Trading Algorithm | connorlacy/development
## How to Install and Run

1. Switch over to your dev branch<br/>
    ```
    git fetch
    git pull
    git checkout connorlacy/development
    ```

2. Install dependencies (skip if you've done this):

    ```
    yarn install
    ```

3. Create crypto.env file (skip if you've done this):
    ```
    touch crypto.env
    ```

4. Copy the API info from [server/config/credentials.txt](./server/config/credentials.txt) into crypto.env:

    ```
    export key='YOUR COINBASE API KEY
    export secret='YOUR COINBASE API SECRET'
    export passphrase='YOUR COINBASE API PASSPHRASE'
    ```

5. Decode the last two lines in the [server/config/credentials.txt](./server/config/credentials.txt) file:
    **Hint: Use a [ROT13 decoder](https://rot13.com/)**
    ```
    rkcbeg znhfe='PelcgbNytbNqzva'
    rkcbeg zncjq='pelcgbjnyyrg'
    ```

6. Add these 2 decoded lines as-is to the end of the crypto.env file.

7. Source the crypto.env file to export env variables:

    ```
    source crypto.env
    ```

8. Run the app, and go to [http://127.0.0.1:8080](http://127.0.0.1:8080):

    ```
    yarn start
    ```
______________________________________________________________________________________________________
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
This project uses [yarn](https://yarnpkg.com/en/).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
