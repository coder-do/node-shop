const express = require('express');
const path = require('path');
const parser = require('body-parser');
// dotenv
require('dotenv').config();
// db
const { db } = require('./utils/db');
// express
const app = express();
// admin routes
const { adminRouter } = require('./routes/admin');
const { router } = require('./routes/shop');
const { errorRouter } = require('./routes/error-page')

// user find
app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => { req.user = user; next() })
    //     .catch(err => console.log(err))
    next();
})

// view engines
app.set('view engine', 'ejs');
app.set('views', 'views')

// body parser
app.use(parser.urlencoded({ extended: false }));
// path to styles
app.use(express.static(path.join(__dirname, 'public')))

// routes config
app.use('/admin', adminRouter);
app.use(router);
app.use(errorRouter);

db(() => {
    app.listen(3000);
})