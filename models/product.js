const Sequelize = require('sequelize');
const sql = require('../utils/db');

const Product = sql.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    image: {
        type: Sequelize.TEXT,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;