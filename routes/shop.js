const express = require('express');
const { shopPage, getIndex, checkout, 
    cart, getOrders, getProduct, addProduct } = require('../controllers/shop');

const router = express.Router();

router.get('/' , getIndex);

router.get('/products', shopPage);

router.get('/product/:id', getProduct);

router.get('/cart', cart);

router.post('/cart', addProduct);

router.get('/orders', getOrders);

router.get('/checkout', checkout);

module.exports = { router };