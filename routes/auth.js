const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.body);
    return res.send("Hello");
})

module.exports = router;