const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/note', require('./notes'));

module.exports = router;