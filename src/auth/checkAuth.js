'use strict';
const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
const { findById } = require('../services/apiKey.service');
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    req.objKey = objKey;
    next();
  } catch (error) {
    return res.status(500).json(error);
  }
};

const permission = (permission) => {
  return (req = {}, res = {}, next) => {
    if (!req?.objKey?.permissions) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    if (!req.objKey.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }
    next();
  };
};
module.exports = {
  apiKey,
  permission,
};
