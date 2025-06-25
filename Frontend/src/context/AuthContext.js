import React, { createContext, useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const refreshAuthToken = async () => {
        try {
            const response = await axios.post('/refresh-token', {
                userId: localStorage.getItem('uid'),
            });
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            console.error('Error refreshing token:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Превръщаме в милисекунди
            const now = Date.now();

            if (exp - now < 5 * 60 * 1000) { // Ако остават по-малко от 5 минути
                refreshAuthToken();
            }
        }, 60 * 1000); // Проверка всяка минута

        return () => clearInterval(interval);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('uid', userData.id);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('uid');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ userEmail, setUserEmail, user, isAuthenticated, login, logout, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};
