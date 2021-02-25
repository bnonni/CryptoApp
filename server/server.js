#!/usr/bin/env nodejs

/*jshint esversion: 6 */
const tf = require('@tensorflow/tfjs-node'),
    express = require('express'),
    createError = require('http-errors'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    authedClient = require('./crypto/Coinbase'),
    passport = require('passport'),
    routes = require('./routes/routes')

var app = express();

require('dotenv').config({path: '../.env'})
require('./config/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit:'50mb' }));
app.use(bodyParser.text({type: function(_){return 'text'}}))


app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.use('/', routes);

var getTickers = require('./crypto/GetTickers');

module.exports = app;