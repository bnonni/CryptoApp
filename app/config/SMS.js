var SMS = require('nodemailer');

let transporter = nodemailer.createTransport({
 service: 'vtext.com',
});
let mailOptions = {
 from: 'Crypto Algo',
 to: '6785754166@vtext.com',
 subject: '',
 text: '',
};

transporter.sendMail(mailOptions, (error, info) => {
 if (error) return console.log(error);
 console.log('Message %s sent: %s', info.messageId, info.response);
});

module.exports = text;