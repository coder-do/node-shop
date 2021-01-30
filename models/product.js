const fs = require('fs');
const path = require('path');

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
    constructor(title, image, description, price) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }

    save() {
        this.id = '_' + Math.random().toString(36).substr(2, 9);
        getProducts(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
              console.log(err);
            });
        });      
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