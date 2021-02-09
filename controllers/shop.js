const Product = require('../models/product');
const Order = require('../models/order');

const shopPage = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                title: 'All Products', prod: products,
                path: '/products', active2: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}

const getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prod: products,
                title: 'Shop',
                path: '/',
                hasProd: products.length > 0,
                active2: true
            });
        })
        .catch(err => {
            console.log(err);
        });
}


const card = (req, res, next) => {
    req.user
        .populate('card.items.id')
        .execPopulate()
        .then(products => {
            res.render('shop/card', {
                path: '/card',
                title: 'Your Card',
                products: products.card.items
            });
        })
        .catch(err => console.log(err))
}

const postDeleteCardItem = (req, res, next) => {
    const id = req.body.id;
    req.user.deleteCardItem(id)
        .then(() => {
            res.redirect('/card');
        })
}

const addProduct = (req, res, next) => {
    const prodId = req.body.id.split(' ').join('');
    Product.findById(prodId)
        .then(prod => {
            return req.user.addToCard(prod);
        })
        .then(() => {
            res.redirect('/card');
        })
}

const checkout = (req, res, next) => {
    res.render('shop/card', { path: '/checkout', title: 'Checkout Page' })
}

const getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(products => {
            res.render('shop/product-details', { prod: products, title: 'Details', path: '/product/:id' })
        })
        .catch(err => {
            console.log(err);
        });
};

const getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Your Orders', prod: orders,
                path: '/orders', active2: true
            });
        })
        .catch(err => console.log(err));
}

const postOrder = (req, res, next) => {
    req.user
        .populate('card.items.id')
        .execPopulate()
        .then(products => {
            const prod = products.card.items.map(item => {
                return { product: item.id._doc, quantity: item.quantity }
            });
            const order = new Order({
                products: prod,
                user: {
                    name: req.user.name,
                    userId: req.user
                }
            })
            return order.save()
        })
        .then(() => {
            return req.user.clearCard();
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
};

module.exports = {
    shopPage, getIndex, card,
    checkout, getOrders, getProduct, addProduct,
    postDeleteCardItem, postOrder
};