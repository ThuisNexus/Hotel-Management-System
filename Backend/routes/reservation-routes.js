const express = require('express');
const ReservationControllers = require('../controller/reservation-controller');

const router = express.Router();

// router.post('/', ReservationControllers.createReservation);
router.post('/user/:uid', ReservationControllers.createReservation);
router.get('/user/:uid', ReservationControllers.getReservationsByUserId);

module.exports = router;