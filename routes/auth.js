const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

router.post('/createuser', authController.validate('createUser') ,authController.createUser)

module.exports = router;