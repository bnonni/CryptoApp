import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

export default class App extends React.Component {

    constructor() {
        super();
        this.state = {
            tickers: '', selectedModel: '', data: []
        };
        this.getData = this.getData.bind(this);
    }

    componentDidMount() {
        this.getTickers(this, '');
    }

    componentDidUpdate(nextProps) {
        this.getTickers(this, '');
    }

    getTickers(ev, model) {
        axios.get('/tickers')
            .then(function (response) {
                ev.setState({ data: response.data });
            })
            .catch(err => err);
    }

    render() {
        return (

            <div>
                <Add />
                <ul class="transactions">
                    {
                        this.state.data.map(function (tickers) {
                            return <li class="tickers">
                                <div class="price">{tickers.price}</div>
                                <div class="datetime">Date: {tickers.time}</div>
                                <div class="bid">Bid: ${tickers.bid}</div>
                                <div class="ask">Ask: ${tickers.ask}</div>
                                <div class="volume">Volume: {tickers.volume}</div>
                            </li>
                        })
                    } </ul>
            </div>
        );
    }
}