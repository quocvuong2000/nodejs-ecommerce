'use strict';
const { StatusCodes, ReasonPhrases } = require('../utils/httpStatusCode');
class SuccessResponse {
  constructor({
    message = 'Success',
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message = ReasonPhrases.OK, metadata = {} }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message = ReasonPhrases.CREATED,
    metadata = {},
    options = {},
  }) {
    super({ message, statusCode: StatusCodes.CREATED, metadata });
    this.options = options;
  }
}

module.exports = { SuccessResponse, OK, CREATED };
