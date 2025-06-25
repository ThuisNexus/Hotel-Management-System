const HttpError = require('../models/http-error');
const { updateRoomAvailability } = require('./room-controller');
const Room = require('../models/room');
const Reservation = require('../models/reservation');

const getReservationsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  try {
      const reservations = await Reservation.find({ userId }).populate('rooms.roomId');
      if (!reservations || reservations.length === 0) {
        console.log("No reservations found for user ID:", userId);
          return res.status(200).json({ reservations: [] });;
      }

      res.json({ reservations: reservations.map(r => r.toObject({ getters: true })) });
  } catch (err) {
      next(new HttpError('Fetching reservations failed, please try again later.', 500));
  }
};


const createReservation = async (req, res, next) => {
    const { userId, rooms, totalPrice } = req.body;

    console.log('Incoming reservation data:', { userId, rooms, totalPrice });

    try {
        for (const room of rooms) {
            const { startDate, endDate } = room;

            const existingRoom = await Room.findById(room.roomId);
            if (!existingRoom) {
                throw new Error('Room not found');
            }

            if (!existingRoom.bookedPeriods || !Array.isArray(existingRoom.bookedPeriods)) {
                console.error(`Field "bookedPeriods" is missing or invalid in room ID ${room.roomId}.`);
                throw new Error('Invalid room data');
            }

            const isAvailable = existingRoom.bookedPeriods.every(period => {
                console.log('Checking period:', period);
                console.log('New booking:', { startDate, endDate });
        
                const isBefore = new Date(endDate) <= new Date(period.startDate);
                const isAfter = new Date(startDate) >= new Date(period.endDate);
        
                console.log('Is before existing period:', isBefore);
                console.log('Is after existing period:', isAfter);
        
                return isBefore || isAfter;
            });      

            if (!isAvailable) {
                return next(new HttpError(`Room ${room.roomId} is not available for the selected period.`, 400));
            }

            existingRoom.bookedPeriods.push({
                startDate,
                endDate
            });

            console.log('Updated bookedPeriods:', existingRoom.bookedPeriods);
            console.log(`Room ${room.roomId} availability updated successfully.`);
            await existingRoom.save();
        }
        
        if (!Array.isArray(req.body.rooms) || req.body.rooms.some(room => {
            return !room.roomId || !room.name || !room.startDate || !room.endDate;
        })) {
            return res.status(400).json({ message: 'Missing or invalid room data.' });
        }
        

        console.log('Received request body:', req.body);
        console.log('Rooms being processed:', req.body.rooms);

        const createdReservation = new Reservation({
            userId,
            rooms,
            dateOfReservation: new Date(),
            totalPrice,
        });

        await createdReservation.save();
        console.log('Reservation saved successfully:', createdReservation);

        res.status(201).json({ reservation: createdReservation });
    } catch (err) {
        console.error('Error creating reservation:', err);
        // next(new HttpError('Failed to create reservation.', 500));
        res.status(500).json({ error: err.message });
    }
};

exports.getReservationsByUserId = getReservationsByUserId;
exports.createReservation = createReservation;