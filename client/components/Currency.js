import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { directive } from '@babel/types';

var querystring = require('querystring');

class Currency extends React.Component {
    constructor() {
        super();
        this.state = {
          btc : 'BTC',
          eth : 'ETH',
          ltc : 'LTC',
          currency : '',
          data : []
        }
        this.onBtcClick = this.onBtcClick.bind(this);
        this.onEthClick = this.onEthClick.bind(this);
        this.onLtcClick = this.onLtcClick.bind(this);
        
        this.insertTickers = this.insertTickers.bind(this);
    }

    onBtcClick(e) {
        this.state.currency = this.state.btc;
        this.insertTickers(this.state.currency);
    }

    onEthClick(e) {
        this.state.currency = this.state.eth; 
        this.insertTickers(this.state.eth);
    }

    onLtcClick(e) {
        this.state.currency = this.state.ltc
        this.insertTickers(this.state.ltc);
    }

    insertTickers(e) {
        axios
        .get(`/tickers?currency=${e}`)
        .then(response => {
            ev.setState({ currency: e, data: response.data });
        })
        .catch(err => err);
    }

    render() {
        return (
        <div>
            <Button
                variant='success'
                size='small'
                onClick={this.onBtcClick}
                name='BTC'
            >
                <div id="BTC" name="BTC">{this.state.btc}</div>
            </Button>

            <Button
                variant='success'
                size='small'
                onClick={this.onEthClick}
                name='ETH'
            >
                <div id="ETH" name="ETH">{this.state.eth}</div>
            </Button>
            <Button
                variant='success'
                size='small'
                onClick={this.onLtcClick}
                name='LTC'
            >
                <div id="LTC" name="LTC">{this.state.ltc}</div>
            </Button>
        </div>
        );
    }
}

export default Currency;
