import React from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import Axios from "axios"
import { directive } from '@babel/types';

var querystring = require('querystring');

class Currency extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     tickers: {},
  //   };
  //   this.getTickerData = this.getTickerData.bind(this);
  // }

  // componentDidMount() {
  //   this.getTickerData(this, '');
  // }

  // componentDidUpdate(nextProps) {
  //   this.getTickerData(this, '');
  // }

  // getTickerData(ev, model) {
  //   axios.get('/tickerData')
  //     .then((response) => {
  //       ev.setState({ data: response.data });
  //     })
  //     .catch(err => err);
  // }
  constructor() {
    super();
    this.state;
    this.onClick = this.onClick.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.insertTickers = this.insertTickers.bind(this);
  }

  onClick(e) {
    this.insertNewRental(this);
  }

  insertTickers(e) {
    Axios.post('/tickers',
      querystring.stringify({
        year: e.state.year,
        make: e.state.make,
        model: e.state.model,
        description: e.state.description,
        amount: e.state.amount,
        available: e.state.available
      }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).then(function (response) {
      e.setState({
        messageFromServer: response.data
      });
    });
  }

  handleTextChange(e) {
    if (e.target.name == "description") {
      this.setState({
        description: e.target.value
      });
    }
    if (e.target.name == "amount") {
      this.setState({
        amount: e.target.value
      });
    }
    if (e.target.name == "model") {
      this.setState({
        model: e.target.value
      })
    }
  }

  render() {
    return (
      <div>
        <ul class="transactions">
          {
            this.state.data.map((tickers) => {
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
    )
  }
}

export default Currency;