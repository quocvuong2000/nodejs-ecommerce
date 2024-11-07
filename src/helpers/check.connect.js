'use strict';
const _SECONDS = 5000;
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const countConnect = () => {
  const connections = mongoose.connections.length;
  // console.log(`Number of connections: ${connections}`);
  return connections;
};

// Check overload connect
const checkOverload = () => {
  setInterval(() => {
    const countConnect = countConnect();
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    console.log(`Number of connections: ${countConnect}`);
    console.log(`Number of cores: ${numCores}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (countConnect > numCores) {
      console.log('connection overload');
    }
  }, [_SECONDS]);
};

module.exports = {
  countConnect,
  checkOverload,
};
