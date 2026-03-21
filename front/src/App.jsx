    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { AuthProvider, useAuth } from './contexts/AuthContext';
    import Login from './components/auth/Login';
    import Signup from './components/auth/Signup';
    import Home from './components/main/Home';
    import './style/app.css';

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
                    {/* Home route with nested sections */}
                    <Route path="/home/*" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    {/* Individual section routes */}
                    <Route path="/feed" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/friends" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/notifications" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
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
            <Router>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </Router>
        );
    }