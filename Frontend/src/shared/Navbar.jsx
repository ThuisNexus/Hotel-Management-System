import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

import "./Navbar.css";

function Navbar() {
  const {userEmail, setUserEmail} = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    //const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }

        const decodedPayload = JSON.parse(atob(parts[1]));
        setUserEmail(decodedPayload.email);
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
      }
    }
  }, [setUserEmail]);

  function handleLogout() {
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    setUserEmail(null);
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">Grand Wailea</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/rooms">Rooms</Link></li>
        <li><Link to="/halls">Halls</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>
      <div className="navbar-user">
          {userEmail ? (
            <>
              <li className="profile-link"><Link to="/reservations/user/${userId}">{userEmail}</Link></li>
              <Link to="/cart">Cart ({cart.length})</Link>
              <li><button onClick={handleLogout}>Sign Out</button></li>
            </>
          ) : (
            <ul>
              <li><Link to="/login">Login</Link></li>
            </ul>
          )}
        </div>
    </nav>
  );
}

export default Navbar;
