import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Check,
  ChevronRight,
  Shield,
  Palette,
  Languages,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';

const Settings = () => {
  const { t, lang, switchLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();

  const [emailNotifications, setEmailNotifications] = useState(user?.email_notifications ?? true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.two_factor_enabled ?? false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Password change state
  const [pwData, setPwData] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setEmailNotifications(!!user.email_notifications);
      setTwoFactorEnabled(!!user.two_factor_enabled);
    }
  }, [user]);

  const showToast = (msg, isErr = false) => {
    if (isErr) setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  };

  const handleToggleEmail = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    setSaving(true);
    try {
      await api.put('/settings', { email_notifications: newValue });
      if (setUser) setUser({ ...user, email_notifications: newValue });
      showToast(t('settings.success'));
    } catch {
      setEmailNotifications(!newValue);
      showToast('Erreur de mise à jour.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2fa = async () => {
    const newValue = !twoFactorEnabled;
    setTwoFactorEnabled(newValue);
    setSaving(true);
    try {
      await api.put('/settings', { two_factor_enabled: newValue });
      if (setUser) setUser({ ...user, two_factor_enabled: newValue });
      showToast(newValue ? '2FA activé. Un code sera requis à chaque connexion.' : '2FA désactivé.');
    } catch {
      setTwoFactorEnabled(!newValue);
      showToast('Erreur de mise à jour.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (newLang) => {
    if (newLang === lang) return;
    setSaving(true);
    try {
      await switchLanguage(newLang);
      showToast(t('settings.success'));
    } catch {
      showToast('Erreur de mise à jour.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async () => {
    setSaving(true);
    try {
      await toggleTheme();
      showToast(t('settings.success'));
    } catch {
      showToast('Erreur de mise à jour.', true);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwData.new_password !== pwData.new_password_confirmation) {
      setPwError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (pwData.new_password.length < 8) {
      setPwError('Le nouveau mot de passe doit comporter au moins 8 caractères.');
      return;
    }
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      const res = await api.post('/settings/change-password', pwData);
      if (res.data.success) {
        setPwSuccess('Mot de passe modifié ! Un e-mail de confirmation a été envoyé. 🔐');
        setPwData({ current_password: '', new_password: '', new_password_confirmation: '' });
      }
    } catch (err) {
      setPwError(err.response?.data?.message || 'Erreur de mise à jour.');
    } finally {
      setPwLoading(false);
    }
  };

  const ToggleSwitch = ({ value, onToggle, color = 'green' }) => (
    <button
      onClick={onToggle}
      disabled={saving}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
        value ? (color === 'green' ? 'bg-green-500' : 'bg-purple-600') : 'bg-white/10'
      }`}
    >
      <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${value ? 'translate-x-7' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="section-content active">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Palette className="w-8 h-8 text-purple-500" />
            {t('settings.title')}
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>{t('settings.description')}</p>
        </div>

        <div className="grid gap-6">
          {/* ── Language ── */}
          <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500"><Languages className="w-6 h-6" /></div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{t('settings.language')}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Choisissez votre langue d'affichage</p>
              </div>
            </div>
            <div className="flex gap-4">
              {[['fr', '🇫🇷'], ['en', '🇬🇧']].map(([code, flag]) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    lang === code
                      ? 'border-white bg-white text-black font-bold'
                      : 'border-white/10 hover:border-white/30 text-secondary'
                  }`}
                  style={lang !== code ? { color: 'var(--text-secondary)' } : {}}
                >
                  <span className="text-xl">{flag}</span>
                  <span>{t(`settings.${code}`)}</span>
                  {lang === code && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* ── Theme ── */}
          <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{t('settings.theme')}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {theme === 'dark' ? 'Mode sombre actif' : 'Mode clair actif'}
                  </p>
                </div>
              </div>
              <ToggleSwitch value={theme === 'dark'} onToggle={handleThemeChange} color="purple" />
            </div>
          </div>

          {/* ── Email Notifications ── */}
          <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500"><Bell className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{t('settings.email_notifications')}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Recevoir des alertes quand vous êtes hors ligne</p>
                </div>
              </div>
              <ToggleSwitch value={emailNotifications} onToggle={handleToggleEmail} />
            </div>
          </div>

          {/* ── Two-Factor Auth ── */}
          <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${twoFactorEnabled ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Authentification à 2 facteurs</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {twoFactorEnabled ? '✅ Activée — un code email requis à chaque connexion' : 'Renforcez la sécurité de votre compte'}
                  </p>
                </div>
              </div>
              <ToggleSwitch value={twoFactorEnabled} onToggle={handleToggle2fa} />
            </div>
          </div>

          {/* ── Change Password ── */}
          <div className="p-6 rounded-2xl border backdrop-blur-xl" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400"><Lock className="w-6 h-6" /></div>
              <div>
                <h3 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>Changer le mot de passe</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Un e-mail de confirmation sera envoyé</p>
              </div>
            </div>

            {pwError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4">
                <p className="text-red-400 text-sm font-medium">⚠️ {pwError}</p>
              </div>
            )}
            {pwSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4">
                <p className="text-green-400 text-sm font-medium">{pwSuccess}</p>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { key: 'current_password', label: 'Mot de passe actuel', field: 'current' },
                { key: 'new_password', label: 'Nouveau mot de passe', field: 'new' },
                { key: 'new_password_confirmation', label: 'Confirmer le nouveau mot de passe', field: 'confirm' },
              ].map(({ key, label, field }) => (
                <div key={key}>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</label>
                  <div className="relative">
                    <input
                      type={showPw[field] ? 'text' : 'password'}
                      value={pwData[key]}
                      onChange={(e) => { setPwData({ ...pwData, [key]: e.target.value }); setPwError(''); }}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-xl border pr-12 outline-none transition-all text-sm font-medium"
                      style={{
                        background: 'var(--bg-input)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw({ ...showPw, [field]: !showPw[field] })}
                      className="absolute inset-y-0 right-3 flex items-center"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {showPw[field] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
              >
                {pwLoading ? <><Loader2 size={16} className="animate-spin" /> Mise à jour...</> : 'Modifier le mot de passe'}
              </button>
            </form>
          </div>
        </div>

        {/* Toast */}
        {(success || error) && (
          <div className={`fixed bottom-8 right-8 px-6 py-3 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-2 ${
            error ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {error ? '⚠️' : <Check className="w-5 h-5" />}
            {error || success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
