const Product = require('../models/product');

const shopPage = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', { title: 'All Products', prod: products, 
            path: '/products', active2: true 
        });
    });
}

const getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', { title: 'Shop', prod: products, 
        path: '/', hasProd: products.length > 0, 
        active2: true });
    });
}

const getOrders = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/orders', { title: 'Your Orders', prod: products, 
        path: '/orders', active2: true });
    });
}

const cart = (req, res, next) => {
    res.render('shop/cart', { path: '/cart', title: 'Your Cart' })
}

const checkout = (req, res, next) => {
    res.render('shop/cart', { path: '/checkout', title: 'Checkout Page' })
}

module.exports = { shopPage, getIndex, cart, checkout, getOrders };