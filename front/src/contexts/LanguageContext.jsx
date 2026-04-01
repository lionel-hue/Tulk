import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const LanguageContext = createContext();

export const translations = {
  fr: {
    settings: {
      title: 'Paramètres',
      language: 'Langue',
      theme: 'Thème',
      email_notifications: 'Notifications par email',
      save: 'Enregistrer les modifications',
      success: 'Paramètres mis à jour avec succès',
      dark: 'Sombre',
      light: 'Clair',
      en: 'Anglais',
      fr: 'Français',
      description: 'Personnalisez votre expérience sur Tulk.'
    },
    nav: {
      home: 'Accueil',
      messages: 'Messages',
      friends: 'Amis',
      profile: 'Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion'
    },
    profile: {
      edit: 'Modifier le profil',
      posts: 'Publications',
      friends: 'Amis',
      likes: 'J\'aime',
      following: 'Abonnements',
      followers: 'Abonnés'
    },
    friends: {
      suggestions: 'Suggestions',
      requests: 'Demandes',
      my_friends: 'Mes Amis',
      search: 'Rechercher des amis',
      accept: 'Accepter',
      decline: 'Refuser',
      add: 'Ajouter'
    },
    messages: {
      conversations: 'Conversations',
      groups: 'Groupes',
      no_messages: 'Aucun message pour le moment',
      type_placeholder: 'Écrivez votre message...'
    },
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      search: 'Rechercher...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      confirm: 'Confirmer'
    }
  },
  en: {
    settings: {
      title: 'Settings',
      language: 'Language',
      theme: 'Theme',
      email_notifications: 'Email Notifications',
      save: 'Save Changes',
      success: 'Settings updated successfully',
      dark: 'Dark',
      light: 'Light',
      en: 'English',
      fr: 'French',
      description: 'Customize your Tulk experience.'
    },
    nav: {
      home: 'Home',
      messages: 'Messages',
      friends: 'Friends',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout'
    },
    profile: {
      edit: 'Edit Profile',
      posts: 'Posts',
      friends: 'Friends',
      likes: 'Likes',
      following: 'Following',
      followers: 'Followers'
    },
    friends: {
      suggestions: 'Suggestions',
      requests: 'Requests',
      my_friends: 'My Friends',
      search: 'Search friends',
      accept: 'Accept',
      decline: 'Decline',
      add: 'Add'
    },
    messages: {
      conversations: 'Conversations',
      groups: 'Groups',
      no_messages: 'No messages yet',
      type_placeholder: 'Type your message...'
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      search: 'Search...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirm: 'Confirm'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const { user } = useAuth();
  const [lang, setLang] = useState(localStorage.getItem('tulk_lang') || 'fr');

  useEffect(() => {
    if (user?.lang) {
      setLang(user.lang);
      localStorage.setItem('tulk_lang', user.lang);
    }
  }, [user]);

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[lang];
    for (const key of keys) {
      if (result) result = result[key];
    }
    return result || path;
  };

  const switchLanguage = async (newLang) => {
    setLang(newLang);
    localStorage.setItem('tulk_lang', newLang);
    try {
      await api.put('/settings', { lang: newLang });
    } catch (error) {
      console.error('Failed to update language preference:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, t, switchLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
