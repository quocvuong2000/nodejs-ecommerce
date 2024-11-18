'use strict';

const { CREATED, SuccessResponse } = require('../core/success.response');
const AccessService = require('../services/access.service');

class AccessController {
  async login(req, res, next) {
    return new SuccessResponse({
      metadata : await AccessService.login(req.body),
    }).send(res);
  }
  async signup(req, res, next) {
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
