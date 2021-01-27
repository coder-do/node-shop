const express = require('express');

const errorRouter = express.Router();

errorRouter.use((req, res, next) => {
    res.render('404/404', { title: 'Page not found', path: '' })
})

module.exports = { errorRouter };