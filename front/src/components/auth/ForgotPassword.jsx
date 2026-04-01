import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import api from '../../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError("Veuillez entrer votre adresse email.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await api.post('/forgot-password', { email });
            setSent(true);
        } catch (err) {
            const msg = err.response?.data?.message;
            // Show success even if email not found (security best practice)
            if (err.response?.status === 404) {
                setSent(true);
            } else {
                setError(msg || 'Une erreur est survenue. Veuillez réessayer.');
            }
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
                {/* Back to login */}
                <Link
                    to="/login"
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-sm font-bold group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Retour à la connexion
                </Link>

                {/* Glass card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">

                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl">
                            T
                        </div>
                    </div>

                    {!sent ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-black text-white tracking-tight mb-2">Mot de passe oublié</h1>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                    Entrez votre email et nous vous enverrons<br />
                                    un lien pour réinitialiser votre mot de passe.
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                                    <p className="text-red-400 text-sm font-medium">⚠️ {error}</p>
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                            required
                                            placeholder="votre@email.com"
                                            className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold tracking-tight placeholder:text-gray-600 outline-none focus:ring-4 focus:ring-purple-500/20 focus:bg-white/8 focus:border-purple-500/30 transition-all"
                                        />
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Envoyer le lien'
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* Success state */
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={36} className="text-green-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight mb-3">Email envoyé !</h2>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                                Si un compte est associé à <span className="text-white font-bold">{email}</span>,
                                vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
                            </p>
                            <p className="text-gray-600 text-xs font-medium mb-6">
                                Vérifiez également votre dossier spam.
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center gap-2 bg-white text-black py-3 px-8 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]"
                            >
                                <ArrowLeft size={16} />
                                Retour à la connexion
                            </Link>
                        </div>
                    )}

                    {/* Footer link */}
                    {!sent && (
                        <p className="text-center mt-8 text-sm text-gray-500 font-medium">
                            Vous vous souvenez de votre mot de passe ?{' '}
                            <Link to="/login" className="text-white font-black hover:text-purple-400 transition-colors">
                                Se connecter
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
