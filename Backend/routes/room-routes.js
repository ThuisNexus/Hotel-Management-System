const express = require('express');
const { check } = require('express-validator');

const roomControllers = require('../controller/room-controller');

const router = express.Router();

router.get('/', roomControllers.getRooms);
router.get('/:rid', roomControllers.getRoomById);
router.get('/available', roomControllers.searchAvailableRooms);

router.post(
    '/',
    [
        check('title')
            .not()
            .isEmpty(),  
        check('roomType')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 }),
        check('price').isNumeric(),
        check('available').isBoolean(),
        check('amenities').isObject()
    ],
    roomControllers.createRoom
  );

module.exports = router;