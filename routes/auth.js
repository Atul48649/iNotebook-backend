const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/createuser', authController.validate('createUser') ,authController.createUser)
router.post('/login', authController.validate('login'), authController.login)
router.post('/getuser', authController.getUser);

module.exports = router;