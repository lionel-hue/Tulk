import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ADD Router
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Chargement...</div>
            </div>
        );
    }
    
    return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Chargement...</div>
            </div>
        );
    }
    
    return !user ? children : <Navigate to="/home" />;
};

function AppRoutes() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } />
                <Route path="/signup" element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                } />
                <Route path="/home" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
        </div>
    );
}

export default function App() {
    return (
        <Router> {/* ADD THIS WRAPPER */}
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}