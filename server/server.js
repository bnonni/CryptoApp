#!/usr/bin/env nodejs

/*jshint esversion: 6 */
const tf = require('@tensorflow/tfjs-node'),
    express = require('express'),
    createError = require('http-errors'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    authedClient = require('./coinbase/Coinbase'),
    passport = require('passport'),
    routes = require('./routes/routes'),
    session = require('express-session'),
    tropowebapi = require('tropo-webapi'),
    serverLogger = require('./logs/serverLogger'),
    querystring = require('querystring');

var app = express();
serverLogger.init();
app.use('/', routes);

var secret = Math.ceil(Math.random() * 90000 + 10000).toString();
var session_cookie = app.use(cookieParser(secret));
var f = require('session-file-store')(session);

app.use(
    session({
        secret: secret,
        resave: true,
        saveUninitialized: true,
        store: new f(f),
        cookie: session_cookie
    })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client'));
app.use(express.static(path.join(__dirname, '../client')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    next(createError(404));
});

/*Import MongoDB connection & Coinbase Functions*/
var mongo = require('./config/db');
var getTickers = require('./coinbase/GetTickers');
mongo.connectToServer(function(err, client) {
    if (err) console.log(err);
    getTickers.getBtcTickers();
    setTimeout(() => {
        getTickers.getEthTickers();
        setTimeout(() => {
            getTickers.getLtcTickers();
        }, 3000);
    }, 3000);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

/*TODO: // mongoose = require('mongoose'); Mongoose Connection, user auth: const user = require('./config/keys');// Connect to MongoDB mongoose.connect(user.MongoURI, { useNewUrlParser: true }).then(() => console.log('MongoDB successfully connected')).catch(err => console.log(err));*/