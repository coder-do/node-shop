const bcrypt = require('bcryptjs');
const User = require('../models/user');

const getAuth = (req, res, next) => {
    res.render('auth/login', {
        path: '/login', active: true,
        title: 'Login Page', isAuth: req.session.isAuth
    })
};

const postAuth = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) { return res.redirect('/login') }
            bcrypt.compare(password, user.password)
                .then(match => {
                    if (match) {
                        req.session.isAuth = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/');
                        })
                    }
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
    res.render('auth/signup', {
        path: '/signup', title: 'Signup',
        isAuth: req.session.isAuth
    })
};

const postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(doc => {
            if (doc) { return res.redirect('/signup') }
            return bcrypt.hash(password, 12)
                .then(pass => {
                    const user = new User({
                        email: email,
                        password: pass,
                        card: { items: [] }
                    });
                    return user.save();
                })
                .then(() => { return res.redirect('/login') });
        })

};

module.exports = { getAuth, postAuth, postLogout, getSignup, postSignup };