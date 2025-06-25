import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (storedCart) {
            setCart(storedCart);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const fetchCart = async () => {

        const uid = localStorage.getItem('uid'); 
        const token = localStorage.getItem('token'); 

            if (!uid || !token) {
                console.error('User ID is missing');
                return;
            }

            try {
                setIsLoading(true);
                const response = await axios.get(`/cart/`, {
                    headers: { Authorization: `Bearer ${token}` },                 
                });
                setCart(response.data.items || []);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCart();
    }, []);

    const addToCart = async (item) => {
        const uid = localStorage.getItem('uid'); 
        const token = localStorage.getItem('token'); 
        
        if (!uid || !token) {
            console.error('User ID or token is missing');
            alert('Please log in to add items to your cart.');
            return;
        }

        try {
            const response = await axios.post(
                '/cart/',
                { 
                    roomId: item.roomId,
                    name: item.name,
                    price: item.price,
                    dates: item.dates,
                    guests: item.guests, },
                {
                    headers: { Authorization: `Bearer ${token}` }, 
                }
            );
            //setCart(response.data.cart.items || []);

            if (response.data && response.data.cart) {
                setCart(response.data.cart.items || []);
            } else {
                console.error('Unexpected response format:', response);
                alert('An error occurred. Please try again.');
            }

        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async ( roomId ) => {
        const uid = localStorage.getItem('uid'); 
        const token = localStorage.getItem('token'); 

        if (!uid) {
            console.error('User ID is missing');
            return;
        }

        try {
            const response = await axios.post(
                '/cart/remove',
                { roomId },
                {
                    headers: { Authorization: `Bearer ${token}` }, }
            );
            setCart(response.data.cart.items || []);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{ cart, setCart, isLoading, addToCart, removeFromCart, calculateTotal }}>
            {children}
        </CartContext.Provider>
    );
};
