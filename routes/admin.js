const express = require('express');

const { productPage, product, getProducts,
    editProductPage, postEditProductPage, postDeleteProduct,
    getAdmin } = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const adminRouter = express.Router();


adminRouter.get('/product-page', isAdmin, productPage);

adminRouter.get('/products', isAdmin, getProducts);

adminRouter.post('/product', isAdmin, product);

adminRouter.get('/edit-product/:id', isAdmin, editProductPage);

adminRouter.post('/edit-product', isAdmin, postEditProductPage);

adminRouter.post('/delete-product', isAdmin, postDeleteProduct);

adminRouter.get('/', getAdmin);

module.exports = { adminRouter };