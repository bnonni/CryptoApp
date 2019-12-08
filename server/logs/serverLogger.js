const fs = require('fs'),
      log_file = `CryptoAlgo_${Date.now()}.log`, 
      start = `Server started. Log file created: /server/logs/${log_file}. Logging messages.`;

function log (message) {
    fs.writeFileSync(`./server/logs/${log_file}`, message+'\n', { encoding: 'utf-8', flag: 'a' });
}

function init() {
    log(this.log_file, this.start);
    console.log(this.start);
}

module.exports.log_file = log_file;
module.exports.start = start;
module.exports.log = log;
module.exports.init = init;