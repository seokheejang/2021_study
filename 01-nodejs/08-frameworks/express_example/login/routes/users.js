var express = require('express');
var router = express.Router();
const { registerUser, loginUser, logoutUser, authChecker } = require("../controllers/AuthController");
const { registerLimiter, loginLimiter } = require("../utils/rateLimiter");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/authchecker", authChecker );

router.post("/register", registerLimiter, registerUser );

router.post("/login", loginLimiter, loginUser );

router.delete("/logout", logoutUser );

module.exports = router;