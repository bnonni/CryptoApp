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
        this.getTickers = this.getTickers.bind(this);
    }

    componentDidMount() {
        this.getTickers(this, '');
    }

    componentDidUpdate(nextProps) {
        this.getTickers(this, '');
    }

    getTickers(ev, model) {
        axios
            .get(`/tickers?currency=${this.state.currency}`)
            .then(response => {
                ev.setState({ data: response.data });
            })
            .catch(err => err);
    }

    render() {
        return (
            <div>
                <h1>{this.state.currency}</h1>
                <Currency />                
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
