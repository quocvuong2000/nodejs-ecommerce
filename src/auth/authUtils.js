'use strict';
const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
};
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

//service
const KeyTokenService = require('../services/keyToken.service');

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

const authentication = asyncHandler(async (req, res, next) => {
  /*
    1 - check userId missing ?
    2 - get accesstoken
    3 - verify token
    4 - check user in dbs?
    5 - check keyStore with this userId
    6 - ok all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) throw new AuthFailureError('Invalid request');

  //2
  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError('keyStore not found');

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) throw new NotFoundError('Access token not found');

  //4,5,6
  try {
    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    // LOGIN USING USERID , LOGOUT USING USERID TOO INSIDE ACCESSTOKEN
    if (userId !== decodeUser.userId)
      throw new AuthFailureError('Invalid user');
    req.keyStore = keyStore;
    next();
  } catch (error) {
    throw error;
  }
});

module.exports = { createTokenPairAndVerify, authentication };
