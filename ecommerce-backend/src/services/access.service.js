"use strict";
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPairAndVerify, verifyJWT } = require("../auth/authUtils");
const { getInfoDatas, generateKeyPair } = require("../utils/helper");

const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
  NotFoundError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { createPermissionApiKey } = require("./apiKey.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore);
  };
  /*
    1- Check email in dbs
    2- Match password
    3- Create AT and RT And SAVE
    4- Generate Tokens
    5- Get data return login
  */
  static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Error: shop not found");

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("");
    const { publicKey, privateKey } = generateKeyPair();

    // GENERATE AT AND RT
    // LOGIN USING USERID , LOGOUT USING USERID TOO
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
        fields: ["name", "email", "_id"],
        data: foundShop,
      }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email });
    if (holderShop) {
      throw new BadRequestError("Error: shop already exists");
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
      console.log(publicKey, privateKey);
      // CREATE TOKEN PAIR
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
          fields: ["name", "email", "_id"],
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

  static generateApiPermissionKey = async () => {
    console.log("generateApiPermissionKey");
    const key = await createPermissionApiKey(["0000"]);
    return key;
  };

  /*
    1. Check this token used?
  */
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    console.log("foundToken", foundToken);
    if (foundToken) {
      // Decode to identify and force logout because this is already used
      const { userId } = verifyJWT(refreshToken, foundToken.privateKey);
      // Find and remove
      await KeyTokenService.deleteByUserId(userId);
      throw new ForbiddenError("Refresh token has been used");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) throw new NotFoundError("Token not found");
    const { email, userId } = verifyJWT(refreshToken, holderToken.privateKey);
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new NotFoundError("Shop not found");

    const tokens = await createTokenPairAndVerify(
      { userId: foundShop._id, email: foundShop.email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //SAVED
    foundShop.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens,
    };
  };

  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId);
      throw new ForbiddenError("Refresh token has been used");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered");
    }
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new NotFoundError("Shop not found");

    const tokens = await createTokenPairAndVerify(
      { userId: foundShop._id, email: foundShop.email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //SAVED
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
