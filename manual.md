🚀 TULK CHAT APPLICATION - PROJECT MANUAL
📋 CRITICAL PROJECT CONSIDERATIONS & ARCHITECTURE
1. DATABASE SCHEMA - FRENCH NAMING CONVENTION

    ALL table names use French names with Capital first letter: Utilisateur, Article, Commentaire, Amitie, Message, Liker

    ALL column names use French abbreviations: id_uti, id_arti, statut, mdp, prenom, nom

    NO Laravel timestamps - Using custom date fields from original SQL

    Foreign keys follow French naming: id_uti_1, id_uti_2

2. MIGRATION ARCHITECTURE

    Migrations must EXACTLY match original SQL structure

    No automatic id bigint - Using integer('id', true) for exact int(255) match

    Foreign keys defined in SEPARATE migration to match SQL constraint order

    No timestamps() - Using custom timestamp fields from SQL

3. DATABASE TIMESTAMPS - IMPORTANT

    French tables don't have timestamps by default

    Add public $timestamps = false; to all French models

    This matches original SQL structure exactly

    Models affected: Utilisateur, Article, Commentaire, Amitie, Message, Liker

4. MIGRATION EXECUTION ORDER - CRITICAL

    create_utilisateur_table - Base user table

    create_article_table - Posts table

    create_commentaire_table - Comments table

    create_amitie_table - Friendships table

    create_message_table - Messages table

    create_liker_table - Likes table

    add_foreign_keys_to_french_tables - ALL constraints (MUST BE LAST)

🚨 DO NOT CHANGE THIS ORDER - Foreign keys depend on tables existing first!
5. API ROUTING IN LARAVEL 11+

    Routes in api.php auto-prefixed with /api

    NO leading slashes in route definitions

    Correct: Route::post('login', ...) → /api/login

    Incorrect: Route::post('/login', ...) → /api//login

    Clear cache after route changes: php artisan route:clear

6. FRONTEND-BACKEND INTEGRATION

    React.js frontend with Laravel API backend

    Axios for API calls

    React Router for navigation

    Tailwind CSS v4 with new @source directives (VS Code warnings are normal)

🔧 CURRENT IMPLEMENTATION STATUS
✅ COMPLETED AUTHENTICATION SYSTEM

    Multi-step Signup Form with progress indicators

    Email Verification with Gmail integration

    Profile Image Upload with storage management

    Password Visibility Toggle with eye icons

    Form Validation on both frontend and backend

    Loading States for all async operations

✅ BACKEND FEATURES

    Laravel Sanctum token authentication

    Email Service with beautiful templates

    File Upload with validation and storage

    Cache-based Verification Codes (10-minute expiry)

    French Database Schema fully implemented

✅ FRONTEND COMPONENTS

    Login Component with error handling

    Signup Component (4-step process)

    Auth Context for global state management

    Protected Routes with authentication checks

    Responsive Design with Tailwind CSS

🚧 CURRENTLY WORKING ON

    Chat interface components

    Friendship system

    Real-time messaging

    Post and comment features

🔐 AUTHENTICATION FLOW
Signup Process (4 Steps):

    Basic Info - Nom, Prénom, Email

    Profile Details - Password, Gender, Password confirmation

    Profile Image - Optional image upload with validation

    Email Verification - 6-digit code sent to email

Login Process:

    Email/password validation against Utilisateur table

    Sanctum token generation and storage

    Automatic redirect to protected home page

Email Verification:

    Codes stored in Laravel Cache with 10-minute expiry

    Beautiful HTML email templates with dark theme

    Gmail SMTP configuration with App Passwords

    Code validation before user registration

📧 EMAIL SYSTEM CONFIGURATION
Gmail Setup:
env

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tulksoft@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tulksoft@gmail.com
MAIL_FROM_NAME="Tulk Team"

Email Template:

    Location: resources/views/emails/verification.blade.php

    Dark-themed design matching app aesthetics

    Personalization with user name

    Clear verification code display

🗂️ FILE STRUCTURE & COMPONENTS
BACKEND (Laravel)
```

app/
├── Models/
│   └── Utilisateur.php (French user model)
├── Http/Controllers/
│   ├── AuthController.php
│   └── VerificationController.php
├── Mail/
│   └── VerificationCodeMail.php
routes/
├── api.php (API endpoints)
├── web.php (React entry point)
database/
├── migrations/ (French schema migrations)
└── seeders/
    └── UtilisateurSeeder.php
```


