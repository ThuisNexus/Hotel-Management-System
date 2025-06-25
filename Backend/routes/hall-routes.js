const express = require('express');
const { check } = require('express-validator');

const hallControllers = require('../controller/hall-controller');

const router = express.Router();

router.get('/', hallControllers.getHalls);
router.get('/:hid', hallControllers.getHallById);

router.post(
    '/',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 }),
        check('price').isNumeric(),
        check('capacity').isNumeric(),
        check('available').isBoolean(),
        check('services').isObject()
    ],
    hallControllers.createHall
);

module.exports = router;