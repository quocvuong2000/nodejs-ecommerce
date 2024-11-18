'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPairAndVerify } = require('../auth/authUtils');
const { getInfoDatas, generateKeyPair } = require('../utils/helper');

const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  /*
    1- Check email in dbs
    2- Match password
    3- Create AT and RT And SAVE
    4- Generate Tokens
    5- Get data return login
  */
  static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError('Error: shop not found');

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError('');
    const { publicKey, privateKey } = generateKeyPair();

    //GENERATE AT AND RT
    const tokens = await createTokenPairAndVerify(
      { userId: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );

    //SAVED
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoDatas({
        fields: ['name', 'email', '_id'],
        data: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email });
    if (holderShop) {
      throw new BadRequestError('Error: shop already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      const { publicKey, privateKey } = generateKeyPair();
      console.log(publicKey,privateKey);
      // create token pair
      const tokens = await createTokenPairAndVerify(
        { userId: newShop._id, email: newShop.email },
        publicKey,
        privateKey
      );

      //SAVED
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      return {
        code: 201,
        shop: getInfoDatas({
          fields: ['name', 'email', '_id'],
          data: newShop,
        }),
        tokens,
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
