const express = require('express');

const { getAuth, postAuth, postLogout, getSignup, postSignup } = require('../controllers/auth');

const { check, body } = require('express-validator/check');

const authRouter = express.Router();

authRouter.get('/login', getAuth);

authRouter.post('/login', postAuth);

authRouter.get('/signup', getSignup);

authRouter.post('/signup', check('email').isEmail().withMessage('Enter a valid email'),
    body('password', 'Password should be at least 6 charachters(text and number only)').isLength({ min: 6 })
        .isAlphanumeric(),
    postSignup);

authRouter.post('/logout', postLogout);

module.exports = { authRouter };