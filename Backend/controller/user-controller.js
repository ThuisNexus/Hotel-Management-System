const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const Reservation = require('../models/reservation');

const register = async (req, res, next) => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        console.log("Received data:", { name, email, password, phoneNumber });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, phoneNumber });
        await user.save();

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } 
        );
        
        res.status(201).json({
            message: 'User registered successfully.',
            token,
            userId: user._id,
            email: user.email,
            redirect: '/'
        });

    } catch (err) {
        res.status(500).json({ message: 'An error occurred during registration. Please try again later.' });
    }
 
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            console.log(`Login failed: No user found with email ${email}`);
            const error = new HttpError('No account found with this email address.', 401);
            return next(error);
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);

        if (!isValidPassword) {
            console.log(`Login failed: Invalid password for email ${email}`);
            const error = new HttpError('Invalid password, could not log you in.', 401);
            return next(error);
        }

        const token = jwt.sign(
            { userId: existingUser._id, email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({ userId: existingUser._id, email: existingUser.email, token });
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later.', 500);
        return next(error);
    }
};

const getUserById = async (req, res, next) => {
    const userId = req.params.uid;
    let user;

    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError('Fetching user failed, please try again later.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for the provided id.', 404);
        return next(error);
    }

    res.json({ user: user.toObject({ getters: true }) });
};

const getUserProfile = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Authentication failed! Token is missing.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Invalid token! No user ID found.' });
        }

        const reservations = await Reservation.find({ userId }).populate('rooms.roomId', 'name price');

        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ message: 'No reservations found for this user.' });
        }

        const formattedReservations = reservations.map(reservation => ({
            id: reservation._id,
            rooms: reservation.rooms.map(room => ({
                name: room.roomId.name,
                price: room.roomId.price,
            })),
            totalPrice: reservation.totalPrice,
            dateOfReservation: reservation.dateOfReservation,
        }));

        res.status(200).json({ reservations: formattedReservations });

    } catch (err) {
        console.error('Error fetching profile data:', err);
        return res.status(500).json({ message: 'Fetching profile data failed.' });
    }
};


exports.register = register;  
exports.login = login;
exports.getUserById = getUserById;
exports.getUserProfile = getUserProfile;
