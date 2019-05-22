/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();

// Require controllers
const crypto_controller = require('../controllers/crypto.controller');

// test url
router.get('/test', crypto_controller.test);

module.exports = router;
