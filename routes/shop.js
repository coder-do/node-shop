const express = require('express');
const { shopPage, getIndex, checkout,
    card, getOrders, getProduct, addProduct,
    postDeleteCardItem, postOrder } = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', shopPage);

router.get('/product/:id', getProduct);

router.get('/card', card);

router.post('/card', addProduct);

router.post('/order-page', postOrder)

router.post('/delete-card-item', postDeleteCardItem);

router.get('/orders', getOrders);

router.get('/checkout', checkout);

module.exports = { router };