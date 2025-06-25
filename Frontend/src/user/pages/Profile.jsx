import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Profile.css';

const Profile = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const userId = localStorage.getItem('uid');

                if (!userId || !localStorage.getItem('token')) {
                    setError('User not authenticated. Please log in again.');
                    navigate('/login'); 
                    return;
                }

                const response = await fetch(`/reservations/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }

                const data = await response.json();
                setReservations(data.reservations);
            } catch (error) {
                setError('Failed to load reservations. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) {
        return <div>Loading your profile...</div>;
    }

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>
            <h2>Your Reservations</h2>
            {reservations.length === 0 ? (
                <p>No reservations found.</p>
            ) : (
                <ul className='reservations-list'>
                    {reservations.map((reservation) => (
                        <li key={reservation._id}>
                            <h3>Rooms: {reservation.rooms.map(room => room.name).join(', ')}</h3>
                            <p>Total Price: {reservation.totalPrice} EUR</p>
                            <p>Reservation Code: {reservation._id}</p>
                            <p>Reservation Date: {new Date(reservation.dateOfReservation).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Profile;
