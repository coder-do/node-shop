const Product = require('../models/product');
const ITEMS_IN_PAGE = 3;

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
        active: true, editing: false
    });
}

const getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let items;
    if (!req.session.isAdmin) {
        res.redirect('/login')
    }
    Product
        .find()
        .countDocuments()
        .then(num => {
            items = num;
            return Product
                .find()
                .skip((page - 1) * ITEMS_IN_PAGE)
                .limit(ITEMS_IN_PAGE)
        })
        .then(products => {
            res.render('admin/products', {
                prod: products,
                title: 'Admin Products',
                path: '/admin/products',
                active2: true,
                currentPage: page,
                hasNextPage: ITEMS_IN_PAGE * page < items,
                hasPrevPage: page > 1,
                nextPage: page + 1,
                prevPage: page - 1,
                lastPage: Math.ceil(items / ITEMS_IN_PAGE)
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
            return res.render('admin/edit-product', {
                title: 'Edit Product',
                path: '/admin/edit-product',
                editing: id,
                product: product
            });
        })
        .catch(err => console.log(err));
};

const getAdmin = (req, res, next) => {
    res.render('auth/admin', {
        title: 'Admin Page',
        path: '/admin',
        error: false
    })
};

module.exports = {
    product, productPage, getProducts,
    editProductPage, postEditProductPage, postDeleteProduct,
    getAdmin
};