import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { directive } from '@babel/types';

var querystring = require('querystring');

class Currency extends React.Component {
    constructor() {
        super();
        this.state = {
          currency: ''
        }
        this.onClick = this.onClick.bind(this);
        this.insertNewTickers = this.insertNewTickers.bind(this);
    }

    onClick(e) {
        this.insertNewTickers(this);
    }

    insertNewTickers(e) {
        Axios.post(
            `/tickers?currency=${e.state.currency}`,
            querystring.stringify({
                currency: e.state.currency,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        ).then(function(response) {
            e.setState({
                messageFromServer: response.data
            });
        });
    }

    render() {
        return (
            <div>
            <h1>{this.state.currency}</h1>
              <div>
              {/* <label htmlFor="currency">Currency:</label>
              <select id="currency" name="currency" value={this.state.currency} onChange={this.handleSelectChange}>
                <option value="BTC" id="BTC" selected>BTC</option>
                <option value="ETH" id="ETH">ETH</option>
                <option value="LTC" id="LTC">LTC</option>
              </select> */}
                    <Button
                        variant='success'
                        size='small'
                        onClick={this.onClick}
                        name='BTC'
                    >
                        <input type="submit" id="BTC" name="BTC" value={this.state.currency}></input>
                    </Button>

                    <Button
                        variant='success'
                        size='small'
                        onClick={this.onClick}
                        name='ETH'
                    >
                        <input type="submit" id="ETH" name="ETH" value={this.state.currency}></input>
                    </Button>
                    <Button
                        variant='success'
                        size='small'
                        onClick={this.onClick}
                        name='LTC'
                    >
                        <input type="submit" id="LTC" name="LTC" value={this.state.currency}></input>
                    </Button>
                </div>
                {/* <ul className='transactions'>
                    {this.state.data.map(tickers => {
                        return (
                            <li key={tickers.date} className='tickers'>
                                <div className='price'>{tickers.price}</div>
                                <div className='datetime'>Date: {tickers.time}</div>
                                <div className='bid'>Bid: ${tickers.bid}</div>
                                <div className='ask'>Ask: ${tickers.ask}</div>
                                <div className='volume'>
                                    Volume: {tickers.volume}
                                </div>
                            </li>
                        );
                    })}{' '}
                </ul> */}
            </div>
        );
    }
}

export default Currency;
