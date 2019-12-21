const fs = require('fs');
var dt_obj = new Date(Date.now());
const date = String(dt_obj.toLocaleDateString()).replace(/\//g, ''),
      hour = String(dt_obj.toTimeString({hour12: false})).split(':'),
      time = hour[0] + hour[1],
      datetime = date + '_' + time,
      log_file = `CryptoAlgo_${datetime}.log`, 
      start = `Server started. Log file created: /server/logs/${log_file}. Logging messages.`;

function log (message) {
    fs.writeFileSync(`./server/logs/${log_file}`, message+'\n', { encoding: 'utf-8', flag: 'a' });
}

function init() {
    log(this.start);
    console.log(this.start);
}

module.exports.log_file = log_file;
module.exports.start = start;
module.exports.log = log;
module.exports.init = init;