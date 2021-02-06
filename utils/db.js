const mongodb = require('mongodb');

const client = mongodb.MongoClient;

let _db;

const db = (cb) => {
    client.connect(process.env.DB_HOST)
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