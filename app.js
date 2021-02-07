const express = require('express');
const path = require('path');
const parser = require('body-parser');
// dotenv
require('dotenv').config();
// db
const { db } = require('./utils/db');
// admin routes
const { adminRouter } = require('./routes/admin');
const { router } = require('./routes/shop');
const { errorRouter } = require('./routes/error-page')
// user
const User = require('./models/user');
// express
const app = express();

// user find
app.use((req, res, next) => {
    User.findById('601ead1d4a1f3399d619533e')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
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