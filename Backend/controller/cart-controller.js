const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const Cart = require('../models/cart');
const Room = require('../models/room');
const Payment = require('../models/payment');
const Reservation = require('../models/reservation');
const HttpError = require('../models/http-error');

const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const verifyToken = (req) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed! Token is missing.');
        }
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.error('Token verification error:', error.message);
        throw new HttpError('Authentication failed!', 401);
    }
};

const addToCart = async (req, res, next) => {
    console.log('Incoming request to add to cart:', req.body);

    try {
        const decodedToken = verifyToken(req);
        const userId = decodedToken.userId;
        console.log('Authenticated user ID:', userId);

        const { roomId, name, price, dates, guests } = req.body;
        if (!roomId || !name || !price || !dates || !dates.startDate || !dates.endDate || !guests) {
            return res.status(400).json({ message: 'Invalid input data. Ensure all fields are provided.' });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }



        let cart = await Cart.findOne({ userId });
        if (!cart) {
            console.log('No existing cart found. Creating a new cart.');
            cart = new Cart({ userId, items: [] });
        }

        console.log('Cart before adding item:', cart);
        cart.items.push({ roomId, name, price, dates, guests });
        await cart.save();
        console.log('Cart after adding item:', cart);

        res.status(201).json({ message: 'Item added to cart successfully!', cart: { items: cart.items } });
    } catch (err) {
        console.error('Error adding to cart:', err);
        res.status(500).json({ message: 'Adding item failed', error: err.message });
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const decodedToken = verifyToken(req);
        const userId = decodedToken.userId;

        const { itemId } = req.body;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
        await cart.save();

        res.status(200).json({ message: 'Item removed from cart', cart });
    } catch (err) {
        res.status(500).json({ message: 'Removing from cart failed', error: err.message });
    }
};

const viewCart = async (req, res, next) => {
    try {
        const decodedToken = verifyToken(req);
        const userId = decodedToken.userId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json({ cart });
    } catch (err) {
        res.status(500).json({ message: 'Fetching cart failed', error: err.message });
    }
};

const calculateCartTotal = async (req, res, next) => {
    try {
        const userId = req.userId;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const total = cart.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
        res.status(200).json({ total });
    } catch (err) {
        res.status(500).json({ message: 'Failed to calculate cart total', error: err.message });
    }
};


const handleCheckout = async (req, res, next) => {
    const decodedToken = verifyToken(req);
    const userId = decodedToken.userId;

    try {
        const { userId, rooms, amount, currency } = req.body;

        const cart = await Cart.findOne({ userId }).populate('items.roomId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty.' });
        }
 
        if (!amount || !currency) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'eur',
        });

        console.log('Payment successful:', paymentIntent);

        const payment = new Payment({
            paymentId: paymentIntent.id,
            amount,
            currency,
            status: paymentIntent.status,
        });
        await payment.save();

        const processedRooms = [];
        const errors = [];

        console.log('Processing rooms:', rooms);
        rooms.forEach((item, index) => {
            if (!item.roomId || !item.name || !item.startDate || !item.endDate || !item.price) {
                errors.push({
                    index,
                    message: 'Cart item is missing required fields.',
                    missingFields: {
                        roomId: !item.roomId,
                        name: !item.name,
                        price: !item.price,
                        startDate: !item.startDate,
                        endDate: !item.endDate,
                    },
                });
            } else {
                processedRooms.push({
                    roomId: item.roomId,
                    name: item.name, 
                    price: item.price,
                    startDate: item.startDate,
                    endDate: item.endDate,
                });
            }
        });

        if (errors.length > 0) {
            console.error('Invalid cart items detected:', errors);
            return res.status(400).json({
                message: 'Some cart items are invalid.',
                errors,
            });
        }
        
        console.log('Processed rooms:', processedRooms);

        const totalPrice = rooms.reduce((sum, room) => sum + room.price, 0);

        const newReservation = new Reservation({
            userId,
            rooms: processedRooms,
            dateOfReservation: new Date(),
            totalPrice,
        });

        await newReservation.save();

        cart.items = [];
        await cart.save();

        res.status(200).json({
            message: 'Checkout and reservation completed successfully.',
            reservation: newReservation,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.error('Error during checkout and reservation:', err);
        next(new HttpError('Checkout failed.', 500));
    }
};

const handleCheckoutSuccess = async (req, res, next) => {
    const { userId, rooms, startDate, endDate, totalPrice } = req.body;

    if (!rooms || !Array.isArray(rooms) || !startDate || !endDate || !totalPrice) {
        return res.status(400).json({ message: 'Invalid request data.' });
    }

    try {
        console.log("Received data in handleCheckoutSuccess:", req.body);

        if (!rooms || !Array.isArray(rooms)) {
            throw new Error('Rooms must be an array.');
        }

        const processedRooms = [];

        for (const room of rooms) {
            const existingRoom = await Room.findById(room.roomId);
            if (!existingRoom) {
                throw new Error('Room not found');
            }

            const isAvailable = existingRoom.bookedPeriods.every(period => 
                (new Date(endDate) <= new Date(period.startDate) || new Date(startDate) >= new Date(period.endDate))
            );

            if (!isAvailable) {
                return next(new HttpError(`Room ${room.roomId} is not available for the selected period.`, 400));
            }

            existingRoom.bookedPeriods.push({ startDate, endDate });
            await existingRoom.save();

            processedRooms.push({
                roomId: existingRoom._id,
                name: existingRoom.name,
                price: existingRoom.price,
                startDate: room.startDate,
                endDate: room.endDate,
            });

            console.log("processed rooms: ", processedRooms);
        }

        const createdReservation = new Reservation({
            userId,
            rooms: processedRooms,
            dateOfReservation: new Date(),
            totalPrice,
        });

        await createdReservation.save();
        console.log('Reservation saved successfully:', createdReservation);

        await Cart.findOneAndUpdate({ userId }, { items: [] });
        console.log('Cart cleared successfully for user:', userId);

        res.status(201).json({ message: 'Reservation created successfully.' });
    } catch (err) {
        console.error('Error during checkout success:', err);
        if (next) {
            next(new HttpError('Failed to process reservation.', 500));
        } else {
            res.status(500).json({ message: 'Internal error during checkout success.', error: err.message });
        }
    }
};

exports.addToCart = addToCart;
exports.removeFromCart = removeFromCart;
exports.viewCart = viewCart;
exports.calculateCartTotal = calculateCartTotal;
exports.handleCheckout = handleCheckout;
exports.handleCheckoutSuccess = handleCheckoutSuccess;

