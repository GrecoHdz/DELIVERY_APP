const express = require('express');
const { getLocales } = require('../controllers/localesController');

const router = express.Router();

router.get('/', getLocales);

module.exports = router;
