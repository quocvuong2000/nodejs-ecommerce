const { SuccessResponse } = require('../core/success.response');
const CommentService = require('../services/comment.service');

class CommentController {
  static async createComment(req, res) {
    new SuccessResponse({
      message: 'Create new comment success',
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  }
}

module.exports = CommentController;
