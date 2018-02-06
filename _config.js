var config = {};

config.mongoURI = {
  production: 'mongodb://localhost/mean-chat',
  development: 'mongodb://localhost/node-testing',
  test: 'mongodb://localhost/node-test'
};

module.exports = config;