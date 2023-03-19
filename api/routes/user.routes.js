const { profile } = require('../controllers/user.controller');

const router = require('express').Router();

router.get('/profile', profile)

module.exports = router;
