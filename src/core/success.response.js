'use strict';

class SuccessResponse {
  constructor(message = 'Success', statusCode = 200) {
    this.message = message;
    this.statusCode = statusCode;
  }
}