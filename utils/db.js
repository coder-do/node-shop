const mongodb = require('mongodb');

const client = mongodb.MongoClient;

let _db;

const db = (cb) => {
    client.connect('mongodb+srv://coder-do:coder-do@cluster0.rwygg.mongodb.net/node-shop?retryWrites=true&w=majority')
        .then(res => {
            _db = res.db();
            cb();
        })
        .catch(err => console.log(err))
};

const getDb = () => {
    if (_db) {
        return _db
    }
    throw 'Database not found'
}

module.exports = { db, getDb };