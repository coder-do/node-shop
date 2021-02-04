const Sequelize = require('sequelize');

const sql = new Sequelize('node-shop', 'root', 'node-shop', {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sql;