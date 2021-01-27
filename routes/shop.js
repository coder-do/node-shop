const express = require('express');
const { shopPage, getIndex, checkout, cart, getOrders } = require('../controllers/shop');

const router = express.Router();

router.get('/' , getIndex);

router.get('/products', shopPage);

router.get('/cart', cart);

router.get('/orders', getOrders);

router.get('/checkout', checkout);

module.exports = { router };