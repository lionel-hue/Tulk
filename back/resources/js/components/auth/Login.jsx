import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/login', formData);
            
            // Use the auth context to login
            login(response.data.access_token, response.data.user);
            
            // Redirect to home 
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-8 w-full max-w-md shadow-lg animate-fade-in">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-2xl font-bold shadow-lg hover:scale-110 hover:rotate-6 transition-transform duration-300">
                        T
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Connexion</h1>
                    <p className="text-gray-400">Bienvenue sur Tulk</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Entrez votre email"
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Entrez votre mot de passe"
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end">
                        <Link 
                            to="/forgot-password" 
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    {/* Signup Link */}
                    <div className="text-center pt-4 border-t border-[#262626]">
                        <p className="text-gray-400 text-sm">
                            Pas encore de compte ?{' '}
                            <Link 
                                to="/signup" 
                                className="text-white font-medium hover:underline transition-colors"
                            >
                                S'inscrire
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;