const Product = require('../models/product');
const Order = require('../models/order');

const shopPage = (req, res, next) => {
    Product.findAll()
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
    Product.findAll()
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

const getOrders = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Your Orders', prod: orders,
                path: '/orders', active2: true
            });
        })
        .catch(err => console.log(err));
}

const cart = (req, res, next) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        title: 'Your Cart',
                        products: products
                    });
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
}

const postDeleteCartItem = (req, res, next) => {
    const id = req.body.id;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: id } });
        })
        .then(products => {
            const prod = products[0];
            return prod.cartItems.destroy()
        })
        .then(() => {
            res.redirect('/cart');
        })
}

const addProduct = (req, res, next) => {
    const prodId = req.body.id.split(' ').join('');
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItems.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: { quantity: newQuantity }
            });
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

const checkout = (req, res, next) => {
    res.render('shop/cart', { path: '/checkout', title: 'Checkout Page' })
}

const getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findAll({ where: { id: id } })
        .then(products => {
            res.render('shop/product-details', { prod: products[0], title: 'Details', path: '/product/:id' })
        })
        .catch(err => {
            console.log(err);
        });
};

const postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = { quantity: product.cartItems.quantity };
                            return product;
                        })
                    );
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

module.exports = {
    shopPage, getIndex, cart,
    checkout, getOrders, getProduct, addProduct,
    postDeleteCartItem, postOrder
};