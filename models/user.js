const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    card: {
        items: [{
            id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }]
    }
});

user.methods.addToCard = function (product) {
    const index = this.card.items.findIndex(item => {
        return item.id.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCardItems = [...this.card.items];
    if (index >= 0) {
        newQuantity = this.card.items[index].quantity + 1;
        updatedCardItems[index].quantity = newQuantity;
    } else {
        updatedCardItems.push({
            id: product._id,
            quantity: newQuantity
        });
    }
    const updatedCard = { items: updatedCardItems };
    this.card = updatedCard;
    return this.save()
};

user.methods.deleteCardItem = function (id) {
    const updCart = this.card.items.filter(item => {
        return item.id.toString() !== id.toString();
    })
    this.card.items = updCart;
    return this.save();
};

user.methods.clearCard = function () {
    this.card = { items: [] };
    return this.save();
};

module.exports = mongoose.model('User', user);