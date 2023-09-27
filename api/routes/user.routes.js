const { index, profile } = require('../controllers/user.controller');

const router = require('express').Router();

router.get('/', index);
router.get('/profile', profile);

module.exports = router;
