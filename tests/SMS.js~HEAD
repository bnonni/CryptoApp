#!/usr/bin/env node
/*jshint esversion: 6 */

var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({ host: 'vtext.com', port: 587, secure: false, });
let mailOptions = { from: 'CryptoAlgo', to: '6785754166@vtext.com', subject: 'test', text: 'test' };

transporter.sendMail(mailOptions, (error, info) => {
 if (error) return console.log(error);
 console.log('Message %s sent: %s', info.messageId, info.response);
});