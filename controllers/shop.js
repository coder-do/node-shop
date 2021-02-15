const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocument = require('pdfkit');

const ITEMS_IN_PAGE = 3;

const shopPage = (req, res, next) => {
    const page = +req.query.page || 1;
    let items;
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
            res.render('shop/product-list', {
                prod: products,
                title: 'All Products',
                path: '/products',
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

const getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let items;
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
            res.render('shop/index', {
                prod: products,
                title: 'Shop',
                path: '/',
                hasProd: products.length > 0,
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


const card = (req, res, next) => {
    req.user
        .populate('card.items.id')
        .execPopulate()
        .then(products => {
            res.render('shop/card', {
                path: '/card',
                title: 'Your Card',
                products: products.card.items,
            });
        })
        .catch(err => console.log(err))
}

const postDeleteCardItem = (req, res, next) => {
    const id = req.body.id;
    req.user.deleteCardItem(id)
        .then(() => {
            res.redirect('/card');
        })
}

const addProduct = (req, res, next) => {
    const prodId = req.body.id.split(' ').join('');
    Product.findById(prodId)
        .then(prod => {
            return req.user.addToCard(prod);
        })
        .then(() => {
            res.redirect('/card');
        })
}

const checkout = (req, res, next) => {
    res.render('shop/card', { path: '/checkout', title: 'Checkout Page' })
}

const getProduct = (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .then(products => {
            res.render('shop/product-details', { prod: products, title: 'Details', path: '/product/:id', })
        })
        .catch(err => {
            console.log(err);
        });
};

const getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            res.render('shop/orders', {
                title: 'Your Orders', prod: orders,
                path: '/orders', active2: true,
            });
        })
        .catch(err => console.log(err));
}

const postOrder = (req, res, next) => {
    req.user
        .populate('card.items.id')
        .execPopulate()
        .then(products => {
            const prod = products.card.items.map(item => {
                return { product: item.id._doc, quantity: item.quantity }
            });
            const order = new Order({
                products: prod,
                user: {
                    email: req.user.email,
                    userId: req.user
                }
            })
            return order.save()
        })
        .then(() => {
            return req.user.clearCard();
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(err => console.log(err));
};

const getInvoice = (req, res, next) => {
    const orderId = req.params.id;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
                // replace attachment with inline to open file in browser
            );
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.product.title +
                        ' - ' +
                        prod.quantity +
                        'x ' +
                        '$' +
                        prod.product.price
                    );
            });
            pdfDoc.text('---');
            pdfDoc.fillColor('green').fontSize(20).text('Total Price: $' + totalPrice);

            pdfDoc.end();
        })
        .catch(err => next(err));
}
module.exports = {
    shopPage, getIndex, card,
    checkout, getOrders, getProduct, addProduct,
    postDeleteCardItem, postOrder, getInvoice
};