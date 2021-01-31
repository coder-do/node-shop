const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);
  
const getProducts = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
};
  

module.exports = class Product {
    constructor(title, image, description, price, id) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
        this.id = id;
    }

    save() {
        getProducts(products => {
            if(this.id) {
                const existingProdId = products.findIndex(p => p.id === this.id);
                const updatedProds = [...products];
                updatedProds[existingProdId] = this;
                fs.writeFile(p, JSON.stringify(updatedProds), err => {
                    console.log(err);
                });
            } else {
                this.id = '_' + Math.random().toString(36).substr(2, 9);
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });      
    }

    static deleteById(id) {
        getProducts(prod => {
            const updatedProds = prod.filter(p => p.id !== id);
            const product = prod.find(p => p.id === id);
            fs.writeFile(p, JSON.stringify(updatedProds), err => {
                if(!err) {
                    Cart.deleteProduct(id, product.price);
                }
            }) 
        })
    }

    static fetchAll(cb) {
        getProducts(cb);
    }

    static findById(id, cb) {
        getProducts(prod => {
            const product = prod.find(p => p.id === id);
            cb(product);
        })
    }
}