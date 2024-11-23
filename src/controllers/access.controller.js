'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  async handleRefreshToken(req, res) {
    return new SuccessResponse({
      metadata : await AccessService.handleRefreshToken(req.body.refreshToken),
      message : "New token provided"
    }).send(res);
  }
  async logout(req, res) {
    return new SuccessResponse({
      metadata : await AccessService.logout(req.keyStore),
    }).send(res);
  }
  async login(req, res) {
    return new SuccessResponse({
      metadata : await AccessService.login(req.body),
    }).send(res);
  }
  async signup(req, res) {
    /*
      200 OK
      201 Created
    */
    // return res.status(201).json(await AccessService.signup(req.body));
    new CREATED({
      message: 'Success',
      metadata: await AccessService.signup(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }
}

module.exports = new AccessController();
