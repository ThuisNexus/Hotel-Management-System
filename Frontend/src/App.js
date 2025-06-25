import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from './shared/HomePage/Home';
import Gallery from './shared/Gallery/Gallery';
import Rooms from './room/pages/Rooms';
import SingleRoom from './room/pages/SingleRoom';
import Hall from './hall/pages/Hall';
import Navbar from './shared/Navbar';
import About from './shared/AboutUs/About';
import Login from './user/pages/Login';
import Cart from "./shared/Cart";
import Register from "./user/pages/Register";
import PaymentComponent from "./shared/PaymentComponent";
import Profile from "./user/pages/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/rooms/" element={<Rooms />} />
          <Route path="/rooms/:rid" element={<SingleRoom />} />
          <Route path="/halls" element={<Hall />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservations/user/:uid" element={<Profile />} />
          <Route path="/checkout" element={<PaymentComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
