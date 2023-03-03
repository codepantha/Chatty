const { register, verify } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/register', register);

router.post('/verify/:token', verify)

module.exports = router;
