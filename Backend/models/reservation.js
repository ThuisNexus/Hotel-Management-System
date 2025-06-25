const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rooms: [
        {
            roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            startDate: { type: String, required: true },
            endDate: { type: String, required: true },
        },
    ],
    dateOfReservation: { type: Date, default: Date.now },
    totalPrice: { type: Number, required: true },
});

module.exports = mongoose.models.Reservation || mongoose.model('Reservation', ReservationSchema);