var express = require('express');
var router = express.Router();

var CartController = require('./cart.controller')
var tokenAuthenticator = require('../tokenAuthentication/token.authenticator')

router.post('/create', tokenAuthenticator.authenticateUser, CartController.createCart)
router.post('/update', tokenAuthenticator.authenticateUser, CartController.updateCart)
router.post('/delete', tokenAuthenticator.authenticateUser, CartController.deleteCart)
router.post('/checkout', tokenAuthenticator.authenticateAdmin, CartController.checkout)

module.exports = router;