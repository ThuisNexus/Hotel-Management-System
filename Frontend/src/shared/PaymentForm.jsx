import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './PaymentForm.css';
import { CartContext } from '../context/CartContext';

const PaymentForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  
  const { cart, calculateTotal, setCart } = useContext(CartContext);

  const userId = localStorage.getItem('uid');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      if (!cart || cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }


      const rooms = cart.map((item) => {
        if (!item.dates || !item.dates.startDate || !item.dates.endDate) {
          throw new Error(`Missing dates for room: ${item.name}`);
        }
        return {
          roomId: item.roomId,
          name: item.name,
          price: item.price,
          startDate: item.dates.startDate,
          endDate: item.dates.endDate,
        };
      });

      console.log('Rooms data:', rooms);

      if (!totalAmount || isNaN(totalAmount)) {
        console.error('Total amount is invalid:', totalAmount);
        return;
    }

      const response = await fetch('/cart/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json',
                      Authorization: `Bearer ${localStorage.getItem('token')}`
           },
          body: JSON.stringify({
              amount: totalAmount * 100,
              currency: 'eur',
              userId: localStorage.getItem('uid'),
              rooms,
              totalPrice: calculateTotal(),
          }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Checkout failed:', error);
        alert(`Error: ${error.message || 'Something went wrong'}`);
        return;
    }

      const { clientSecret } = await response.json();

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        alert('Payment successful!');

        setCart([]);
          localStorage.removeItem('cart');
          navigate(`/reservations/user/${userId}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <label htmlFor="cardholder-name">Cardholder Name</label>
        <input
          type="text"
          id="cardholder-name"
          placeholder="Enter cardholder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="card-element">Card Details</label>
        <div className="card-element-wrapper">
          <CardElement
            id="card-element"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#a0aec0',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="pay-button" disabled={!stripe}>
          Confirm and Pay
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;



