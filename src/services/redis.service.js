'use strict';

const redis = require('redis');
const { promisify } = require('util');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `Lock_v2024_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds tam lock

    for (let i = 0; i < retryTimes.length; i++) {
        // tat mo key, thang nao nam giu duoc vao thanh toan
        const result = await setnxAsync(key, expireTime);
        console.log('result::', result);
        if (result === 1) {
            // thao tac voi inventory
            return key;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(keyLock);
}

module.exports = {
    acquireLock,
    releaseLock
};