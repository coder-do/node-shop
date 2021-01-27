const express = require('express');
const { productPage, product, getProducts } = require('../controllers/admin');

const adminRouter = express.Router();


adminRouter.get('/product-page' , productPage)

adminRouter.get('/products', getProducts)

adminRouter.post('/product' , product)

module.exports = { adminRouter };