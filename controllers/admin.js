const Product = require('../models/product');

const product = (req, res, next) => {
    const { title, image, description, price } = req.body;
    console.log(title, image, description, price);
    const products = new Product(title, image, description, price, 0);
    products.save();
    res.redirect('/');
}

const productPage = (req, res, next) => {
    res.render('admin/edit-product', { title: 'Add product', path: '/admin/product-page', 
        active: true, editing: false });
}

const getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', { title: 'Edit Product', prod: products, 
            path: '/admin/products'
        });
    });
}

const postEditProductPage = (req, res, next) => {
    const id = req.body.id;
    const updatedTitle = req.body.title;
    const updatedImage = req.body.image;
    const updatedPrice = req.body.price;
    const updatedDescr = req.body.description;
    const updatedProduct = new Product(updatedTitle, updatedImage, updatedDescr, updatedPrice, id);
    updatedProduct.save();
    res.redirect('/admin/products');
};

const postDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.deleteById(id);
    res.redirect('/admin/products');
};

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
    editProductPage, postEditProductPage, postDeleteProduct
};