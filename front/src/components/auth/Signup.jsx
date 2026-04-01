import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, CheckCircle, WifiOff, Upload } from 'lucide-react'
import api from '../../utils/api'
import { useAuth } from '../../contexts/AuthContext'

const Signup = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mdp: '',
    confirmMdp: '',
    sexe: '',
    verificationCode: ''
  })
  const [currentStage, setCurrentStage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [verificationSent, setVerificationSent] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleApiError = err => {
    if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED' || !err.response) {
      return { message: 'Problème de connexion internet. Veuillez vérifier votre connexion et réessayer.', isNetworkError: true }
    }
    if (err.response?.data?.errors) {
      return { message: Object.values(err.response.data.errors).flat().join(', '), isNetworkError: false }
    }
    if (err.response?.data?.message) {
      return { message: err.response.data.message, isNetworkError: false }
    }
    return { message: 'Une erreur inattendue est survenue. Veuillez réessayer.', isNetworkError: false }
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSuccess('')
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) { setError('Veuillez sélectionner une image valide'); return }
      if (file.size > 5 * 1024 * 1024) { setError("L'image ne doit pas dépasser 5MB"); return }
      setProfileImage(file)
    }
  }

  const validateStage = stage => {
    switch (stage) {
      case 1:
        if (!formData.nom.trim() || !formData.email.trim()) { setError('Veuillez remplir tous les champs obligatoires'); return false }
        return true
      case 2:
        if (!formData.mdp || !formData.confirmMdp) { setError('Veuillez remplir tous les champs obligatoires'); return false }
        if (formData.mdp.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return false }
        if (formData.mdp !== formData.confirmMdp) { setError('Les mots de passe ne correspondent pas'); return false }
        return true
      case 4:
        if (!formData.verificationCode || formData.verificationCode.length !== 6) { setError('Veuillez entrer un code de vérification valide à 6 chiffres'); return false }
        return true
      default:
        return true
    }
  }

  const handleNextStage = async () => {
    if (validateStage(currentStage)) {
      if (currentStage === 3) {
        setSendingEmail(true)
        setError('')
        try {
          await api.post('/send-verification', { email: formData.email, name: formData.prenom || formData.nom })
          setVerificationSent(true)
          setCurrentStage(currentStage + 1)
        } catch (err) {
          setError(handleApiError(err).message)
        } finally {
          setSendingEmail(false)
        }
      } else {
        setCurrentStage(currentStage + 1)
      }
    }
  }

  const handlePrevStage = () => { setCurrentStage(currentStage - 1); setError(''); setSuccess('') }

  const handleResendCode = async () => {
    setSendingEmail(true)
    setError('')
    try {
      await api.post('/send-verification', { email: formData.email, name: formData.prenom || formData.nom })
      setSuccess('Code de vérification renvoyé avec succès!')
      setVerificationSent(true)
    } catch (err) {
      setError(handleApiError(err).message)
    } finally {
      setSendingEmail(false)
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    if (!validateStage(4)) { setLoading(false); return }
    try {
      try {
        const verifyResponse = await api.post('/verify-code', { email: formData.email, code: formData.verificationCode })
        if (!verifyResponse.data.verified) { setError('Code de vérification invalide'); setLoading(false); return }
      } catch (verifyErr) {
        setError(handleApiError(verifyErr).message)
        setLoading(false)
        return
      }
      const submitData = new FormData()
      submitData.append('nom', formData.nom)
      submitData.append('prenom', formData.prenom)
      submitData.append('email', formData.email)
      submitData.append('mdp', formData.mdp)
      submitData.append('sexe', formData.sexe)
      submitData.append('verification_code', formData.verificationCode)
      if (profileImage) submitData.append('image', profileImage)
      await api.post('/register', submitData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess('✅ Inscription réussie! Redirection vers la connexion...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(handleApiError(err).message)
    } finally {
      setLoading(false)
    }
  }

  const isNetworkErr = msg => msg.includes('connexion internet') || msg.includes('requête a expiré')

  const inputClass = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold tracking-tight placeholder:text-gray-600 outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all"

  const steps = ['Infos', 'Profil', 'Photo', 'Code']

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Nom *</label>
              <input type='text' name='nom' value={formData.nom} onChange={handleChange} required placeholder='Entrez votre nom' className={inputClass} />
            </div>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Prénom</label>
              <input type='text' name='prenom' value={formData.prenom} onChange={handleChange} placeholder='Entrez votre prénom' className={inputClass} />
            </div>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Email *</label>
              <input type='email' name='email' value={formData.email} onChange={handleChange} required placeholder='votre@email.com' className={inputClass} />
            </div>
            <button type='button' onClick={handleNextStage} className='w-full bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'>
              Suivant →
            </button>
          </div>
        )
      case 2:
        return (
          <div className='space-y-4'>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Mot de passe *</label>
              <div className='relative'>
                <input type={showPassword ? 'text' : 'password'} name='mdp' value={formData.mdp} onChange={handleChange} required placeholder='Créez un mot de passe (min. 6 caractères)' className={`${inputClass} pr-14`} />
                <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors'>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Confirmer *</label>
              <div className='relative'>
                <input type={showConfirmPassword ? 'text' : 'password'} name='confirmMdp' value={formData.confirmMdp} onChange={handleChange} required placeholder='Confirmez votre mot de passe' className={`${inputClass} pr-14`} />
                <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)} className='absolute inset-y-0 right-0 pr-5 flex items-center text-gray-500 hover:text-white transition-colors'>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Sexe</label>
              <div className='flex gap-4'>
                {['M', 'F'].map(val => (
                  <label key={val} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border cursor-pointer transition-all font-bold text-sm ${formData.sexe === val ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'}`}>
                    <input type='radio' name='sexe' value={val} checked={formData.sexe === val} onChange={handleChange} className='hidden' />
                    {val === 'M' ? '♂ Masculin' : '♀ Féminin'}
                  </label>
                ))}
              </div>
            </div>
            <div className='flex gap-3'>
              <button type='button' onClick={handlePrevStage} className='flex-1 bg-white/5 border border-white/10 text-gray-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all'>←</button>
              <button type='button' onClick={handleNextStage} className='flex-1 bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all hover:scale-[1.02]'>Suivant →</button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className='space-y-5'>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Photo de profil <span className='text-gray-600 normal-case font-medium'>(optionnelle)</span></label>
              <label className={`${inputClass} flex items-center gap-4 cursor-pointer py-5 border-dashed hover:border-purple-500/30 hover:bg-purple-500/5 transition-all`}>
                <Upload size={20} className='text-gray-500 flex-shrink-0' />
                <span className='text-gray-500 font-medium text-sm'>
                  {profileImage ? <span className='text-green-400 font-bold'>✓ {profileImage.name}</span> : 'Choisir une photo...'}
                </span>
                <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' />
              </label>
            </div>
            <div className='flex gap-3'>
              <button type='button' onClick={handlePrevStage} className='flex-1 bg-white/5 border border-white/10 text-gray-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all'>←</button>
              <button type='button' onClick={handleNextStage} disabled={sendingEmail} className='flex-1 bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2'>
                {sendingEmail ? <><Loader2 size={16} className='animate-spin' />Envoi...</> : 'Suivant →'}
              </button>
            </div>
          </div>
        )
      case 4:
        return (
          <div className='space-y-4'>
            <div className='bg-white/5 border border-white/10 rounded-2xl p-5'>
              <p className='text-gray-400 text-sm font-medium leading-relaxed'>
                Un code de vérification a été envoyé à <strong className='text-white'>{formData.email}</strong>
              </p>
              {verificationSent && (
                <div className='mt-3 text-sm text-green-400 flex items-center gap-2 font-bold'>
                  <CheckCircle size={16} />
                  Code envoyé avec succès!
                </div>
              )}
            </div>
            <div>
              <label className='block text-xs font-black uppercase tracking-widest text-gray-500 mb-3'>Code de vérification *</label>
              <input
                type='text'
                name='verificationCode'
                value={formData.verificationCode}
                onChange={handleChange}
                required
                placeholder='000000'
                maxLength={6}
                className={`${inputClass} text-center text-2xl tracking-[0.5em] font-black`}
              />
            </div>
            <button type='button' onClick={handleResendCode} disabled={sendingEmail} className='text-gray-500 hover:text-purple-400 text-xs font-bold uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 transition-colors'>
              {sendingEmail ? <><Loader2 size={12} className='animate-spin' />Envoi...</> : '↺ Renvoyer le code'}
            </button>
            <div className='flex gap-3'>
              <button type='button' onClick={handlePrevStage} className='flex-1 bg-white/5 border border-white/10 text-gray-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all'>←</button>
              <button type='submit' disabled={loading} className='flex-1 bg-white text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-gray-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2'>
                {loading ? <><Loader2 size={16} className='animate-spin' />Inscription...</> : "S'inscrire ✓"}
              </button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-[#060606] flex items-center justify-center p-4 relative overflow-hidden'>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className='relative w-full max-w-md'>
        <div className='bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]'>

          {/* Logo */}
          <div className='flex justify-center mb-6'>
            <div className='w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl hover:scale-110 hover:rotate-6 transition-all duration-500'>
              T
            </div>
          </div>

          {/* Header */}
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-black text-white tracking-tight mb-1'>Inscription</h1>
            <p className='text-gray-500 text-sm font-medium'>Créez votre compte <span className='text-white font-bold'>Tulk</span></p>
          </div>

          {/* Progress Steps */}
          <div className='flex justify-between mb-8 relative'>
            <div className='absolute top-5 left-0 right-0 h-px bg-white/5 -z-10' />
            {steps.map((label, i) => {
              const step = i + 1
              const isCompleted = step < currentStage
              const isActive = step === currentStage
              return (
                <div key={step} className='flex flex-col items-center gap-2'>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${
                    isActive ? 'bg-white text-black border-white shadow-lg scale-110' :
                    isCompleted ? 'bg-white/20 text-white border-white/40' :
                    'bg-white/5 text-gray-600 border-white/10'
                  }`}>
                    {isCompleted ? '✓' : step}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-600'}`}>{label}</span>
                </div>
              )
            })}
          </div>

          {/* Error */}
          {error && (
            <div className={`${isNetworkErr(error) ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-red-500/10 border-red-500/20'} border rounded-2xl p-4 mb-5`}>
              <p className={`${isNetworkErr(error) ? 'text-yellow-400' : 'text-red-400'} text-sm font-medium flex items-center gap-2`}>
                {isNetworkErr(error) ? <WifiOff size={16} /> : '⚠️'}
                {error}
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className='bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-5'>
              <p className='text-green-400 text-sm font-bold flex items-center gap-2'>
                <CheckCircle size={16} />
                {success}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>{renderStage()}</form>

          {/* Login Link */}
          <div className='relative my-6'>
            <div className='h-px bg-white/5' />
          </div>
          <p className='text-center text-sm text-gray-500 font-medium'>
            Vous avez déjà un compte ?{' '}
            <Link to='/login' className='text-white font-black hover:text-purple-400 transition-colors'>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
