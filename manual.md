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
5. MIGRATION NAMING CONVENTIONS

    Table creation: create_[french_table_name]_table

    Foreign keys: add_constraints_to_french_schema (for bulk constraints)

    Single table modifications: add_foreign_to_[table]_table

    Use clear, descriptive names - avoid overly generic names

6. AUTHENTICATION & SECURITY

    Custom authentication required (not using Laravel's default users table)

    Password field: mdp (not password)

    User table: Utilisateur (not users)

    Role system: admin, mod, user enums preserved

    Laravel Sanctum for API token authentication

7. LARAVEL 11+ ROUTING CONFIGURATION

    Routes configured in bootstrap/app.php - not RouteServiceProvider

    Must include api: __DIR__.'/../routes/api.php' in withRouting()

    API routes use /api prefix automatically

    Run php artisan route:list to verify routes are loaded

8. API ROUTING IN LARAVEL 11+

    Routes in api.php auto-prefixed with /api

    Don't use leading slashes in route definitions

    Correct: Route::post('login', ...) → /api/login

    Incorrect: Route::post('/login', ...) → /api//login

    Clear cache after route changes: php artisan route:clear

9. API ROUTES & CSRF PROTECTION

    API routes go in routes/api.php - not web.php

    CSRF protection is disabled for API routes by default

    Use Sanctum tokens for API authentication

    419 errors mean CSRF protection is blocking the request

10. FRONTEND-BACKEND INTEGRATION

    React.js frontend with Laravel API backend

    Axios for API calls

    React Router for navigation

    Tailwind CSS v4 with new @source directives (VS Code warnings are normal)

11. CHAT FUNCTIONALITY ARCHITECTURE

    Direct messaging: User-to-user via Message table

    Friendship system: Amitie table with en attente and ami statuses

    Media support: image fields in Message and Article tables

    Social features: Posts (Article), Comments (Commentaire), Likes (Liker)

12. TECHNICAL STACK CONFIGURATION

    Laravel 11+ with custom French database schema

    React 18 with functional components and hooks

    Tailwind CSS v4 (new Vite plugin approach)

    MySQL/MariaDB with tulk database

    Vite build system with React plugin

13. DEVELOPMENT WORKFLOW

    Database first: SQL schema drives migrations

    French consistency: All models, controllers, relationships use French names

    API responses: Consistent JSON structure with French field names

    Error handling: Proper Laravel validation with French error messages

🔧 CURRENT IMPLEMENTATION STATUS
✅ COMPLETED SETUP

    Laravel project initialized with French database schema

    All migrations created and executed successfully

    Test users seeded (jean@tulk.com / password123)

    API routes configured and working

    React frontend with Login component

    Authentication endpoint /api/login working (200 status)

    Tailwind CSS v4 with custom dark theme

🚧 CURRENTLY WORKING ON

    Login component integration with backend

    Token-based authentication with Sanctum

    Protected routes in React

    Dashboard component after login

📋 NEXT PRIORITIES

    Implement Laravel Sanctum for token authentication

    Update AuthController to return proper tokens

    Connect React Login to handle token storage

    Create protected dashboard route

    Build chat interface components

🗂️ FILE STRUCTURE & COMPONENTS
BACKEND (Laravel)
text

app/
├── Models/
│   └── Utilisateur.php (French user model)
├── Http/Controllers/
│   └── AuthController.php
routes/
├── api.php (API endpoints)
├── web.php (React entry point)
database/
├── migrations/ (French schema migrations)
└── seeders/
    └── UtilisateurSeeder.php

FRONTEND (React)
text

resources/js/
├── components/
│   ├── Login.jsx (Current focus)
│   ├── Dashboard.jsx
│   └── Signup.jsx (Next)
├── App.jsx (Router configuration)
└── app.jsx (React entry point)

🔐 AUTHENTICATION FLOW
Current Login Process:

    React Login submits to /api/login

    AuthController validates credentials against Utilisateur table

    Returns user data (needs token implementation)

    React stores authentication state (in progress)

Required Updates:
php

// In AuthController - Add Sanctum tokens
$token = $user->createToken('auth_token')->plainTextToken;
return response()->json([
    'access_token' => $token,
    'user' => $user_data
]);

🎨 UI/UX SPECIFICATIONS
Color Scheme (Dark Theme)

    Background: #0a0a0a (black)

    Card: #141414 (dark gray)

    Border: #262626 (medium gray)

    Primary: #ffffff (white)

    Text: #ededed (light gray)

Components Status:

    Login.jsx: ✅ Complete (needs token integration)

    Dashboard.jsx: 🚧 Basic structure

    Signup.jsx: 📋 Not started

🐛 KNOWN ISSUES & SOLUTIONS
Issue: VS Code CSS Warnings

    Problem: @source directives show as unknown rules

    Cause: Tailwind CSS v4 new syntax not recognized by editor

    Solution: Ignore warnings - they don't affect build

Issue: Double API Prefix

    Problem: Routes showing as api/api/login

    Cause: Leading slash in route definition

    Solution: Use Route::post('login', ...) not Route::post('/login', ...)

Issue: Missing Timestamps

    Problem: updated_at column not found

    Cause: French tables don't have Laravel timestamps

    Solution: Add public $timestamps = false; to models

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

# Clear cache
php artisan route:clear && php artisan config:clear

Route Verification:
bash

# Check all registered routes
php artisan route:list

📞 TESTING CREDENTIALS
Available Test Users:

    Regular User: jean@tulk.com / password123

    Admin User: admin@tulk.com / admin123

API Testing Endpoints:

    Login: POST http://localhost:8000/api/login

    Headers: Content-Type: application/json

    Body: {"email": "jean@tulk.com", "password": "password123"}

🔄 UPDATE LOG
Latest Updates:

    ✅ API Routing: Fixed double prefix issue in routes/api.php

    ✅ Database: Test users seeded successfully

    ✅ Authentication: Login endpoint returning 200 status

    ✅ Frontend: React Login component ready for integration

Next Updates Planned:

    Implement Sanctum token authentication

    Connect React Login to store tokens

    Create authenticated dashboard

    Build chat interface components


Last Updated: November 24, 2025
Database: Tulk (French Schema)
Stack: Laravel 11 + React 18 + Tailwind CSS v4
Status: ✅ Backend API Working → 🔄 Frontend Integration