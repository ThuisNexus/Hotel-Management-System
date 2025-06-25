const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const Room = require('../models/room');

const getRooms = async (req, res, next) => { 
  let rooms;

  try {
      rooms = await Room.find();
  } catch (err) {
      const error = new HttpError(
          'Fetching rooms failed, please try again later.',
          500
      );
      return next(error);
  }

  res.json({ rooms});
};

const getRoomById = async(req, res, next) => {
  const roomId = req.params.rid;
  let room;
  
  try {
      room = await Room.findById(roomId);
  } catch (err) {
      const error = new HttpError('Something went wrong, could not find a room.', 500);
      return next(error);
  }

  if(!room){
      const error = new HttpError('Could not find room for the provided id!', 500);
      return next(error);
  }

  console.log(room);
  res.json({room: room.toObject({getters: true})});
};

const createRoom = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, roomType, description, price, available, amenities } = req.body;

  const createdRoom = new Room({
    title,
    roomType,
    description,
    price,
    available,
    image: {
      first: 'https://www.grandwailea.com/sites/default/files/styles/card_portrait/public/2023-05/Napua%20Nani%20Suite%20Bedroom_0.jpg?h=268f4dea&itok=jiWKI5Gh',
      second: 'https://www.grandwailea.com/sites/default/files/2023-05/Napua%20Nani%20Suite%20Bathroom.jpg',
      third: 'https://www.grandwailea.com/sites/default/files/styles/gallery/public/2022-06/6048_bath.jpg?h=81d02d30&itok=jxm7W9Rn'
    },
    amenities
  });

  try {
    await createdRoom.save();
  } catch (err) {
    const error = new HttpError(
      'Creating room failed, please try again.',
      500
    );
    return next(error);
  }
  
  res.status(201).json({ room: createdRoom });
};

const updateRoomAvailability = async (roomId, startDate, endDate) => {
  try {
      const room = await Room.findById(roomId);

      if (!room) {
          throw new Error('Room not found');
      }

      room.bookedPeriods.push({ startDate, endDate });
      await room.save();
  } catch (err) {
      throw new Error('Failed to update room availability');
  }
};

const getAvailableRooms = async (startDate, endDate) => {
  const availableRooms = await Room.find({
      $or: [
          { bookedPeriods: { $exists: false } },
          {
              bookedPeriods: {
                  $not: {
                      $elemMatch: {
                          startDate: { $lt: endDate },
                          endDate: { $gt: startDate }
                      }
                  }
              }
          }
      ]
  });

  return availableRooms;
};

const searchAvailableRooms = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  try {
      const rooms = await Room.find();

      const availableRooms = rooms.filter(room => 
          room.bookedPeriods.every(period => 
              (new Date(endDate) <= new Date(period.startDate) || new Date(startDate) >= new Date(period.endDate))
          )
      );

      res.json({ availableRooms: availableRooms.map(room => room.toObject({ getters: true })) });
  } catch (err) {
      next(new HttpError('Searching for available rooms failed, please try again later.', 500));
  }
};

exports.getRooms = getRooms;
exports.getRoomById = getRoomById;
exports.createRoom = createRoom;
exports.updateRoomAvailability = updateRoomAvailability;
exports.getAvailableRooms = getAvailableRooms;
exports.searchAvailableRooms = searchAvailableRooms;