class Vm {
  constructor(modem) {
    this.modem = modem;
    this.path = 'vm/v3/host';
  }

  get(id, callback) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.modem.request('GET', '/' + self.path + '/' + id)
        .then(function (vm) {
          return callback ? callback(null, data) : resolve(vm)
        })
        .catch(function (err) {
          return callback ? callback(err.message) : reject(err.message)
        });
    });
  }

  start(id, callback) {
    return this._doAction(id, 'start', callback);
  }

  stop(id, callback) {
    return this._doAction(id, 'stop', callback);
  }

  restart(id, callback) {
    return this._doAction(id, 'restart', callback);
  }

  getIpv4Adresses(id, callback) {
    var self = this;
    return new Promise(function (resolve, reject) {
      var params = {
        'orderbyid': 'id desc'
      };
      self.modem.request('GET', '/' + self.path + '/' + id + '/ipv4', params)
        .then(function (vm) {
          return callback ? callback(null, data) : resolve(vm)
        })
        .catch(function (err) {
          return callback ? callback(err.message) : reject(err.message)
        });
    });
  }

  _doAction(id, action, callback) {
    var self = this;
    return new Promise(function (resolve, reject) {
      self.modem.request('POST', '/' + self.path + '/' + id + '/' + action)
        .then(function (vm) {
          return callback ? callback(null, data) : resolve(vm)
        })
        .catch(function (err) {
          return callback ? callback(err.message) : reject(err.message)
        });
    });
  }
}


module.exports = Vm;