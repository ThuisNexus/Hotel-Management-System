import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

import PaymentForm from './PaymentForm';
import './Cart.css';

const Cart = () => {
    const { cart, isLoading } = useContext(CartContext);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    

    if (isLoading) {
        return <p>Loading cart...</p>;
    }

    if (cart.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    const calculateItemDetails = (item) => {
        if (!item || !item.dates || !item.dates.startDate || !item.dates.endDate || !item.price) {
            return { numberOfNights: 0, totalPrice: 0 };
        }

        const numberOfNights = Math.ceil(
            (new Date(item.dates.endDate) - new Date(item.dates.startDate)) /
            (1000 * 60 * 60 * 24)
        );
        const totalPrice = (item.price * numberOfNights).toFixed(2);

        return { numberOfNights, totalPrice };
    };

    const totalCartPrice = cart.reduce((total, item) => {
        const { totalPrice } = calculateItemDetails(item);
        return total + (Number(totalPrice) || 0); 
    }, 0).toFixed(2);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' }; 
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            <ul className="cart-list">
                {cart.map((item, index) => {
                    const { numberOfNights, totalPrice } = calculateItemDetails(item);
                    return (
                        <li key={item.roomId || index} className="cart-item">
                            <h2>{item.name}</h2>
                            <p>Dates: {formatDate(item.dates.startDate)} to {formatDate(item.dates.endDate)}</p>
                            <p>Number of nights: {numberOfNights}</p>
                            <p>Guests: {item.guests}</p>
                            <p>Total Price: €{totalPrice}</p>
                        </li>
                    );
                })}
            </ul>
            <div className="payment-container">
                <p>Total price: €{totalCartPrice}</p>
                <button onClick={() => setShowPaymentForm(true)}>Checkout</button>
                
                {showPaymentForm && <PaymentForm totalAmount={totalCartPrice} />} 
            </div>
        </div>
    );
};

export default Cart;
