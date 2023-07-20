var express = require('express');
var router = express.Router();

var ProductController = require('./product.controller')
var tokenAuthenticator = require('../tokenAuthentication/token.authenticator')

router.get('/', tokenAuthenticator.authenticateUser, ProductController.getAllProducts)
router.post('/update', tokenAuthenticator.authenticateAdmin, ProductController.updateProduct)
router.post('/delete', tokenAuthenticator.authenticateAdmin, ProductController.deleteProduct)
router.post('/add', tokenAuthenticator.authenticateAdmin, ProductController.addProduct)

module.exports = router;