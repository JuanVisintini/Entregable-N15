const express = require('express');
const router = express.Router();
const { randoms } = require('../controllers/random');

router.get('/:cantidad?', randoms);

module.exports = router;