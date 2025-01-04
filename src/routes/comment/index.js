'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const CommentController = require('../../controllers/comment.controller');

// AUTHENTICATION MIDDLEWARE
router.use(authenticationV2);
///////////////////
router.post('', asyncHandler(CommentController.createComment));

module.exports = router;
