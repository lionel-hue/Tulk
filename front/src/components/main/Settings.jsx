import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Moon, 
  Sun, 
  Bell, 
  Mail, 
  Check, 
  ChevronRight,
  Shield,
  Palette,
  Languages
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
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setEmailNotifications(!!user.email_notifications);
    }
  }, [user]);

  const handleToggleEmail = async () => {
    const newValue = !emailNotifications;
    setEmailNotifications(newValue);
    setSaving(true);
    try {
      const response = await api.put('/settings', { email_notifications: newValue });
      if (response.data.success) {
        setSuccess(true);
        if (setUser) setUser({ ...user, email_notifications: newValue });
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update email notifications:', error);
      setEmailNotifications(!newValue); // Revert on failure
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (newLang) => {
    if (newLang === lang) return;
    setSaving(true);
    try {
      await switchLanguage(newLang);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update language:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async () => {
    setSaving(true);
    try {
      await toggleTheme();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update theme:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="section-content active">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
            <Palette className="w-8 h-8 text-accent-primary" />
            {t('settings.title')}
          </h1>
          <p className="text-secondary">{t('settings.description')}</p>
        </div>

        <div className="grid gap-6">
          {/* Language Setting */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                  <Languages className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('settings.language')}</h3>
                  <p className="text-sm text-secondary">Choisissez votre langue d'affichage</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => handleLanguageChange('fr')}
                className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                  lang === 'fr' 
                  ? 'border-white bg-white text-black font-bold' 
                  : 'border-white/10 hover:border-white/30 text-secondary'
                }`}
              >
                <span className="text-xl">🇫🇷</span>
                <span>{t('settings.fr')}</span>
                {lang === 'fr' && <Check className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                  lang === 'en' 
                  ? 'border-white bg-white text-black font-bold' 
                  : 'border-white/10 hover:border-white/30 text-secondary'
                }`}
              >
                <span className="text-xl">🇬🇧</span>
                <span>{t('settings.en')}</span>
                {lang === 'en' && <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Theme Setting */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('settings.theme')}</h3>
                  <p className="text-sm text-secondary">Basculer entre le mode sombre et clair</p>
                </div>
              </div>
              <button 
                onClick={handleThemeChange}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-white/10 transition-colors focus:outline-none"
              >
                <span 
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Email Notifications */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500">
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('settings.email_notifications')}</h3>
                  <p className="text-sm text-secondary">Recevoir des alertes par email quand vous êtes hors ligne</p>
                </div>
              </div>
              <button 
                onClick={handleToggleEmail}
                disabled={saving}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                    emailNotifications ? 'bg-green-500' : 'bg-white/10'
                }`}
              >
                <span 
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          
          {/* Information & Support Placeholder */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-gray-500/10 text-gray-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sécurité & Confidentialité</h3>
                <p className="text-sm text-secondary">Gérez votre compte et vos données</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-not-allowed group">
                <span className="text-secondary group-hover:text-white transition-colors">Changer le mot de passe</span>
                <ChevronRight className="w-4 h-4 text-secondary/50" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-not-allowed group">
                <span className="text-secondary group-hover:text-white transition-colors">Deux factures d'authentification</span>
                <ChevronRight className="w-4 h-4 text-secondary/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        {success && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-2">
            <Check className="w-5 h-5" />
            {t('settings.success')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
