const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');

const Hall = require('../models/hall');

const getHalls = async (req, res, next) => {
  let halls;

  try {
    halls = await Room.find();
  } catch (err) {
      const error = new HttpError(
          'Fetching halls failed, please try again later.',
          500
      );
      return next(error);
  }

  res.json({ halls: halls.toObject({ getters: true })});
};

const getHallById = async(req, res, next) => {
    const hallId = req.params.rid;
    let hall;
    
    try {
        hall = await Hall.findById(hallId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a hall.', 500);
        return next(error);
    }

    if(!hall){
        const error = new HttpError('Could not find hall for the provided id!', 500);
        return next(error);
    }

    res.json({hall: hall.toObject({getters: true})});
};

const createHall = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description, price, capacity, available, services } = req.body;
  
    const createdHall = new Hall({
      title,
      description,
      price,
      capacity,
      available,
      image: {
        first: 'https://stories-editor.hilton.com/wp-content/uploads/2024/02/Kilolani-Spa-Grand-Wailea-A-Waldorf-Astoria-Resort-Hammam.jpg?w=828&h=583&crop=1&q=75',
        second: 'https://stories-editor.hilton.com/wp-content/uploads/2024/02/Kilolani-Spa-Grand-Wailea-A-Waldorf-Astoria-Resort-Portal.jpg?w=1024',
        third: 'https://stories-editor.hilton.com/wp-content/uploads/2024/02/Kilolani-Spa-Grand-Wailea-A-Waldorf-Astoria-Resort-Hydro-Pool.jpg?w=1024' 
      },
      services
    });
  
    try {
      await createdHall.save();
    } catch (err) {
      const error = new HttpError(
        'Creating hall failed, please try again.',
        500
      );
      return next(error);
    }
    
    res.status(201).json({ hall: createdHall });
  };

exports.getHalls = getHalls;
exports.getHallById = getHallById;
exports.createHall = createHall;