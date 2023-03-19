const { register, login, verify } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/register', register);

router.post('/login', login);

router.get('/verify/:token', verify)

module.exports = router;
