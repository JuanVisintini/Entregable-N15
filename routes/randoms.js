const express = require('express');
const router = express.Router();
const { random } = require('../controllers/randoms');

router.get('/:cantidad?', random);

module.exports = router;