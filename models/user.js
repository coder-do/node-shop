const mongodb = require('mongodb');
const { getDb } = require('../utils/db');

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('user').insertOne(this);
    }

    addToCart(product) {
        const index = this.cart.items.findIndex(item => {
            return item.id.toString() === product._id.toString();
        });
        let newQuantity = 1;
        const updatedCartItems = [...this.cart.items];
        if (index >= 0) {
            newQuantity = this.cart.items[index].quantity + 1;
            updatedCartItems[index].quantity = newQuantity;
        } else {
            updatedCartItems.push({
                id: new mongodb.ObjectId(product._id),
                quantity: newQuantity
            });
        }
        const updatedCart = { items: updatedCartItems };
        const db = getDb();
        return db
            .collection('user')
            .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } })
    }

    deleteCartItem(id) {
        const updCart = this.cart.items.filter(item => {
            return item.id.toString() !== id.toString();
        })
        const db = getDb();
        return db
            .collection('user')
            .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: { cart: { items: updCart } } })
    }

    fetchCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.id;
        });
        return db.collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.id.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    static findById(id) {
        const db = getDb();
        return db.collection('user')
            .findOne({ _id: new mongodb.ObjectId(id) });
    }
}

module.exports = User;