const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const product = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
});

module.exports = mongoose.model('Product', product);