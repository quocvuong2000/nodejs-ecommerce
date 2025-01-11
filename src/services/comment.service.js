const { findProduct } = require('../models/repositories/product.repo');

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment logic (not detailed in the snippet)
      // Reply comment
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError('parent comment not found');

      rightValue = parentComment.comment_right;

      // Update many comments
      await Comment.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await Comment.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await Comment.findOne(
        { comment_productId: productId },
        'comment_right',
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // Insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parent = await Comment.findById(parentCommentId);
      if (!parent) throw new NotFoundError('Not found comment for product');

      const comments = await Comment.find({
        comment_productId: productId,
        comment_left: { $gt: parent.comment_left },
        comment_right: { $lte: parent.comment_right },
      })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 });

      return comments;
    }

    const comments = await Comment.find({
      comment_productId: productId,
      comment_parentId: comment_parentId,
    })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 });
    return comments;
  }

  static async deleteComment({ commentId, productId }) {
    // Check product
    const foundProduct = await findProduct({ id: productId });
    if (!foundProduct) throw new NotFoundError('Product does not exist');
    // check comment
    const foundComment = await Comment.findById(commentId);
    if (!foundComment) throw new NotFoundError('Comment does not exist');
    // check comment width and remove with condition gte left and lte right
    const leftValue = foundComment.comment_left;
    const rightValue = foundComment.comment_right;

    const width = rightValue - leftValue + 1;

    await Comment.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    await Comment.updateMany(
      {
        comment_productId: productId,
        comment_left: { $lt: leftValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    await Comment.updateMany(
      {
        comment_productId: productId,
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );
  }
}

module.exports = CommentService;
