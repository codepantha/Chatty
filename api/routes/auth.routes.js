const { register, login, verify, profile, logout } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/register', register);

router.post('/login', login);

router.get('/verify/:token', verify)

router.delete('/logout', logout);


module.exports = router;
