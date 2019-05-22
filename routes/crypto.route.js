/*jshint esversion: 6 */

const express = require('express');
const router = express.Router();

// Require controllers
const crypto_controller = require('../controllers/crypto.controller');

// create url
router.post('/create', crypto_controller.transaction_create);

module.exports = router;
