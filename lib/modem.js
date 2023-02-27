var axios = require('axios');

class Modem {
  constructor(hostname, username, password, timeout) {
    this.hostname = hostname;
    this.username = username;
    this.password = password;
    this.axiosInstance = axios.create({
      baseURL: hostname,
      timeout: timeout
    });
    this.setDefaultHeaders({
      'Content-Type': 'application/json'
    });
    this.loadInterceptors();
  }

  getInstance() {
    return this.axiosInstance;
  }

  getDefaultHeaders() {
    return this.axiosInstance.defaults.headers;
  }

  setDefaultHeaders(headers) {
    this.axiosInstance.defaults.headers = headers;
  }

  setHeaders(newHeaders) {
    Object.assign(this.axiosInstance.defaults.headers, newHeaders);
  }

  loadInterceptors() {
    var self = this;
    var isGetActiveSessionRequest = false;
    var requestQueue = [];

    var resolveRequestsFromQueue = function () {
      requestQueue.map(function (request) {
        request.resolve();
      });
    };

    var rejectRequestFromQueue = function (error) {
      requestQueue.map(function (request) {
        request.reject(error);
      });
    };

    var addRequestToQueue = function (request) {
      requestQueue.push(request);
    };

    var clearQueue = function () {
      requestQueue = [];
    };

    this.axiosInstance.interceptors.response.use(null, function (error) {
      const {
        response = {}, config: sourceConfig
      } = error;

      if (response.status === 401) {
        if (!isGetActiveSessionRequest) {
          isGetActiveSessionRequest = true;
          self.createSession().then(function (sessionHeaders) {
            isGetActiveSessionRequest = false;
            self.setHeaders(sessionHeaders);
            resolveRequestsFromQueue();
            clearQueue();
          }).catch(function (err) {
            console.error('Error occurred creating session: %s', err.message);
            isGetActiveSessionRequest = false;
            rejectRequestFromQueue(err);
            clearQueue();
          });
        }

        var retryRequest = new Promise((resolve, reject) => {
          addRequestToQueue({
            resolve: function () {
              sourceConfig.headers = self.getDefaultHeaders();
              resolve(axios(sourceConfig));
            },
            reject: function (error) {
              reject(error);
            }
          });
        });

        return retryRequest;
      } else {
        // if error is not related with Unauthorized we reject promise
        return Promise.reject(error);
      }
    });
  }

  createSession() {
    var self = this;
    return new Promise((resolve, reject) => {
      self.request('POST', '/auth/v3/auth', undefined, {
        'email': self.username,
        'password': self.password
      }).then(function (data) {
        var sessionHeaders = {
          'Cookie': 'ses6=' + data.session,
          'X-XSRF-TOKEN': data.session
        };
        resolve(sessionHeaders);
      }).catch(function (error) {
        reject(error);
      });
    });
  }

  request(method, path, params, options, headers) {
    headers = Object.assign({}, this.getDefaultHeaders, headers); //add custom headers to default headers

    var config = {
      method: method,
      url: path,
      params: JSON.stringify(params),
      headers: headers
    };

    if (['POST', 'PUT', 'DELETE', 'PATCH'].indexOf(method) > -1) {
      config.data = options;
    }

    return new Promise((resolve, reject) => {
      this.axiosInstance(config)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
}

module.exports = Modem;