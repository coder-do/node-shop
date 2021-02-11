const Product = require('../models/product');

const product = (req, res, next) => {
    const { title, image, description, price } = req.body;
    const product = new Product({
        title: title,
        image: image,
        description: description,
        price: price,
        userId: req.user
    });
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        }).catch(err => console.log(err))
}

const productPage = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add product', path: '/admin/product-page',
        active: true, editing: false, isAuth: req.session.isAuth
    });
}

const getProducts = (req, res, next) => {
    if (!req.session.isAuth) {
        res.redirect('/login')
    }
    Product.find()
        .then(products => {
            res.render('admin/products', {
                title: 'Admin Products', prod: products,
                path: '/admin/products', isAuth: req.session.isAuth
            });
        })
        .catch(err => {
            console.log(err);
        });
}

const postEditProductPage = (req, res, next) => {
    const prodId = req.body.id;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.image;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.image = updatedImageUrl;
            product.description = updatedDesc;
            product.price = updatedPrice;
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

const postDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.findByIdAndRemove(id)
        .then(() => res.redirect('/admin/products'))
};

const editProductPage = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: id,
                product: product, isAuth: req.session.isAuth
            });
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
}

module.exports = {
    product, productPage, getProducts,
    editProductPage, postEditProductPage, postDeleteProduct
};