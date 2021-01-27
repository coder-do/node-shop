const fs = require('fs');
const path = require('path');

module.exports = class Product {
    constructor(title, image, description, price) {
        this.title = title;
        this.image = image;
        this.description = description;
        this.price = price;
    }

    save() {
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'product.json');
        fs.readFile(p, (err, data) => {
            let products = [];
            if(!err) {
                products = JSON.parse(data);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        })
    }

    static fetchAll(cb) {
        const p = path.join(path.dirname(process.mainModule.filename), 'data', 'product.json');
        fs.readFile(p, (err, data) => {
            if(err) {
                cb([]);
            }
            cb(JSON.parse(data));
        })
    }
}