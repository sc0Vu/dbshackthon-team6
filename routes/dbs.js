var express = require('express');
var router = express.Router();

router.get('/message', require('../controllers/getMessage'));

router.post('/message', require('../controllers/postMessage'));

module.exports = router;
