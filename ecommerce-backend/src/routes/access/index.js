"use strict";

const express = require("express");
const router = express.Router();
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

router.post("/shop/signup", asyncHandler(AccessController.signup));
router.post("/shop/login", asyncHandler(AccessController.login));

// AUTHENTICATION MIDDLEWARE
router.use(authenticationV2);

router.post("/shop/logout", asyncHandler(AccessController.logout));
router.post(
  "/shop/refreshToken",
  asyncHandler(AccessController.handleRefreshToken)
);
//////////////

module.exports = router;
