const express = require('express');
const { productPage, product, getProducts, 
    editProductPage, postEditProductPage, postDeleteProduct } = require('../controllers/admin');

const adminRouter = express.Router();


adminRouter.get('/product-page' , productPage);

adminRouter.get('/products', getProducts);

adminRouter.post('/product' , product);

adminRouter.get('/edit-product/:id', editProductPage);

adminRouter.post('/edit-product', postEditProductPage);

adminRouter.post('/delete-product', postDeleteProduct);

module.exports = { adminRouter };