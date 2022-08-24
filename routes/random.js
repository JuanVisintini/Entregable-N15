const express = require('express');
const router = express.Router();
const { random } = require('../controllers/random');

router.get('/:cantidad?', random);

module.exports = router;