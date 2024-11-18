'use strict';

const JWT = require('jsonwebtoken');
const createTokenPairAndVerify = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '1d',
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7d',
    });

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (decode) {
        console.log('verify success', decode);
      } else {
        console.error('error verify', error);
      }
    });


    return { accessToken, refreshToken };
  } catch (error) {
    console.log('Error when create token', error);
  }
};

module.exports = { createTokenPairAndVerify };
