const express = require('express');
const path = require('path');
const parser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const csurf = require('csurf');

require('dotenv').config();

const mongoose = require('mongoose');

const { adminRouter } = require('./routes/admin');
const { router } = require('./routes/shop');
const { errorRouter } = require('./routes/error-page')
const { authRouter } = require('./routes/auth');

const User = require('./models/user');

const app = express();

const csrf = csurf();

const store = new MongoStore({
    uri: process.env.DB_HOST,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views')

app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }))

app.use(parser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')))

app.use(csrf);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});

app.use((req, res, next) => {
    res.locals.isAuth = req.session.isAuth;
    res.locals.token = req.csrfToken();
    next();
});

app.use('/admin', adminRouter);
app.use(router);
app.use(authRouter);
app.use(errorRouter);

mongoose.connect(process.env.DB_HOST)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err))