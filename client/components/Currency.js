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
    }

    onBtcClick(e) {
        this.state.currency = this.state.btc;
        this.getTickers(this.state.btc);
    }

    onEthClick(e) {
        this.state.currency = this.state.eth; 
        this.getTickers(this.state.eth);
    }

    onLtcClick(e) {
        this.state.currency = this.state.ltc
        this.getTickers(this.state.ltc);
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
        
         <ul className='transactions'>
         {this.state.data.map(tickers => {
             return (
                 <li key={tickers.date} className='tickers'>
                     <div className='price'>{tickers.price}</div>
                     <div className='datetime'>Date: {tickers.time}</div>
                     <div className='bid'>Bid: ${tickers.bid}</div>
                     <div className='ask'>Ask: ${tickers.ask}</div>
                     <div className='volume'> Volume: {tickers.volume} </div>
                 </li>
             );
         })}
        </ul>
     </div>
     );
    }
}

export default Currency;
