const express = require('express');

const { productPage, product, getProducts,
    editProductPage, postEditProductPage, postDeleteProduct } = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const adminRouter = express.Router();


adminRouter.get('/product-page', isAuth, productPage);

adminRouter.get('/products', isAuth, getProducts);

adminRouter.post('/product', isAuth, product);

adminRouter.get('/edit-product/:id', isAuth, editProductPage);

adminRouter.post('/edit-product', isAuth, postEditProductPage);

adminRouter.post('/delete-product', isAuth, postDeleteProduct);

module.exports = { adminRouter };