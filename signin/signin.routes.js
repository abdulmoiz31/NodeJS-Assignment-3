var express = require('express');
var router = express.Router();

var SigninController = require('../signin/signin.controller')
var tokenAuthenticator = require('../tokenAuthentication/token.authenticator')

router.post('/', SigninController.signin)

module.exports = router;