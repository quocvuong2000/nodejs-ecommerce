'use strict';

const AccessService = require("../services/access.service");

class AccessController {
  async signup  (req, res, next) {
    /*
      200 OK
      201 Created
    */
      return res.status(201).json(await AccessService.signup(req.body));
  }
}

module.exports = new AccessController();
