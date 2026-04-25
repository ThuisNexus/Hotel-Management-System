import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';
import { CartContext } from '../context/CartContext';

const PaymentForm = () => {
  const { cart, calculateTotal, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const userId = localStorage.getItem('uid');

  const handleFakeCheckout = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert('Your cart is empty.');
        return;
      }

      const rooms = cart.map((item) => ({
        roomId: item.roomId,
        name: item.name,
        price: item.price,
        startDate: item?.dates?.startDate,
        endDate: item?.dates?.endDate,
      }));

      console.log("Simulated rooms:", rooms);

      // 🔥 Fake success (no Stripe)
      alert('Payment successful (simulated)!');

      // clear cart
      setCart([]);
      localStorage.removeItem('cart');

      // navigate
      navigate(`/reservations/user/${userId}`);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Payment Disabled (Demo Mode)</h2>

      <p style={{ marginBottom: "20px" }}>
        This project is running without payment integration.
      </p>

      <div className="payment-form">
        <button 
          onClick={handleFakeCheckout} 
          className="pay-button"
        >
          Simulate Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;