FRONTEND (React)
```

resources/js/
├── components/
│   ├── Login.jsx
│   ├── Signup.jsx (Multi-step form)
│   └── Home.jsx
├── contexts/
│   └── AuthContext.jsx (Authentication state)
├── App.jsx (Router configuration)
└── index.jsx (React entry point)
```


🎨 UI/UX SPECIFICATIONS
Color Scheme (Dark Theme)

    Background: #0a0a0a (black)

    Card: #141414 (dark gray)

    Border: #262626 (medium gray)

    Primary: #ffffff (white)

    Text: #ededed (light gray)

    Success: #10b981 (green)

    Error: #ef4444 (red)

Form Design:

    Multi-step progress indicators

    Real-time validation feedback

    Loading spinners for async operations

    Responsive design for all screen sizes

🛠️ TECHNICAL CONFIGURATION
Image Upload System:

    Storage: storage/app/public/images/

    Public Access: php artisan storage:link

    Validation: 5MB max, image types only

    Naming: Random 20-character filenames

Email Verification:

    Code Generation: 6-digit random numbers

    Storage: Laravel Cache with 10-minute TTL

    Resend functionality with cooldown

Security Features:

    Password hashing with bcrypt

    Sanctum token authentication

    Form validation on both client and server

    XSS protection with Laravel Blade

🚀 QUICK START COMMANDS
Development Servers:
bash

# Backend (Laravel)
php artisan serve

# Frontend (Vite)
npm run dev

Database Operations:
bash

# Run migrations
php artisan migrate

# Seed test users
php artisan db:seed --class=UtilisateurSeeder

# Create storage link for images
php artisan storage:link

Email Testing:
bash

# Test email configuration
php artisan tinker
Mail::raw('Test', fn($m) => $m->to('test@test.com')->subject('Test'))

Cache & Configuration:
bash

# Clear all caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

🧪 TESTING CREDENTIALS
Available Test Users:

    Regular User: jean@tulk.com / password123

    Admin User: admin@tulk.com / admin123

API Testing Endpoints:

    Login: POST /api/login

    Register: POST /api/register

    Send Verification: POST /api/send-verification

    Verify Code: POST /api/verify-code

Headers for API Calls:
json

{
  "Content-Type": "application/json",
  "Accept": "application/json"
}

🐛 KNOWN ISSUES & SOLUTIONS
Issue: VS Code CSS Warnings

    Problem: @source directives show as unknown rules

    Cause: Tailwind CSS v4 new syntax not recognized by editor

    Solution: Ignore warnings - they don't affect build

Issue: Email Sending Delays

    Problem: Gmail may have slight delays

    Solution: Use loading indicators and retry functionality

Issue: Image Upload Paths

    Problem: Images not accessible via URL

    Solution: Run php artisan storage:link and check permissions

🔄 UPDATE LOG
Latest Updates (November 25, 2025):

    ✅ Complete Authentication System with email verification

    ✅ Multi-step Signup Form with progress tracking

    ✅ Profile Image Upload with validation

    ✅ Gmail Integration for email verification

    ✅ Loading States and error handling

    ✅ Protected Routes with authentication checks

Next Features Planned:

    Chat interface with real-time messaging

    Friendship system and user search

    Post creation and commenting

    Like functionality for posts

    Real-time notifications

📞 SUPPORT & TROUBLESHOOTING
Common Setup Issues:

    Email Not Sending: Check Gmail App Password and .env configuration

    Images Not Loading: Verify storage link and file permissions

    Routes Not Working: Clear route cache and check bootstrap/app.php configuration

    Database Errors: Verify migration order and foreign key constraints

Debugging Tools:

    Laravel Logs: tail -f storage/logs/laravel.log

    Route List: php artisan route:list

    Database: php artisan tinker

Last Updated: November 25, 2025
Database: Tulk (French Schema)
Stack: Laravel 11 + React 18 + Tailwind CSS v4 + MySQL
Status: ✅ Authentication Complete → 🚧 Building Chat Features