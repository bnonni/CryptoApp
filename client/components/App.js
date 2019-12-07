import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './App.css';

export default class App extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <a href=''>BTC</a>
                    <a href=''>ETH</a>
                    <a href=''>LTC</a>
                </div>
            </div>
        );
    }
}

/**
 * <Link to={{ pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
                        <Button variant="success" size="small" onClick={this.insertTickers}>BTC</Button>
                    </Link>

                    <Link to={{ pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
                        <Button variant="success" size="mini" onClick={this.closeModal}>ETH</Button>
                    </Link>
                    <Link to={{ pathname: '/', search: '' }} style={{ textDecoration: 'none' }}>
                        <Button variant="success" size="mini" onClick={this.closeModal}>LTC</Button>
                    </Link>
 */