var express = require('express');
var router = express.Router();

/* GET login listing. */
router.get('/', function(req, res, next) {
    res.send(`respond with a login`);
});

/** 
 * @notice URL parameter value
 * @input /url/jang
 */ 
router.get('/url/:userId', function(req, res, next) {
    let userId = req.params.userId;
    let passwd = req.params.passwd;
    res.send(`ID/PASS: [${userId}]/[${passwd}]`);
});

/** 
 * @notice query parameter value 
 * @input /query?userId=jang
 */ 
router.get('/query', function(req, res, next) {
    let userId = req.query.userId;
    let passwd = req.query.passwd;
    res.send(`ID/PASS: [${userId}]/[${passwd}]`);
});

module.exports = router;
