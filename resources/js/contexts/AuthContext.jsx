    import React, { createContext, useState, useContext, useEffect } from 'react';

    const AuthContext = createContext();

    export const useAuth = () => {
        const context = useContext(AuthContext);
        if (!context) {
            throw new Error('useAuth must be used within an AuthProvider');
        }
        return context;
    };

    export const AuthProvider = ({ children }) => {
        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem('auth_token');
            const userData = localStorage.getItem('user');

            if (token && userData) {
                setUser(JSON.parse(userData));
            }
            setLoading(false);
        }, []);


        const login = (token, userData) => {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        };

        const logout = () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setUser(null);
        };

        const value = {
            user,
            login,
            logout,
            loading
        };

        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        );
    };