const express = require('express');
const { check } = require('express-validator');

const userControllers = require('../controller/user-controller');
const ReservationControllers = require('../controller/reservation-controller');

const router = express.Router();

router.post('/login', userControllers.login);
router.post('/register', userControllers.register);
router.get('/:uid', userControllers.getUserById);
// router.get('/:uid/reservation', ReservationControllers.getReservationsByUserId);


module.exports = router;  