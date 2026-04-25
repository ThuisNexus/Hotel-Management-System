import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

let stripePromise = null;

if (process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
} else {
    console.log("⚠️ Stripe disabled in frontend");
}

const PaymentComponent = () => {

    if (!stripePromise) {
        return <div>Payment disabled</div>;
    }

    return (
        // If you enable Stripe later, wrap like this:
        // <Elements stripe={stripePromise}>
        //     <PaymentForm />
        // </Elements>

        <PaymentForm />
    );
};

export default PaymentComponent;