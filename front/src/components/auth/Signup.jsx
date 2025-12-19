import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Import our custom api utility
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader2, CheckCircle, Wifi, WifiOff } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        mdp: '',
        confirmMdp: '',
        sexe: '',
        verificationCode: ''
    });
    const [currentStage, setCurrentStage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [verificationSent, setVerificationSent] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    // Enhanced error handler that properly handles network errors
    const handleApiError = (err) => {
        // Network errors (no internet, server down, etc.)
        if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED' || !err.response) {
            return {
                message: 'Problème de connexion internet. Veuillez vérifier votre connexion et réessayer.',
                isNetworkError: true
            };
        }

        // Axios timeout
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
            return {
                message: 'La requête a expiré. Veuillez vérifier votre connexion internet et réessayer.',
                isNetworkError: true
            };
        }

        // Server responded with error status
        if (err.response?.data?.errors) {
            const errorMessages = Object.values(err.response.data.errors).flat();
            return {
                message: errorMessages.join(', '),
                isNetworkError: false
            };
        }

        // Server responded with error message
        if (err.response?.data?.message) {
            return {
                message: err.response.data.message,
                isNetworkError: false
            };
        }

        // Fallback for unknown errors
        return {
            message: 'Une erreur inattendue est survenue. Veuillez réessayer.',
            isNetworkError: false
        };
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
        setSuccess('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Veuillez sélectionner une image valide');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('L\'image ne doit pas dépasser 5MB');
                return;
            }
            setProfileImage(file);
        }
    };

    const validateStage = (stage) => {
        switch (stage) {
            case 1:
                if (!formData.nom.trim() || !formData.email.trim()) {
                    setError('Veuillez remplir tous les champs obligatoires');
                    return false;
                }
                return true;
            case 2:
                if (!formData.mdp || !formData.confirmMdp) {
                    setError('Veuillez remplir tous les champs obligatoires');
                    return false;
                }
                if (formData.mdp.length < 6) {
                    setError('Le mot de passe doit contenir au moins 6 caractères');
                    return false;
                }
                if (formData.mdp !== formData.confirmMdp) {
                    setError('Les mots de passe ne correspondent pas');
                    return false;
                }
                return true;
            case 4:
                if (!formData.verificationCode || formData.verificationCode.length !== 6) {
                    setError('Veuillez entrer un code de vérification valide à 6 chiffres');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNextStage = async () => {
        if (validateStage(currentStage)) {
            // If moving to stage 4, send verification code
            if (currentStage === 3) {
                setSendingEmail(true);
                setError('');
                setSuccess('');
                try {
                    await api.post('/send-verification', {
                        email: formData.email,
                        name: formData.prenom || formData.nom
                    });
                    setVerificationSent(true);
                    setCurrentStage(currentStage + 1);
                } catch (err) {
                    const errorInfo = handleApiError(err);
                    setError(errorInfo.message);
                } finally {
                    setSendingEmail(false);
                }
            } else {
                setCurrentStage(currentStage + 1);
            }
        }
    };

    const handlePrevStage = () => {
        setCurrentStage(currentStage - 1);
        setError('');
        setSuccess('');
    };

    const handleResendCode = async () => {
        setSendingEmail(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/send-verification', {
                email: formData.email,
                name: formData.prenom || formData.nom
            });
            setSuccess('Code de vérification renvoyé avec succès!');
            setVerificationSent(true);
        } catch (err) {
            const errorInfo = handleApiError(err);
            setError(errorInfo.message);
        } finally {
            setSendingEmail(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!validateStage(4)) {
            setLoading(false);
            return;
        }

        try {
            // Optional: Pre-validate the code before registration
            try {
                const verifyResponse = await api.post('/verify-code', {
                    email: formData.email,
                    code: formData.verificationCode
                });
                
                if (!verifyResponse.data.verified) {
                    setError('Code de vérification invalide');
                    setLoading(false);
                    return;
                }
            } catch (verifyErr) {
                const errorInfo = handleApiError(verifyErr);
                setError(errorInfo.message);
                setLoading(false);
                return;
            }

            // Create FormData to handle file upload
            const submitData = new FormData();
            submitData.append('nom', formData.nom);
            submitData.append('prenom', formData.prenom);
            submitData.append('email', formData.email);
            submitData.append('mdp', formData.mdp);
            submitData.append('sexe', formData.sexe);
            submitData.append('verification_code', formData.verificationCode);
            
            if (profileImage) {
                submitData.append('image', profileImage);
            }

            // Use our api instance which has proper baseURL and auth headers
            const response = await api.post('/register', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Show success message instead of auto-login
            setSuccess('✅ Inscription réussie! Redirection vers la page de connexion...');
            
            // Wait 2 seconds to show the success message, then redirect to login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            const errorInfo = handleApiError(err);
            setError(errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    const renderProgressSteps = () => (
        <div className="flex justify-between mb-8 relative">
            <div className="absolute top-5 left-10 right-10 h-0.5 bg-[#262626] -z-10"></div>
            {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        step === currentStage 
                            ? 'bg-white border-white text-black' 
                            : step < currentStage 
                            ? 'bg-white border-white text-black'
                            : 'bg-[#262626] border-[#262626] text-gray-400'
                    }`}>
                        {step}
                    </div>
                    <span className={`text-xs mt-2 ${
                        step === currentStage ? 'text-white' : 'text-gray-400'
                    }`}>
                        {step === 1 ? 'Infos' : step === 2 ? 'Profil' : step === 3 ? 'Photo' : 'Code'}
                    </span>
                </div>
            ))}
        </div>
    );

    // Helper function to determine if error is network-related for styling
    const isNetworkError = (errorMessage) => {
        return errorMessage.includes('connexion internet') || errorMessage.includes('requête a expiré');
    };

    const renderStage = () => {
        switch (currentStage) {
            case 1:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Nom *
                            </label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                                placeholder="Entrez votre nom"
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                placeholder="Entrez votre prénom"
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Email *
                            </label>
                                <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="Entrez votre email"
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleNextStage}
                            className="w-full bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                        >
                            Suivant
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Mot de passe *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="mdp"
                                    value={formData.mdp}
                                    onChange={handleChange}
                                    required
                                    placeholder="Créez un mot de passe"
                                    className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Confirmer le mot de passe *
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmMdp"
                                    value={formData.confirmMdp}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirmez votre mot de passe"
                                    className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Sexe
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="sexe"
                                        value="M"
                                        checked={formData.sexe === 'M'}
                                        onChange={handleChange}
                                        className="text-white"
                                    />
                                    <span className="text-white">Masculin</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="sexe"
                                        value="F"
                                        checked={formData.sexe === 'F'}
                                        onChange={handleChange}
                                        className="text-white"
                                    />
                                    <span className="text-white">Féminin</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handlePrevStage}
                                className="flex-1 bg-[#262626] text-white py-3 px-4 rounded-md font-medium hover:bg-[#363636] transition-all duration-200"
                            >
                                Précédent
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStage}
                                className="flex-1 bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Photo de profil (optionnelle)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
                            />
                            {profileImage && (
                                <div className="mt-2 text-sm text-green-400">
                                    ✓ Image sélectionnée: {profileImage.name}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handlePrevStage}
                                className="flex-1 bg-[#262626] text-white py-3 px-4 rounded-md font-medium hover:bg-[#363636] transition-all duration-200"
                            >
                                Précédent
                            </button>
                            <button
                                type="button"
                                onClick={handleNextStage}
                                disabled={sendingEmail}
                                className="flex-1 bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {sendingEmail ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Envoi du code...
                                    </>
                                ) : (
                                    'Suivant'
                                )}
                            </button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <div className="bg-[#262626] border border-[#363636] rounded-lg p-4">
                            <p className="text-gray-400 text-sm">
                                Un code de vérification a été envoyé à <strong>{formData.email}</strong>. 
                                Veuillez entrer le code ci-dessous pour compléter votre inscription.
                            </p>
                            {verificationSent && (
                                <div className="mt-2 text-sm text-green-400 flex items-center gap-1">
                                    <CheckCircle className="h-4 w-4" />
                                    Code envoyé avec succès!
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Code de vérification *
                            </label>
                            <input
                                type="text"
                                name="verificationCode"
                                value={formData.verificationCode}
                                onChange={handleChange}
                                required
                                placeholder="Entrez le code à 6 chiffres"
                                maxLength={6}
                                className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={sendingEmail}
                            className="text-white text-sm underline hover:no-underline disabled:opacity-50 flex items-center gap-2"
                        >
                            {sendingEmail ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                'Renvoyer le code'
                            )}
                        </button>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={handlePrevStage}
                                className="flex-1 bg-[#262626] text-white py-3 px-4 rounded-md font-medium hover:bg-[#363636] transition-all duration-200"
                            >
                                Précédent
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-white text-black py-3 px-4 rounded-md font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Inscription...
                                    </>
                                ) : (
                                    'S\'inscrire'
                                )}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-[#141414] border border-[#262626] rounded-lg p-8 w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-2xl font-bold">
                        T
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Inscription</h1>
                    <p className="text-gray-400">Créez votre compte Tulk</p>
                </div>

                {/* Progress Steps */}
                {renderProgressSteps()}

                {/* Error Message */}
                {error && (
                    <div className={`${
                        isNetworkError(error) 
                            ? 'bg-yellow-500/10 border-yellow-500/20' 
                            : 'bg-red-500/10 border-red-500/20'
                    } border rounded-lg p-3 mb-4`}>
                        <p className={`${
                            isNetworkError(error) ? 'text-yellow-400' : 'text-red-400'
                        } text-sm flex items-center gap-2`}>
                            {isNetworkError(error) ? (
                                <WifiOff className="h-4 w-4" />
                            ) : (
                                <span>⚠️</span>
                            )}
                            {error}
                        </p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                        <p className="text-green-400 text-sm flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            {success}
                        </p>
                    </div>
                )}

                {/* Signup Form */}
                <form onSubmit={handleSubmit}>
                    {renderStage()}
                </form>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-[#262626] mt-6">
                    <p className="text-gray-400 text-sm">
                        Vous avez déjà un compte ?{' '}
                        <Link 
                            to="/login" 
                            className="text-white font-medium hover:underline transition-colors"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;