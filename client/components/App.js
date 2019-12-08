import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import '../css/App.css';
import Currency from './Currency';

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            currency: 'BTC', data: []
        };
        this.getBTCtickers = this.getBTCtickers.bind(this);
    }

    componentDidMount() {
        this.getBTCtickers(this, '');
    }

    componentDidUpdate(nextProps) {
        this.getBTCtickers(this, '');
    }

    getBTCtickers(ev, model) {
        axios
            .get('/BTC')
            .then(response => {
                ev.setState({ data: response.data });
            })
            .catch(err => err);
    }

    render() {
        return (
            <div>
                <Currency />                
                <ul className='transactions'>
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
                    })}
                </ul>
            </div>
        );
    }
}
