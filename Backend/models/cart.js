const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: [
        {
            roomId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Room' },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            dates: {
                startDate: { type: String, required: true },
                endDate: { type: String, required: true },
            },
            guests: { type: Number, required: true }
        },
    ]
});

module.exports = mongoose.model('Cart', CartSchema);