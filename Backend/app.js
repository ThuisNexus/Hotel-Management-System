const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Stripe = require('stripe');
const cors = require('cors');
require('dotenv').config();

const roomRoutes = require('./routes/room-routes');
const hallRoutes = require('./routes/hall-routes');
const cartRoutes = require('./routes/cart-routes');
const reservationRoutes = require('./routes/reservation-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./models/http-error');
const Payment = require('./models/payment');

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));


app.use('/rooms',roomRoutes);
app.use('/halls',hallRoutes);
app.use('/reservations',reservationRoutes);
app.use('/cart', cartRoutes)
app.use('/user',userRoutes);

app.post('/checkout', async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'eur',
        });

        const payment = new Payment({
            paymentId: paymentIntent.id,
            amount,
            currency,
            status: paymentIntent.status,
          });

          await payment.save();

          res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => { 
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
})

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });
