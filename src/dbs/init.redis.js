// 'use strict';

// const redis = require('redis');

// // create a new client redis

// const client = redis.createClient({
//   host: 'localhost',
//   port: 6379,
//   password,
//   username,
// });

// client.on('connect', () => {
//   console.log('Connected to Redis');
// });

// //export
// module.exports = client;

const redis = require('redis');
const { RedisErrorResponse } = require('../core/error.response');

let client = {}, statusConnectRedis = {
  CONNECT : 'connect',
  END : 'end',
  RECONNECT : 'reconnect',
  ERROR : 'error'
}, connectionTimeout = null;

//10s
const REDIS_CONNECT_TIMEOUT = 10*100, REDIS_CONNECT_MESSAGE = {
  code : -99,
  message : 'Redis connect timeout'
};

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse(REDIS_CONNECT_MESSAGE.message);
  }, REDIS_CONNECT_TIMEOUT)
}
const handleEventConnect = ({
  connectionRedis
}) => {
  // check if connection is null
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log('Redis connected');
    clearTimeout(connectionTimeout);
  })

  connectionRedis.on(statusConnectRedis.END, () => {
    console.log('Redis disconnected');
    handleTimeoutError();
  })

  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log('Redis reconnected');
    clearTimeout(connectionTimeout);
  })

  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log('Redis error', err);
    handleTimeoutError();
  })
}

const initRedis = () => {
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;

  handleEventConnect({
    connectionRedis : instanceRedis
  })
}

const getRedis = () => client

const closeRedis = () => {}

module.exports = {
  initRedis,
  getRedis,
  closeRedis
}