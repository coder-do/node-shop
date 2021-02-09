const express = require('express');
const path = require('path');
const parser = require('body-parser');

require('dotenv').config();

const mongoose = require('mongoose');

const { adminRouter } = require('./routes/admin');
const { router } = require('./routes/shop');
const { errorRouter } = require('./routes/error-page')

const User = require('./models/user');

const app = express();

app.use((req, res, next) => {
    User.findById('60222fb47d519f2914329180')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})


app.set('view engine', 'ejs');
app.set('views', 'views')


app.use(parser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')))


app.use('/admin', adminRouter);
app.use(router);
app.use(errorRouter);

mongoose.connect(process.env.DB_HOST)
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'test',
                    email: 'test@gmail.com',
                    card: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err => console.log(err))