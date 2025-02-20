'use strict';

const keytokenModel = require('../models/keytoken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // level 0
      // const publicKeyString = publicKey.toString();
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshToken,
        refreshTokenUsed: [],
      };
      /* options: Specifies options for the MongoDB findOneAndUpdate method. upsert is set to true, allowing the operation to create a new record if one does not already exist for the given filter. new is set to true to return the modified document rather than the original. */
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: userId });
  };

  static removeKeyById = async (keyId) => {
    return await keytokenModel.deleteOne({ _id:  keyId });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokenUsed: refreshToken }).lean();
  };

  static deleteByUserId = async (userId) => {
    return await keytokenModel.deleteOne({ user: userId });
  };

  static updateRefreshToken = async (userId, refreshToken) => {
    return await keytokenModel.updateOne(
      { user: userId },
      { $push: { refreshTokenUsed: refreshToken } }
    );
  };
}

module.exports = KeyTokenService;
