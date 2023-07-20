var express = require('express');
var router = express.Router();

var CategoryController = require('./category.controller')
var tokenAuthenticator = require('../tokenAuthentication/token.authenticator')

router.get('/',tokenAuthenticator.authenticateUser ,CategoryController.getAllCategories)
router.post('/update', tokenAuthenticator.authenticateAdmin, CategoryController.updateCategory)
router.post('/delete', tokenAuthenticator.authenticateAdmin, CategoryController.deleteCategory)
router.post('/add', tokenAuthenticator.authenticateAdmin, CategoryController.addCategory)
router.post('/find', tokenAuthenticator.authenticateUser, CategoryController.findCategory)

module.exports = router;