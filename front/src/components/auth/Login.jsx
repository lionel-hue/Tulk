import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/login', formData);
            login(response.data.access_token, response.data.user);
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060606] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Glass card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-500">
                            T
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Connexion</h1>
                        <p className="text-gray-500 text-sm font-medium">Bienvenue sur <span className="text-white font-bold">Tulk</span></p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                            <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="votre@email.com"
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold tracking-tight placeholder:text-gray-600 outline-none focus:ring-4 focus:ring-purple-500/20 focus:bg-white/8 focus:border-purple-500/30 transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold tracking-tight placeholder:text-gray-600 outline-none focus:ring-4 focus:ring-purple-500/20 focus:bg-white/8 focus:border-purple-500/30 transition-all pr-14"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="flex justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-xs font-bold text-gray-500 hover:text-purple-400 transition-colors tracking-wide"
                            >
                                Mot de passe oublié ?
                            </Link>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                            <div className="h-px bg-white/5" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-[#060606] px-4 text-gray-600 text-xs font-black uppercase tracking-widest">ou</span>
                            </div>
                        </div>

                        {/* Signup link */}
                        <p className="text-center text-sm text-gray-500 font-medium">
                            Pas encore de compte ?{' '}
                            <Link
                                to="/signup"
                                className="text-white font-black hover:text-purple-400 transition-colors"
                            >
                                S'inscrire
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;