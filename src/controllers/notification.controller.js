const { SuccessResponse } = require('../core/success.response');
const NotificationService = require('../services/notification.service');

class NotificationController {
  static async listNotiByUser(req, res) {
    new SuccessResponse({
      message: 'Create new comment success',
      metadata: await NotificationService.listNotiByUser(req.query),
    }).send(res);
  }

}

module.exports = NotificationController;
