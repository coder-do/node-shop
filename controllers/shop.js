const Product = require('../models/product');
const Cart = require('../models/cart');

const shopPage = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            title: 'All Products', prod: products,
            path: '/products', active2: true
        });
    });
}

const getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            title: 'Shop', prod: products,
            path: '/', hasProd: products.length > 0,
            active2: true
        });
    });
}

const getOrders = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/orders', {
            title: 'Your Orders', prod: products,
            path: '/orders', active2: true
        });
    });
}

const cart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                const cartProductData = cart.products.find(
                    prod => prod.id === product.id
                );
                if (cartProductData) {
                    cartProducts.push({ productData: product, qtty: cartProductData.qtty });
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                title: 'Your Cart',
                products: cartProducts
            });
        });
    });
}

const postDeleteCartItem = (req, res, next) => {
    const id = req.body.id;
    Product.findById(id, product => {
        Cart.deleteProduct(id, product.price);
        res.redirect('/cart');
    })
}

const addProduct = (req, res, next) => {
    const id = req.body.id.split(' ').join('');
    Product.findById(id, products => {
        Cart.addProd(id, products.price);
    });
    res.redirect('/cart');
}

const checkout = (req, res, next) => {
    res.render('shop/cart', { path: '/checkout', title: 'Checkout Page' })
}

const getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id, pr => res.render('shop/product-details', { prod: pr, title: 'Details', path: '/product/:id' }));
}

module.exports = {
    shopPage, getIndex, cart,
    checkout, getOrders, getProduct, addProduct,
    postDeleteCartItem
};