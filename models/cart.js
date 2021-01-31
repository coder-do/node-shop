const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProd(id, prodPrice) {
        fs.readFile(p, (err, content) => {
            let cart = { products: [], price: 0 };
            if (!err) {
                cart = JSON.parse(content);
            }
            const existIndex = cart.products.findIndex(p => p.id === id);
            const existProd = cart.products[existIndex];
            let uptated;

            if (existProd) {
                uptated = { ...existProd };
                uptated.qtty = uptated.qtty + 1;
                cart.products = [...cart.products];
                cart.products[existIndex] = uptated;
            } else {
                uptated = { id: id, qtty: 1 };
                cart.products = [...cart.products, uptated];
            }
            cart.price = cart.price + +prodPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    };

    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQtty = product.qtty;
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
            );
            updatedCart.price -= price * productQtty;
            updatedCart.price = +updatedCart.price.toFixed(2);

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        })
    }

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
}
