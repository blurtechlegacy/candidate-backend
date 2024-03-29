const express = require('express');
const passport = require('passport');
const authenticateMiddleware = require('../../middlewares/authenticateMiddleware');
const router = express.Router();
const cntr = require('./controllers');

//POST /swipe body = {id, vote}
router.post('/', authenticateMiddleware, cntr.swipe);

router.get('/all', authenticateMiddleware, cntr.getForSwipes);

module.exports = router;
