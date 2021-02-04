const express = require('express');
const path = require('path');
const parser = require('body-parser');
// db
const sql = require('./utils/db');
// express
const app = express();
// admin routes
const { adminRouter } = require('./routes/admin');
const { router } = require('./routes/shop');
const { errorRouter } = require('./routes/error-page')
// models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// models config
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// user find
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => { req.user = user; next() })
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

sql.sync()
    // .sync({ force: true })
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'User', email: 'user@gmail.com' })
        }
        return user;
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => console.log(err))