// client/src/contexts/UserContext.js - FINAL FIXED VERSION

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// 1. Custom Hook to consume the context
export const useAuth = () => useContext(AuthContext);

// Back-end API base URL (must match the one used in LoginPage/RegisterPage)
const API_URL = 'http://localhost:5000/api'; 

// 2. AuthProvider Component
export const AuthProvider = ({ children }) => {
    // 🔑 State initialization
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    // CRITICAL: Must be true initially to hold render until token is checked
    const [loading, setLoading] = useState(true); 
    const [authToken, setAuthToken] = useState(null); // New state to hold the JWT

    // ===================================================
    // AUTH LOGIC FUNCTIONS
    // ===================================================

    // Function to handle successful login from LoginPage.js
    const login = (token, userData) => {
        // 1. Store token in localStorage
        localStorage.setItem('token', token);
        
        // 2. Set default Authorization header for Axios for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 3. Update state
        setAuthToken(token);
        setUser(userData);
        setIsAuthenticated(true);
    };

    // Function to handle logout
    const logout = () => {
        // 1. Clear token from localStorage
        localStorage.removeItem('token');
        
        // 2. Clear default Authorization header from Axios
        delete axios.defaults.headers.common['Authorization'];

        // 3. Update state
        setAuthToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    // ===================================================
    // EFFECT: Check Auth Status on Mount (Prevents Flicker)
    // ===================================================
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user'); // Optional: store and retrieve user data

            if (token) {
                // Verify token is still valid by making a test request
                axios.get(`${API_URL}/auth/verify`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                .then(response => {
                    // Token is valid, set authenticated state
                    setAuthToken(token);
                    setIsAuthenticated(true);
                    
                    try {
                        setUser(storedUser ? JSON.parse(storedUser) : response.data.user || { 
                            firstName: response.data.firstName || 'User', 
                            lastName: response.data.lastName || '', 
                            fullName: response.data.name || 'User',
                            id: response.data.id || 'N/A' 
                        });
                    } catch (e) {
                        setUser({ 
                            firstName: 'User', 
                            lastName: '', 
                            fullName: 'User',
                            id: 'N/A' 
                        });
                    }
                    
                    // Set the Axios default header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                })
                .catch(error => {
                    // Token is invalid or expired, clear everything
                    console.log('Token verification failed, clearing auth state');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    delete axios.defaults.headers.common['Authorization'];
                    setAuthToken(null);
                    setIsAuthenticated(false);
                    setUser(null);
                })
                .finally(() => {
                    setLoading(false);
                });
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        };

        checkAuthStatus();
        // NOTE: We don't verify the token with the server here to keep it simple.
        // A robust app would make an API call (e.g., /api/auth/me) to verify the token.
    }, []); 
    
    // ===================================================
    // CONTEXT VALUE
    // ===================================================
    const value = {
        isAuthenticated,
        user,
        loading,
        authToken,
        login,
        logout,
    };

    // 3. Render a loading screen or null if still checking auth status
    // This is used by ProtectedRoute.js to prevent rendering until auth status is known.
    if (loading) {
        return <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            fontSize: '24px'
        }}>
            Loading authentication status...
        </div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};