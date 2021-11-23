var express = require('express');
var createError = require('http-errors');
var router = express.Router();

// router.use('/user', require('./user'))
// router.use('/page', require('./page'))
// router.use('/site', require('./site'))
router.use('/board', require('./board'))

module.exports = router;