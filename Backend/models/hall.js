const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hallSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    capacity: {type: Number, required: true},
    available: {type: Boolean, required: true},
    image: {
        first: {type: String, required: true},
        second: {type: String, required: true},
        third: {type: String, required: true}
    },
    services: {
        isSmokingAllowed: {type: Boolean, required: true},
        hasAC: {type: Boolean, required: true},
        hasProjectionScreen: {type: Boolean, required: true},
        hasIncludedFood: {type: Boolean, required: true},
        hasIncludedDrinks: {type: Boolean, required: true}
    }
});

module.exports = mongoose.model('Hall', hallSchema);