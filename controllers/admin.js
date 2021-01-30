const Product = require('../models/product');

const product = (req, res, next) => {
    const { title, image, description, price } = req.body;
    console.log(title, image, description, price);
    const products = new Product(title, image, description, price);
    products.save();
    res.redirect('/');
}

const productPage = (req, res, next) => {
    res.render('admin/edit-product', { title: 'Add product', path: '/admin/product-page', 
    active: true, editing: false })
}

const getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', { title: 'Edit Product', prod: products, 
            path: '/admin/products'
        });
    });
}

const postEditProductPage = (req, res, next) => {};

const editProductPage = (req, res, next) => {
    const param = req.query.edit;
    if(!param) { return res.redirect('/') };

    const prodId = req.params.id;
    Product.findById(prodId, product => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/edit-product',
            editing: param,
            product: product
        });
    });
}

module.exports = { product, productPage, getProducts, 
    editProductPage, postEditProductPage 
};