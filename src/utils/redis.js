const { promisify } = require('util');
const redis = require('redis');
const debug = require('debug');

const DEBUG = debug('dev');

const client = redis.createClient(process.env.REDIS_URL);

client.on('connect', () => {
  DEBUG('connected to redis server');
});

const getAsync = promisify(client.get).bind(client);

exports.getAsync = getAsync;
exports.client = client;
