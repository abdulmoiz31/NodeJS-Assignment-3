var express = require('express');
var router = express.Router();

var SignupController = require('./signup.controller')
var tokenAuthenticator = require('../tokenAuthentication/token.authenticator')

router.post('/user', SignupController.userSignup)
router.post('/update', tokenAuthenticator.authenticateAdmin, SignupController.updateUser)
router.post('/delete', tokenAuthenticator.authenticateAdmin, SignupController.deleteUser)

module.exports = router;