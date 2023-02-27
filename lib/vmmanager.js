const Modem = require("./modem");
const Vm = require("./vm");

class VmManager {
  constructor(opts) {
    this.modem = new Modem(opts.hostname, opts.username, opts.password, opts.timeout);
    this.vm = new Vm(this.modem);
  }

  getVms(callback) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.modem.request('GET', '/vm/v3/host')
        .then(function (vm) {
          return callback ? callback(null, data) : resolve(vm)
        })
        .catch(function (err) {
          return callback ? callback(err.message) : reject(err.message)
        });
    });
  }
}

module.exports = VmManager;