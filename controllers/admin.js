const Product = require('../models/product');

const product = (req, res, next) => {
    const { title, image, description, price } = req.body;
    console.log(title, image, description, price);
    const products = new Product(title, image, description, price);
    products.save();
    res.redirect('/');
}

const productPage = (req, res, next) => {
    res.render('admin/product-page', { title: 'Add product', path: '/admin/product-page', active: true })
}

const getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', { title: 'Admin Products', prod: products, 
            path: '/admin/products'
        });
    });
}

module.exports = { product, productPage, getProducts };