'use strict';

const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const { asyncHanlder } = require('../../auth/checkAuth');

router.post('/shop/signup', asyncHanlder(AccessController.signup));
router.post('/shop/login', asyncHanlder(AccessController.login));

module.exports = router;
