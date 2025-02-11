const express = require('express');
const matches = require('./matches'); // Import shared matches array

const router = express.Router();

router.get('/matches', (req, res) => {
    res.status(201).json({matches});
});

module.exports = router;