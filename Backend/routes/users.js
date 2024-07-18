const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser, deleteUser } = require('../Controllers/user.Controllers'); 
const {verifyJwtAuth } = require('../middleware/authjwt.middleware');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Signup user route
router.post('/register', registerUser);

// Login user route
router.post('/login', loginUser);

// Update user details route
router.patch('/updateMe/:id',verifyJwtAuth, updateUser); 

// delete user 

router.delete('/delete/:id',verifyJwtAuth,deleteUser)

module.exports = router;
