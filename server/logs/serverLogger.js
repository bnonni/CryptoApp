const fs = require('fs');
var dt_obj = new Date(Date.now());
const date = String(dt_obj.toLocaleDateString()).replace(/\//g, ''),
      hour = String(dt_obj.toTimeString({hour12: false})).split(':'),
      datetime = date + '_' + hour[0],
      log_file = `CryptoAlgo_${datetime}.log`, 
      start = `Server started. Log file created: /server/logs/${log_file}. Logging messages.`;

function log (message) {
    fs.writeFileSync(`./logs/${log_file}`, message+'\n', { encoding: 'utf-8', flag: 'a' });
}

function init() {
    log(this.start);
    console.log(this.start);
}

module.exports = {
    log_file,
    start,
    log,
    init
}