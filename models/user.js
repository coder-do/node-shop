const mongodb = require('mongodb');
const { getDb } = require('../utils/db');

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('user').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db.collection('user')
            .findOne({ _id: new mongodb.ObjectId(id) });
    }
}

module.exports = User;