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
          currency: 'BTC'
        }
        this.onClick = this.onClick.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.insertNewTickers = this.insertNewTickers.bind(this);
    }

    onClick(e) {
        this.insertNewTickers(this);
    }

    insertNewTickers(e) {
        Axios.post(
            '/',
            querystring.stringify({
                price: e.state.price,
                date: e.state.date,
                bid: e.state.bid,
                ask: e.state.ask,
                volume: e.state.volume
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

    handleTextChange(e) {
        if (e.target.name == 'BTC') {
            this.setState({
                description: e.target.value
            });
        }
        if (e.target.name == 'ETH') {
            this.setState({
                amount: e.target.value
            });
        }
        if (e.target.name == 'LTC') {
            this.setState({
                model: e.target.value
            });
        }
    }

    render() {
        return (
            <div>
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
                    >
                        <span className='glyphicon glyphicon-plus'>BTC</span>
                    </Button>

                    <Button
                        variant='success'
                        size='small'
                        onClick={this.onClick}
                    >
                        <span className='glyphicon glyphicon-plus'>ETH</span>
                    </Button>
                    <Button
                        variant='success'
                        size='small'
                        onClick={this.onClick}
                    >
                        <span className='glyphicon glyphicon-plus'>LTC</span>
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
