const mongodb = require('mongodb');
const { getDb } = require('../utils/db');

class Product {
    constructor(title, image, price, description, id) {
        this.title = title;
        this.image = image;
        this.price = price;
        this.description = description;
        this._id = id && new mongodb.ObjectId(id);
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
        } else {
            dbOp = db.collection('products').insertOne(this)
        }
        return dbOp
            .then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => console.log(err))
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(id) })
            .next()
            .then(product => {
                return product;
            })
            .catch(err => console.log(err))
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
    }
}

module.exports = Product;