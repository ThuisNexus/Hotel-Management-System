const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    title: {type: String, required: true},
    roomType: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
    available: {type: Boolean, required: true},
    image: {
        first: {type: String, required: true},
        second: {type: String, required: true},
        third: {type: String, required: true}
    },
    amenities: {
        hasView: {type: Boolean, required: true},
        hasTV: {type: Boolean, required: true},
        hasAC: {type: Boolean, required: true},
        freeParking: {type: Boolean, required: true},
        cleaningServices: {type: Boolean, required: true}
    },
    bookedPeriods: [
        {
            startDate: { type: String, required: true },
            endDate: { type: String, required: true }, 
        }
    ]
});

module.exports = mongoose.model('Room', roomSchema);