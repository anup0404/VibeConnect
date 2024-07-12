var express = require('express');
var router = express.Router();
const {registerUser,loginUser}=require('../Controllers/user.Controllers')
/* GET users listing. */

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});





//signup user routes
router.post('/register',registerUser)

//login user routes
router.post('/login',loginUser)

module.exports = router;
