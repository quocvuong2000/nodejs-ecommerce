'use strict';
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoDatas } = require('../utils/helper');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};
class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email });
      if (holderShop) {
        return {
          code: 400,
          message: 'Email already exists',
          status: 'error',
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            //public key cryptoGraphy standard
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });
        //save vao colloection store key
        const publickKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publickKeyString) {
          return {
            code: 500,
            message: 'Public key string error',
          };
        }

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email: newShop.email },
          publickKeyString,
          privateKey
        );

        return {
          code: 201,
          shop  : getInfoDatas({
            fields: ['name', 'email', '_id'],
            data: newShop
          }),
          tokens,
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: 500,
        message: 'Internal server error',
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
