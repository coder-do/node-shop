const bcrypt = require('bcryptjs');
const User = require('../models/user');

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')

const getAuth = (req, res, next) => {
    let msg = req.flash('error');
    msg = msg.length > 0 ? msg[0] : null;
    res.render('auth/login', {
        path: '/login', active: true,
        title: 'Login Page',
        error: msg
    })
};

const postAuth = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) { req.flash('error', 'User does`not exist. Try again'); return res.redirect('/login') }
            bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        req.session.isAuth = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/');
                        })
                    }
                    req.flash('error', 'Invalid email or password. Try again');
                    res.redirect('/login')
                })
        })
        .catch(err => res.redirect('/login'))
};

const postLogout = (req, res, next) => {
    return req.session.destroy(() => {
        return res.redirect('/')
    });
};

const getSignup = (req, res, next) => {
    let msg = req.flash('error');
    msg = msg.length > 0 ? msg[0] : null;
    res.render('auth/signup', {
        path: '/signup', title: 'Signup',
        error: msg
    })
};

const postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(doc => {
            if (doc) { req.flash('error', 'User exists. Try another data'); return res.redirect('/signup') }
            return bcrypt.hash(password, 12)
                .then(pass => {
                    const user = new User({
                        email: email,
                        password: pass,
                        card: { items: [] }
                    });
                    return user.save();
                })
                .then(() => {
                    return sgMail.send({
                        to: email,
                        from: 'meruzh.kiloyan.00@gmail.com',
                        subject: 'Signup succeed',
                        text: 'Congrats! You have signed up succesfully',
                        html: '<h1>Congrats! You have signed up succesfully</h1>',
                    }).then(() => { res.redirect('/login'); console.log('ddd') })
                        .catch(err => console.log(err.response.body.errors))
                })
        })

};

module.exports = { getAuth, postAuth, postLogout, getSignup, postSignup };