const express = require('express');

const { getAuth, postAuth, postLogout, getSignup, postSignup } = require('../controllers/auth');

const authRouter = express.Router();

authRouter.get('/login', getAuth);

authRouter.post('/login', postAuth);

authRouter.get('/signup', getSignup);

authRouter.post('/signup', postSignup);

authRouter.post('/logout', postLogout);

module.exports = { authRouter };