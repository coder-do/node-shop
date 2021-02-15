const express = require('express');

const { shopPage, getIndex, checkout,
    card, getOrders, getProduct, addProduct,
    postDeleteCardItem, postOrder, getInvoice } = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', shopPage);

router.get('/product/:id', getProduct);

router.get('/card', isAuth, card);

router.post('/card', isAuth, addProduct);

router.post('/order-page', isAuth, postOrder)

router.post('/delete-card-item', isAuth, postDeleteCardItem);

router.get('/orders', isAuth, getOrders);

router.get('/invoice/:id', isAuth, getInvoice);

router.get('/checkout', isAuth, checkout);


module.exports = { router };