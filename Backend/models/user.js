const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, minlength: 6},
    phoneNumber : {type: String, required: true},
    reservations: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            dates: {
                startDate: { type: String, required: true },
                endDate: { type: String, required: true },
            },
            guests: { type: Number, required: true },
        },
    ],
});

module.exports = mongoose.model('User', userSchema);