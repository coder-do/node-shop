const Sequelize = require('sequelize');

const sql = require('../utils/db');

const OrderItem = sql.define('orderItem', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: Sequelize.INTEGER
})

module.exports = OrderItem;