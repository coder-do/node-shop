const Product = require('../models/product');

const product = (req, res, next) => {
    const { title, image, description, price } = req.body;
    const product = new Product(title, image, price, description, null, req.user._id);
    product.save()
        .then(() => {
            res.redirect('/admin/products');
        }).catch(err => console.log(err))

}

const productPage = (req, res, next) => {
    res.render('admin/edit-product', {
        title: 'Add product', path: '/admin/product-page',
        active: true, editing: false
    });
}

const getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('admin/products', {
                title: 'Admin Products', prod: products,
                path: '/admin/products'
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

    const product = new Product(updatedTitle, updatedImageUrl, updatedPrice, updatedDesc, prodId);
    product.save()
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

const postDeleteProduct = (req, res, next) => {
    const id = req.body.id;
    Product.deleteById(id)
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
                product: product
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