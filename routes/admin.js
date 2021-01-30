const express = require('express');
const { productPage, product, getProducts, editProductPage } = require('../controllers/admin');

const adminRouter = express.Router();


adminRouter.get('/product-page' , productPage);

adminRouter.get('/products', getProducts);

adminRouter.post('/product' , product);

adminRouter.get('/edit-product/:id', editProductPage);

adminRouter.post('/edit-product');

module.exports = { adminRouter };