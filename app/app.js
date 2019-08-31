#!/usr/bin/env nodejs

const tf = require('@tensorflow/tfjs-node'),
    express = require('express'),
    createError = require('http-errors'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require("body-parser"),
    logger = require('morgan'),
    authedClient = require('./coinbase/Coinbase'),
    passport = require("passport"),
    index = require('./routes/index'),
    usersRouter = require('./routes/users'),
    RSI = require("technicalindicators").RSI,
    session = require('express-session');

var app = express();
var secret = Math.ceil(Math.random() * 90000 + 10000).toString();
var session_cookie = app.use(cookieParser(secret));
var FileStore = require('session-file-store')(session);

app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    store: new FileStore(FileStore),
    cookie: session_cookie
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.use((req, res, next) => {
    next(createError(404));
});

/*Import MongoDB connection & Coinbase Functions*/
var mongo = require('./config/db');
var buySellSignals = require('./coinbase/buySell');
var calcIndicators = require('./coinbase/calcIndicators');
var getTickers = require('./coinbase/getTickers');
var db;
mongo.connectToServer(function (err, client) {
    db = mongo.getDb();
    console.log(db);
    if (err) console.log(err);
    getTickers.getBtcTickers(db);
    // setTimeout(() => { getTickers.getEthTickers(); }, 100);
    // setTimeout(() => { getTickers.getLtcTickers(); }, 100);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;


/*TODO: // mongoose = require("mongoose"); Mongoose Connection, user auth: const user = require("./config/keys");// Connect to MongoDB mongoose.connect(user.MongoURI, { useNewUrlParser: true }).then(() => console.log("MongoDB successfully connected")).catch(err => console.log(err));*/