'use strict';

const apiKeyModel = require('../models/apiKey.model');
const crypto = require('crypto');
const findById = async (key) => {
  // const newKey = await apiKeyModel.create({
  //   key: crypto.randomBytes(64).toString('hex'),
  //   permissions: ['0000'],
  //   status: true,
  // });
  // console.log('newKey', newKey)
  const objKey = await apiKeyModel
    .findOne({
      key,
      status: true,
    })
    .lean();
  return objKey;
};

const createPermissionApiKey = async (permissions) => {
  return await apiKeyModel.create({
    key: crypto.randomBytes(64).toString('hex'),
    permissions: permissions ?? ['0000'],
    status: true,
  });
};

module.exports = {
  findById,
  createPermissionApiKey
};
