const Sequelize = require('sequelize');

//     name of db    user name      password   Mysql workbench example
const sql = new Sequelize('node-shop', 'root', 'node-shop', {
    dialect: 'mysql',
    host: 'localhost' // host of machine
})

module.exports = sql;