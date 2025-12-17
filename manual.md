# 🚀 TULK CHAT APPLICATION - PROJECT MANUAL

## 📋 CRITICAL PROJECT CONSIDERATIONS & ARCHITECTURE

### 1. DATABASE SCHEMA - FRENCH NAMING CONVENTION
- **ALL table names** use French names with Capital first letter: `Utilisateur`, `Article`, `Commentaire`, `Amitie`, `Message`, `Liker`
- **ALL column names** use French abbreviations: `id_uti`, `id_arti`, `statut`, `mdp`, `prenom`, `nom`
- **NO Laravel timestamps** - Using custom date fields from original SQL
- **Foreign keys** follow French naming: `id_uti_1`, `id_uti_2`

### 2. MIGRATION ARCHITECTURE
- Migrations must EXACTLY match original SQL structure
- No automatic id bigint - Using `integer('id', true)` for exact `int(255)` match
- Foreign keys defined in SEPARATE migration to match SQL constraint order
- No `timestamps()` - Using custom timestamp fields from SQL

### 3. DATABASE TIMESTAMPS - IMPORTANT
- French tables don't have timestamps by default
- Add `public $timestamps = false;` to all French models
- This matches original SQL structure exactly
- **Models affected**: `Utilisateur`, `Article`, `Commentaire`, `Amitie`, `Message`, `Liker`

### 4. MIGRATION EXECUTION ORDER - CRITICAL
1. `create_utilisateur_table` - Base user table
2. `create_article_table` - Posts table
3. `create_commentaire_table` - Comments table
4. `create_amitie_table` - Friendships table
5. `create_message_table` - Messages table
6. `create_liker_table` - Likes table (NO date column - French schema)
7. `add_foreign_keys_to_french_tables` - ALL constraints (MUST BE LAST)

🚨 **DO NOT CHANGE THIS ORDER** - Foreign keys depend on tables existing first!

### 5. COMPONENT ARCHITECTURE
- **Header Component**: Navigation bar with search, notifications, and user profile
- **SideMenuNav Component**: Mobile sidebar navigation with user profile and menu items (NO SEARCH)
- **Home Component**: Main content area with section-based layout (Feed, Profile, Friends, Messages, Notifications, Dashboard)
- **Modal Component**: Reusable modal system for alerts, confirmations, and forms
- **Separation of Concerns**: Each component handles its own state and functionality while maintaining consistent design

### 6. NAVIGATION SYSTEM UPDATES
- **Header**: Removed (T) logo, added side menu button in ALL views (desktop, mobile, tablet)
- **SideMenuNav**: Moved logo to side menu, covers entire viewport (top: 0), added X close button
- **Z-index Fixed**: Side menu (60) > Overlay (50) > Profile dropdown (45) > Header (40)
- **Professional Layout**: Side menu appears above header when opened, creating modern app experience

### 7. API ROUTING IN LARAVEL 11+
- Routes in `api.php` auto-prefixed with `/api`
- **NO leading slashes** in route definitions
- **Correct**: `Route::post('login', ...)` → `/api/login`
- **Incorrect**: `Route::post('/login', ...)` → `/api//login`
- Clear cache after route changes: `php artisan route:clear`

### 8. ARCHITECTURE TYPE: MONOLITHIC LARAVEL + REACT (CRITICAL)
**IMPORTANT**: This project uses a **MONOLITHIC ARCHITECTURE** where:
- React is **EMBEDDED** inside Laravel using Vite
- There is **NO separate React app** - everything is in `resources/js/`
- Laravel serves both API endpoints AND the React frontend
- Vite development server proxies API calls to avoid CORS issues
- In production, Laravel serves compiled React assets

**NEVER DO THESE (Will Break App):**
- ❌ Don't create a separate React project
- ❌ Don't move React code outside Laravel
- ❌ Don't use `create-react-app` or similar
- ❌ Don't treat frontend/backend as separate services
- ❌ Don't change API URL construction logic
- ❌ Don't hardcode IP addresses in frontend code

### 9. FRONTEND-BACKEND INTEGRATION
- React.js frontend with Laravel API backend
- Axios for API calls with enhanced error handling
- React Router for navigation
- Tailwind CSS v4 with custom dark theme
- Component-based architecture with proper separation

---

## 🔧 CURRENT IMPLEMENTATION STATUS

### ✅ COMPLETED AUTHENTICATION SYSTEM
- **Multi-step Signup Form** with progress indicators
- **Email Verification** with Gmail integration
- **Profile Image Upload** with storage management
- **Password Visibility Toggle** with eye icons
- **Form Validation** on both frontend and backend
- **Loading States** for all async operations
- **Enhanced Error Handling** with network error detection
- **Success Flow** with auto-redirect to login

### ✅ BACKEND FEATURES
- **Laravel Sanctum** token authentication
- **Email Service** with beautiful templates
- **File Upload** with validation and storage
- **Cache-based Verification Codes** (10-minute expiry)
- **French Database Schema** fully implemented
- **Laravel Factories** for test data generation
- **Post CRUD Operations** with feed, create, and delete functionality
- **Like System** with toggle functionality
- **Comment System** with full CRUD operations

### ✅ FRONTEND COMPONENTS
- **Login Component** with comprehensive error handling
- **Signup Component** (4-step process)
- **Auth Context** for global state management
- **Protected Routes** with authentication checks
- **Header Component** with navigation and search
- **SideMenuNav Component** for mobile navigation (NO SEARCH)
- **Home Component** with multiple sections and integrated post CRUD, like, comment, and delete
- **Modal Component** for alerts and confirmations
- **Responsive Design** with Tailwind CSS
- **Network Error Detection** with visual indicators
- **API Utility** with Axios instance and interceptors

### ✅ NAVIGATION UPDATES
- **Professional Side Menu**: Covers entire viewport with proper z-index hierarchy
- **Logo Placement**: Moved from header to side menu for cleaner design
- **Universal Menu Button**: Available in all views (desktop, mobile, tablet)
- **X Close Button**: Added for professional side menu closing

### ✅ POST FUNCTIONALITY IMPLEMENTED
- **Real-time Post Creation**: Users can create posts that save to database
- **Dynamic Feed**: Shows user's posts + friends' posts from API
- **Like System**: Toggle like/unlike with real-time count updates
- **Comment System**: View and add comments to posts
- **Post Deletion**: Users can delete their own posts with confirmation
- **Professional Image Display**: Post images with proper sizing and responsive design
- **Proper Error Handling**: Network and validation errors with user feedback
- **Loading States**: Visual feedback during API operations

### ✅ IMAGE MANAGEMENT SYSTEM
- **Profile Images**: Users can upload profile pictures during signup
- **Post Images**: Users can add images to posts with preview functionality
- **Image Storage**: Secure file storage with validation and public access
- **Real-time Previews**: Image preview before posting with remove option
- **Fallback Avatars**: User initials displayed when no profile image exists
- **Correct Storage Path**: Images stored in `storage/app/public/images/`
- **Proper URL Generation**: Frontend correctly constructs image URLs via `getImageUrl()` utility

### ✅ FRIENDS SYSTEM (AMITIE) - FULLY IMPLEMENTED

#### Search Integration in Friends Section:
- **Contextual Search**: Header search adapts to current section (friends section: "Rechercher des amis...")
- **Real-time Search**: Instant user search with 500ms debounce for optimal performance
- **Smart Filtering**: When searching in friends section, temporarily clears main content to show search results
- **Focus Management**: Search input loses focus or clears → automatically restores original content
- **Escape Key Support**: Press ESC to clear search and return to normal view

#### Friends Display System:
- **Three Tabs**:
  - **Amis**: Current friends list with profile images
  - **Suggestions**: Friend suggestions based on mutual friends algorithm
  - **Demandes**: Pending friend requests management
- **Real-time Updates**: Automatic refresh after friend actions (add/remove/accept)
- **Mutual Friends**: Suggestions ranked by number of mutual friends for better relevance
- **Visual Indicators**: Clear status badges (Friend, Pending, No relationship)

#### Friend Management Features:
- **Send Friend Requests**: One-click friend request sending
- **Accept/Reject Requests**: Handle incoming friend requests with confirmation dialogs
- **Remove Friends**: Delete friendships with confirmation dialog
- **Cancel Requests**: Cancel pending friend requests
- **Search Results Actions**: Perform friend actions directly from search results
- **Message Friends**: Quick message button for existing friends

#### Database Structure for Amitie:
- **Composite Primary Key**: `id_1` and `id_2` together form the primary key
- **Status Enum**: `'en attente'` (pending) or `'ami'` (friend)
- **Bidirectional Relationships**: Friendship works both ways (user1 ↔ user2)
- **No Auto-increment**: Model uses `$incrementing = false` for composite keys

#### API Endpoints for Friends:
```javascript
GET /api/friends - Get current user's friends list
GET /api/friends/suggestions - Get friend suggestions based on mutual friends
GET /api/friends/pending - Get pending friend requests
GET /api/friends/search?query=... - Search for users
POST /api/friends/request - Send friend request
POST /api/friends/accept - Accept friend request
POST /api/friends/remove - Remove friend or cancel request
```

#### User Experience Flow:
1. **Finding Friends**:
   - Navigate to Friends section
   - Use header search to find users
   - View search results with friendship status
   - Add friends directly from search

2. **Managing Friendships**:
   - View current friends in "Amis" tab
   - Accept/reject requests in "Demandes" tab
   - Discover new friends in "Suggestions" tab

3. **Search States**:
   - **Normal State**: Shows friends/suggestions/pending tabs
   - **Search Active**: Shows only search results, clears other content
   - **Search Complete**: Returns to normal state when search clears
   - **Error State**: Shows error message if search fails

#### Mutual Friends Algorithm:
- **Suggestion Ranking**: Users with most mutual friends appear first
- **Exclusion Logic**: Excludes current user and existing friends
- **Performance Optimized**: Limits to 10 suggestions with efficient queries
- **Real-time Updates**: Suggestions update as friendships change

#### Security Features:
- **Friendship Validation**: Prevents duplicate friend requests
- **Authorization**: Users can only manage their own friendships
- **Input Validation**: All user IDs validated against database
- **Self-friendship Prevention**: Users cannot friend themselves
- **Status Validation**: Ensures valid status transitions

#### Performance Optimizations:
- **Debounced Search**: 500ms delay prevents excessive API calls
- **Eager Loading**: Loads user data with friendships
- **Limited Results**: Suggestions limited to 10, search to 20
- **Lazy Loading**: Images load on demand
- **Component Memoization**: Prevents unnecessary re-renders

#### Future Enhancements Planned:
- **Real-time notifications** for friend requests
- **Friend groups** and custom lists
- **Friend activity feed** integration
- **Bulk friend management** actions
- **Advanced friend search** filters

#### Integration Points:
- **Notifications**: Friend request notifications
- **Messages**: Quick message from friend list
- **Profile**: Mutual friends display on profiles
- **Feed**: Priority for friend content in feed

**Friends Section Status**: ✅ COMPLETELY INTEGRATED  
**Search Integration**: ✅ FULLY FUNCTIONAL  
**Database Support**: ✅ COMPOSITE KEYS IMPLEMENTED  
**API Endpoints**: ✅ ALL ENDPOINTS TESTED  
**User Experience**: ✅ SMOOTH SEARCH TRANSITIONS  
**Error Handling**: ✅ COMPREHENSIVE ERROR STATES  

### 🚧 FUTURE FEATURES
- Real-time messaging
- Notification system
- Advanced search and discovery features
- Admin dashboard with user management
- Moderation tools for content management
- Post editing functionality
- Multiple image upload for posts
- Image cropping and editing features

---

## 🔐 AUTHENTICATION FLOW

### Signup Process (4 Steps):
1. **Basic Info** - Nom, Prénom, Email
2. **Profile Details** - Password, Gender, Password confirmation
3. **Profile Image** - Optional image upload with validation
4. **Email Verification** - 6-digit code sent to email

### Login Process:
- Email/password validation against Utilisateur table
- Sanctum token generation and storage
- Automatic redirect to protected home page

### Email Verification:
- Codes stored in Laravel Cache with 10-minute expiry
- Beautiful HTML email templates with dark theme
- Gmail SMTP configuration with App Passwords
- Code validation before user registration

### Success Flow:
- **2-second success display** after registration
- **Auto-redirect to login** instead of auto-login
- **Clear visual feedback** with checkmark icons

---

## 🖼️ IMAGE MANAGEMENT SYSTEM - CRITICAL UPDATES

### Storage Architecture:
```
CORRECT STRUCTURE:
storage/app/public/images/              # Actual storage location
public/storage → symlink to storage/app/public   # Created by php artisan storage:link

WRONG STRUCTURE (AVOID):
storage/app/public/public/images/      # Nested public directory (incorrect)
```

### Image Upload Process:
1. **Frontend**: User selects image → preview shown → FormData created with image file
2. **Backend**: `PostController::createPost()` receives the image
3. **Storage**: `$image->store('images', 'public')` saves to `storage/app/public/images/`
4. **Database**: Path stored as `'images/filename.jpg'` (relative to storage/app/public)
5. **Frontend Display**: `getImageUrl()` converts to full URL: `http://localhost:8000/storage/images/filename.jpg`

### Profile Images:
- **Upload**: During signup (optional) and profile editing
- **Storage**: `storage/app/public/images/` with unique filenames
- **Display**: Profile pictures show in header, posts, and profile sections
- **Fallback**: User initials in gradient circle when no image exists
- **Validation**: 5MB max size, JPEG/PNG/JPG/GIF formats

### Post Images:
- **Upload**: When creating posts with preview functionality
- **Preview**: Real-time image preview with remove option (X button)
- **Validation**: Same as profile images (5MB max, image formats)
- **Display**: Professional sizing (max-height: 500px) with responsive design
- **Professional Aspect**: Images maintain aspect ratio with `object-fit: contain`

### Image URL System:
- **Storage URLs**: `http://localhost:8000/storage/images/filename.jpg`
- **Public Access**: Enabled via `php artisan storage:link`
- **Utility Function**: `getImageUrl()` handles all path conversions
- **Fallback System**: Graceful degradation to initials when images missing

### Critical Fixes Applied:
1. **Storage Symlink**: Must be created with `php artisan storage:link`
2. **Permissions**: `chmod -R 755 storage/app/public` required
3. **Path Consistency**: Store only `'images/filename.jpg'` in database
4. **Frontend URL Construction**: Use `getImageUrl()` utility function

### Image Components:
- **Header**: User profile picture in dropdown and navigation
- **Post Creation**: User avatar in post composer
- **Feed Posts**: Author avatars and professionally sized post images
- **Profile Page**: Large profile picture and banner area
- **Comments**: User avatars in comment threads

---

## 🏠 HOME PAGE SECTIONS - ENHANCED WITH SOCIAL FEATURES

### Feed Section (Fil d'actualités) - COMPLETE SOCIAL FEATURES
- **Add Post Card**: Functional post creation with text input, image upload, and publish button
- **Image Preview**: Real-time image preview with remove functionality
- **Posts Feed**: Timeline of user's posts and friends' posts with real data from API
- **Profile Images**: User avatars displayed for all posts
- **Post Images**: Professional image display with max-height: 500px
- **Post Interactions**:
  - **Like System**: Heart icon toggles like/unlike with real-time count
  - **Comment System**: Message icon toggles comment section
  - **Delete Post**: Trash icon (only shown on user's own posts)
- **Comment Features**:
  - View all comments for a post
  - Add new comments with Enter key or submit button
  - Real-time comment count updates
  - User avatars in comments
- **Real-time Updates**: Live post loading and creation without page refresh

### Profile Section
- **Profile Header**: User banner, avatar with image support, and basic information
- **User Statistics**: Dynamic counts for posts, friends, likes, and comments
- **Role Badge**: Visual indicator of user role (Admin/Mod/User)
- **Profile Posts**: User's personal posts feed with all social features
- **Edit Profile**: Profile modification interface with image upload

### Friends Section (COMPLETE)
- **Three-tab Interface**: Amis, Suggestions, Demandes
- **Friend Requests**: Incoming friendship requests management with accept/reject
- **Friends List**: Grid of user's friends with profile images and quick actions
- **Find Friends**: Search and discovery functionality with mutual friends indicators
- **Friend Management**: Add/remove friends and manage relationships with confirmation dialogs

### Messages Section
- **Conversations List**: Sidebar with active conversations and user avatars
- **Chat Interface**: Main messaging area with real-time updates
- **Message Input**: Rich text and file sharing capabilities
- **User Status**: Online/offline indicators and typing indicators

### Notifications Section
- **Notification List**: Chronological list of user notifications
- **Notification Types**: Likes, comments, friend requests, mentions
- **Mark as Read**: Bulk and individual read status management
- **Notification Settings**: Customizable notification preferences

### Dashboard Section (Admin/Mod Only)
- **User Management**: User list with role management and profile images
- **Platform Analytics**: Usage statistics and metrics
- **Content Moderation**: Reported content management
- **System Overview**: Platform health and performance metrics

---

## 🎯 COMPLETED FEATURES

### ✅ Like System - FULLY IMPLEMENTED
```javascript
// API Endpoints Implemented:
POST /api/posts/{id}/like - Like/unlike post
// Returns: { success: boolean, liked: boolean, likes_count: number }
```

**Features:**
- Toggle like/unlike with single click
- Real-time like count updates
- Heart icon fills when liked (red color)
- Visual feedback with color change

### ✅ Comment System - FULLY IMPLEMENTED
```javascript
// API Endpoints Implemented:
GET /api/posts/{id}/comments - Get post comments
POST /api/posts/{id}/comments - Add comment
// Returns: { success: boolean, comment: object, comments_count: number }
```

**Features:**
- View comments by clicking comment button
- Add comments with Enter key or submit button
- User avatars in comments
- Real-time comment count updates
- Scrollable comments section

### ✅ Post Deletion - FULLY IMPLEMENTED
```javascript
// API Endpoints Implemented:
DELETE /api/posts/{post} - Delete post
// Returns: { success: boolean, message: string }
```

**Features:**
- Delete button only shown on user's own posts
- Confirmation modal before deletion
- Automatic cleanup of associated likes and comments
- Image file deletion from storage

### ✅ Professional Image Display
- **Max Height**: 500px (400px on mobile)
- **Aspect Ratio**: Maintained with `object-fit: contain`
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Graceful fallback on image load failure
- **Preview System**: Real-time image preview before posting

### ✅ Friends System - FULLY IMPLEMENTED
```javascript
// API Endpoints Implemented:
GET /api/friends - Get friends list
GET /api/friends/suggestions - Get friend suggestions
GET /api/friends/pending - Get pending requests
GET /api/friends/search?query=... - Search users
POST /api/friends/request - Send friend request
POST /api/friends/accept - Accept friend request
POST /api/friends/remove - Remove friend/cancel request
```

**Features:**
- Three-tab interface (Friends, Suggestions, Pending)
- Contextual search with real-time results
- Mutual friends algorithm for suggestions
- Complete friend management with confirmation dialogs
- Integrated with header search system

---

## 🛡️ ENHANCED ERROR HANDLING SYSTEM

### Network Error Detection:
- **No Internet**: "Problème de connexion internet. Veuillez vérifier votre connexion et réessayer."
- **Timeout**: "La requête a expiré. Veuillez vérifier votre connexion internet et réessayer."
- **Server Unreachable**: Clear network error messages

### Visual Error Indicators:
- **Red Theme**: Standard validation errors (email taken, invalid code, etc.)
- **Yellow Theme**: Network-related errors with WiFi off icon
- **Green Theme**: Success messages with checkmark icons

### Error Types Handled:
- ✅ Network connectivity issues
- ✅ Request timeouts
- ✅ Server validation errors
- ✅ Email delivery failures
- ✅ File upload errors
- ✅ Database constraints
- ✅ Component rendering errors
- ✅ Route navigation errors
- ✅ API authentication errors
- ✅ Post creation and loading errors
- ✅ Image upload and validation errors
- ✅ Like/comment operation errors
- ✅ Post deletion errors (permission checks)
- ✅ Friend request/management errors
- ✅ Search functionality errors

---

## 🏭 LARAVEL FACTORIES IMPLEMENTATION

### Factory Usage:
- **Test Data Generation**: Realistic French names and data
- **Database Seeding**: Quick population of development database
- **Testing**: Consistent data for automated tests

### Available Factories:
- `UtilisateurFactory` - French user data with states (admin, male, female)
- `ArticleFactory` - Blog posts with French content and images
- `CommentaireFactory` - Comments with relationships
- `AmitieFactory` - Friendship relationships with composite keys

### Factory Features:
- **French Data**: Authentic French names, cities, and content
- **States**: Predefined variations (admin users, specific genders)
- **Relationships**: Automatic relationship creation
- **Faker Integration**: Realistic randomized data
- **Image Support**: Profile pictures and post images

---

## 📧 EMAIL SYSTEM CONFIGURATION

### Gmail Setup:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tulksoft@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tulksoft@gmail.com
MAIL_FROM_NAME="Tulk Team"
```

### Email Template:
- Location: `resources/views/emails/verification.blade.php`
- Dark-themed design matching app aesthetics
- Personalization with user name
- Clear verification code display

---

## 🗂️ UPDATED FILE STRUCTURE & COMPONENTS

### BACKEND (Laravel)
```
app/
├── Models/
│   ├── Utilisateur.php (HasApiTokens trait, image relationships)
│   ├── Article.php (With likes, comments, utilisateur relationships)
│   ├── Commentaire.php (With utilisateur, article relationships)
│   ├── Amitie.php (Friendship relationships - composite keys)
│   ├── Message.php
│   └── Liker.php (Like relationships - NO date column)
├── Http/Controllers/
│   ├── AuthController.php (Image upload support)
│   ├── VerificationController.php
│   ├── PostController.php (Complete: create, feed, like, comment, delete)
│   ├── AmitieController.php (Complete friend management)
│   ├── UserController.php
│   └── MessageController.php
├── Mail/
│   └── VerificationCodeMail.php
routes/
├── api.php (API endpoints with social features + friends)
├── web.php (React entry point)
database/
├── factories/
│   ├── UtilisateurFactory.php
│   ├── ArticleFactory.php
│   └── CommentaireFactory.php
├── migrations/ (French schema migrations + personal_access_tokens)
└── seeders/
    └── UtilisateurSeeder.php
```

### FRONTEND (React) - UPDATED
```
resources/js/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx (Image upload)
│   ├── main/
│   │   ├── Home.jsx (COMPLETE: posts, likes, comments, delete, images)
│   │   ├── Header.jsx (Profile images + integrated search)
│   │   ├── SideMenuNav.jsx (No search feature)
│   │   ├── Amitie.jsx (Complete friends section)
│   │   └── Modal.jsx (Confirm dialogs)
│   └── shared/
│       ├── Loader.jsx
│       └── ErrorBoundary.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useModal.js
├── utils/
│   ├── api.js (Axios instance with interceptors)
│   ├── validation.js
│   └── imageUrls.js (CRITICAL: getImageUrl() function)
├── App.jsx
└── index.jsx
```

---

## 🎨 UI/UX SPECIFICATIONS

### Color Scheme (Dark Theme)
- **Background**: `#0a0a0a` (black)
- **Card**: `#141414` (dark gray)
- **Border**: `#262626` (medium gray)
- **Primary**: `#ffffff` (white)
- **Text**: `#ededed` (light gray)
- **Secondary Text**: `#9ca3af` (gray-400)
- **Success**: `#10b981` (green)
- **Error**: `#ef4444` (red)
- **Warning**: `#f59e0b` (yellow)
- **Accent**: `#3b82f6` (blue)
- **Like Active**: `#ef4444` (red)
- **Friend Status**: Green (ami), Yellow (pending), Default (no relation)

### Typography Scale
- **Headers**: 1.5rem - 2rem (bold)
- **Body Text**: 0.875rem - 1rem (normal)
- **Small Text**: 0.75rem - 0.875rem
- **Line Height**: 1.5 - 1.75

### Component Design:
- **Border Radius**: 0.5rem (medium), 0.75rem (large)
- **Shadow**: Subtle shadows for depth
- **Transition**: 0.2s ease-in-out for all interactions
- **Spacing**: Consistent 0.25rem increments

### Responsive Breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Icon System:
- ✅ **Success**: `CheckCircle` (green)
- ⚠️ **Errors**: `AlertCircle` (red)
- 📶 **Network**: `WifiOff` (yellow)
- 👁️ **Password**: `Eye/EyeOff` toggle
- 🔄 **Loading**: `Loader2` spinner
- 👤 **User**: `User` icon
- 🔔 **Notifications**: `Bell` icon
- 💬 **Messages**: `MessageCircle` icon
- 👥 **Friends**: `Users` icon
- 📊 **Dashboard**: `LayoutDashboard` icon
- 🖼️ **Images**: `Image` icon
- 📷 **Camera**: `Camera` icon
- ❌ **Remove**: `X` icon
- ❤️ **Like**: `Heart` icon (filled when active)
- 🗑️ **Delete**: `Trash2` icon
- 💬 **Comment**: `MessageCircle` icon
- 🤝 **Friend Actions**: `UserPlus`, `UserCheck`, `UserX`, `Clock`

---

## 🛠️ TECHNICAL CONFIGURATION - UPDATED

### ARCHITECTURE & DEVELOPMENT SETUP

#### **Monolithic Architecture (CRITICAL)**
- **React is embedded in Laravel** via Vite, not a separate application
- **Single `.env` file** for both frontend and backend configuration
- **Vite development server** proxies API calls to avoid CORS
- **Production builds** are served directly by Laravel

#### **Development Configuration:**

**1. `.env` File (Standard Development):**
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:your-key-here
APP_DEBUG=true
APP_URL=http://localhost:8000  # MUST match Laravel server URL
```

**2. Vite Configuration (`vite.config.js`):**
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/index.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],

    server: {
        host: 'localhost',  // Use localhost for standard development
        port: 5173,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // Proxy configuration to avoid CORS
        proxy: {
            '/api': {
                target: 'http://localhost:8000',  // Laravel server
                changeOrigin: true,
                secure: false,
            },
            '/storage': {
                target: 'http://localhost:8000',  // Laravel server
                changeOrigin: true,
                secure: false,
            }
        }
    },
});
```

**3. Mobile/Network Testing Configuration:**

Create `vite.config.mobile.js` for mobile testing:
```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// Replace with your computer's local IP address
const YOUR_LOCAL_IP = '192.168.1.100'; // Find with: hostname -I or ipconfig

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/index.jsx'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
    ],

    server: {
        host: YOUR_LOCAL_IP,  // Use your local IP for network access
        port: 5173,
        cors: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // Proxy to Laravel running on network
        proxy: {
            '/api': {
                target: `http://${YOUR_LOCAL_IP}:8000`,
                changeOrigin: true,
                secure: false,
            },
            '/storage': {
                target: `http://${YOUR_LOCAL_IP}:8000`,
                changeOrigin: true,
                secure: false,
            }
        }
    },
});
```

#### **Development Commands:**

**Standard Development (Localhost only):**
```bash
# Terminal 1: Laravel Server
php artisan serve --host=localhost --port=8000

# Terminal 2: Vite Development Server
npm run dev

# Access at: http://localhost:5173
```

**Mobile/Network Testing:**
```bash
# 1. Find your local IP address
hostname -I  # Linux/Mac
# or
ipconfig | findstr "IPv4"  # Windows

# 2. Update YOUR_LOCAL_IP in vite.config.mobile.js

# Terminal 1: Laravel Server (Network Accessible)
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2: Vite with Mobile Config
npm run dev:mobile  # Configure package.json script

# Access from computer: http://localhost:5173
# Access from phone: http://YOUR_LOCAL_IP:5173
```

#### **Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "dev:mobile": "vite --config vite.config.mobile.js",
    "build": "vite build",
    "dev:full": "concurrently \"php artisan serve --port=8000\" \"vite\"",
    "start:mobile": "concurrently \"php artisan serve --host=0.0.0.0 --port=8000\" \"npm run dev:mobile\""
  }
}
```

#### **Image URL Configuration:**

**`getImageUrl()` Utility (Standard):**
```javascript
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    if (imagePath.startsWith('/storage/')) {
        return imagePath;  // Vite will proxy this
    }
    
    return `/storage/${imagePath}`;  // Vite will proxy this
};
```

**Mobile Testing Notes:**
1. **Phone must be on same Wi-Fi network** as your computer
2. **Firewall may block connections** - allow ports 5173 and 8000
3. **Use `0.0.0.0` for Laravel** to accept network connections
4. **Update `YOUR_LOCAL_IP`** in mobile config file
5. **Clear browser cache** on phone after updates

#### **Security Notes:**
- Never commit hardcoded IP addresses to repository
- Mobile testing exposes dev server to local network only
- Use environment variables for sensitive configuration
- Disable mobile testing when not needed

### API Configuration:
- **Base URL**: `/api` (proxied through Vite in development)
- **Timeout**: 10 seconds
- **Authentication**: Bearer tokens with automatic header injection
- **Error Handling**: Global interceptors for network and server errors
- **Content Type**: JSON for most requests, multipart/form-data for file uploads

### Image Upload System - CRITICAL UPDATES:
- **Storage**: `storage/app/public/images/` (NOT nested public directory)
- **Public Access**: `php artisan storage:link` creates symlink
- **Validation**: 5MB max, image types only (JPEG, PNG, JPG, GIF)
- **Naming**: `time()_uniqueid.extension` format
- **Database Storage**: Store only `'images/filename.jpg'` (relative path)
- **URL Construction**: Use `getImageUrl()` utility in frontend

### Email Verification:
- **Code Generation**: 6-digit random numbers
- **Storage**: Laravel Cache with 10-minute TTL
- **Resend functionality** with cooldown
- **Rate Limiting**: Maximum 3 attempts per code

### Security Features:
- Password hashing with bcrypt
- Sanctum token authentication
- Form validation on both client and server
- XSS protection with Laravel Blade
- CSRF protection for web routes
- Rate limiting on authentication endpoints
- Secure file upload validation
- SQL injection protection with Eloquent
- **Post Deletion**: Permission checks (users can only delete their own posts)
- **Friendship Validation**: Prevents self-friending and duplicate requests
- **Authorization**: Users can only manage their own friendships

### Error Handling Architecture:
- **Frontend**: Axios interceptors with network detection
- **Backend**: Laravel validation with French messages
- **Visual**: Color-coded error states with icons
- **User Experience**: Clear, actionable error messages
- **Logging**: Comprehensive error logging and monitoring

### Performance Optimization:
- **Lazy Loading**: Component and image lazy loading
- **Code Splitting**: Route-based code splitting
- **Caching**: API response caching where appropriate
- **Optimized Assets**: Compressed images and minified code
- **Efficient Queries**: Optimized database queries with indexes
- **Image Optimization**: Automatic compression and responsive sizing
- **Debounced Search**: 500ms delay for friend search
- **Limited Results**: Friends suggestions limited to 10, search to 20

---

## 🚀 QUICK START COMMANDS - UPDATED

### Development Servers:
```bash
# Standard Development (Localhost only)
php artisan serve --host=localhost --port=8000
npm run dev

# Mobile/Network Testing
php artisan serve --host=0.0.0.0 --port=8000
npm run dev:mobile  # Requires vite.config.mobile.js setup

# Both with process manager (standard)
npm run dev:full

# Mobile testing with process manager
npm run start:mobile
```

### Database Operations:
```bash
# Run migrations (INCLUDES personal_access_tokens)
php artisan migrate

# Seed test users
php artisan db:seed --class=UtilisateurSeeder

# Create storage link for images (CRITICAL - MUST RUN)
php artisan storage:link

# Generate test data with factories
php artisan db:seed

# Reset and reseed database
php artisan migrate:fresh --seed
```

### Storage Setup - CRITICAL:
```bash
# Fix storage permissions and structure
chmod -R 755 storage/app/public
chmod -R 755 public/storage

# Ensure correct directory structure
mkdir -p storage/app/public/images

# Remove incorrect nested directories if they exist
rm -rf storage/app/public/public 2>/dev/null || true
```

### Email Testing:
```bash
# Test email configuration
php artisan tinker
Mail::raw('Test', fn($m) => $m->to('test@test.com')->subject('Test'))

# Preview email templates
php artisan vendor:publish --tag=laravel-mail
```

### Cache & Configuration:
```bash
# Clear all caches (run after major changes)
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Optimize application
php artisan optimize

# Cache routes and config for production
php artisan config:cache
php artisan route:cache
```

### Factory Commands:
```bash
# Create a factory
php artisan make:factory UtilisateurFactory

# Generate test data
php artisan tinker
Utilisateur::factory()->count(10)->create()

# Generate specific user types
Utilisateur::factory()->admin()->create()
Utilisateur::factory()->withPosts(3)->create()

# Generate test friendships
App\Models\Amitie::create([
    'id_1' => 1,
    'id_2' => 2,
    'statut' => 'ami'
])
```

### Frontend Development:
```bash
# Install dependencies
npm install

# Development build
npm run dev

# Production build
npm run build

# Code linting
npm run lint

# Type checking (if using TypeScript)
npm run type-check
```

---

## 🧪 TESTING CREDENTIALS

### Available Test Users:
- **Regular User**: sissolionel@gmail.com / 123456
- **Admin User**: admin@tulk.com / admin123 (if created)
- **Moderator User**: mod@tulk.com / mod123 (if created)

### API Testing Endpoints:
- **Authentication**:
  - `POST /api/login`
  - `POST /api/register`
  - `POST /api/send-verification`
  - `POST /api/verify-code`
- **Posts**:
  - `GET /api/posts/feed`
  - `POST /api/posts` (supports multipart/form-data)
  - `DELETE /api/posts/{post}`
- **Interactions**:
  - `POST /api/posts/{id}/like`
  - `GET /api/posts/{id}/comments`
  - `POST /api/posts/{id}/comments`
- **Friends**:
  - `GET /api/friends`
  - `GET /api/friends/suggestions`
  - `GET /api/friends/pending`
  - `GET /api/friends/search?query=...`
  - `POST /api/friends/request`
  - `POST /api/friends/accept`
  - `POST /api/friends/remove`

### Headers for API Calls:
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Authorization": "Bearer {token}"
}
```

### File Upload Headers:
```json
{
  "Content-Type": "multipart/form-data",
  "Authorization": "Bearer {token}"
}
```

### Factory Test Data:
```php
// Generate test users
Utilisateur::factory()->count(20)->create();

// Generate admin user
Utilisateur::factory()->admin()->create();

// Generate users with posts
Utilisateur::factory()
    ->has(Article::factory()->count(3))
    ->create();

// Generate friends relationships
Amitie::factory()->count(50)->create();

// Generate messages
Message::factory()->count(100)->create();
```

---

## 🐛 KNOWN ISSUES & SOLUTIONS - UPDATED

### Issue: Image Upload Fails with "Image was not saved to disk"
- **Problem**: Images weren't being saved to correct location
- **Root Cause**: Incorrect storage path in PostController
- **Solution**: Use `$image->store('images', 'public')` instead of custom path logic

### Issue: Liker Table Column Not Found Error
- **Problem**: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'date'`
- **Root Cause**: Liker table doesn't have date column (French schema)
- **Solution**: Remove `'date' => now()` from Liker creation in PostController

### Issue: Images Not Displaying After Upload
- **Problem**: Database had image paths but files didn't exist
- **Root Cause**: Files saved to wrong location or not saved at all
- **Solution**:
  1. Clean database: `UPDATE Article SET image = NULL WHERE image IS NOT NULL`
  2. Fix PostController storage logic
  3. Ensure `php artisan storage:link` is run

### Issue: Nested Public Directory
- **Problem**: `storage/app/public/public/` directory created
- **Root Cause**: Incorrect path construction in old PostController
- **Solution**: Remove nested directory and use correct storage path

### Issue: Amitie Composite Key Errors
- **Problem**: Friendships not saving or retrieving correctly
- **Root Cause**: Missing composite key configuration in Amitie model
- **Solution**: Add `protected $primaryKey = ['id_1', 'id_2'];` and `public $incrementing = false;`

### Issue: Friends Routes Not Working
- **Problem**: Friends section shows blank or returns 401
- **Root Cause**: Routes placed outside sanctum middleware
- **Solution**: Move friends routes inside `Route::middleware('auth:sanctum')->group()`

### Issue: Search Not Working in Friends Section
- **Problem**: Search doesn't show results or doesn't clear
- **Root Cause**: Search state management issues
- **Solution**: Ensure proper state handling and debouncing in Amitie.jsx

### Issue: VS Code CSS Warnings
- **Problem**: `@source` directives show as unknown rules
- **Cause**: Tailwind CSS v4 new syntax not recognized by editor
- **Solution**: Ignore warnings - they don't affect build

### Issue: Email Sending Delays
- **Problem**: Gmail may have slight delays
- **Solution**: Use loading indicators and retry functionality

### Issue: Network Error Detection
- **Problem**: Some network conditions not caught
- **Solution**: Enhanced Axios error interceptor covers most cases

### Issue: Factory Data Not French Enough
- **Problem**: Generated data may not match French context
- **Solution**: Extend Faker with French-specific data providers

### Issue: Mobile Menu Overlay
- **Problem**: Side menu doesn't close properly on navigation
- **Solution**: Automatic close on route change with useEffect

### Issue: Responsive Layout
- **Problem**: Layout breaks on very small screens
- **Solution**: Additional breakpoint at 320px with adjusted padding

### Issue: Sanctum Token Table Missing
- **Problem**: `personal_access_tokens` table doesn't exist
- **Solution**: Run Sanctum migrations: `php artisan migrate`

### Issue: Mobile Testing - Can't Connect from Phone
- **Problem**: Phone can't access development server
- **Solution**:
  1. Ensure phone is on same Wi-Fi network
  2. Check firewall allows ports 5173 and 8000
  3. Use correct local IP address in vite.config.mobile.js
  4. Run Laravel with `--host=0.0.0.0`

### Issue: Images Not Loading on Mobile
- **Problem**: Images show broken on phone but work on computer
- **Solution**: Ensure Vite proxy configuration is correct in mobile config file

---

## 🔄 UPDATE LOG - MAJOR MILESTONES

### Latest Updates (Current):
- ✅ **Complete Authentication System** with email verification
- ✅ **Multi-step Signup Form** with progress tracking
- ✅ **Profile Image Upload** with validation and storage
- ✅ **Gmail Integration** for email verification
- ✅ **Enhanced Error Handling** with network detection
- ✅ **Success Flow** with auto-redirect to login
- ✅ **Laravel Factories** for test data generation
- ✅ **Visual Error Indicators** with color coding
- ✅ **Component Architecture** with Header, SideMenuNav, and Home separation
- ✅ **Navigation System** with React Router integration
- ✅ **Professional Side Menu**: Logo moved from header, covers entire viewport
- ✅ **Universal Menu Button**: Available in all views (desktop, mobile, tablet)
- ✅ **Z-index Hierarchy**: Side menu (60) > Overlay (50) > Profile dropdown (45) > Header (40)
- ✅ **Search Feature Removed** from SideMenuNav for cleaner design
- ✅ **Post CRUD Integration**: Create posts and view feed with real data
- ✅ **API Utility**: Axios instance with request/response interceptors
- ✅ **Profile Image Display**: User profile pictures throughout app
- ✅ **Post Image Upload**: Users can add images to posts
- ✅ **Image Management System**: Complete upload, storage, and display
- ✅ **Sanctum Authentication**: Token-based authentication
- ✅ **Like System**: Toggle like/unlike with real-time updates
- ✅ **Comment System**: Full comment functionality with user avatars
- ✅ **Post Deletion**: Users can delete their own posts with confirmation
- ✅ **Professional Image Sizing**: Post images with max-height: 500px
- ✅ **Storage Architecture Fix**: Correct image storage paths implemented
- ✅ **French Schema Compliance**: Liker table without date column handled
- ✅ **Complete Friends System**: Friend requests, suggestions, and management
- ✅ **Integrated Search**: Contextual search in friends section
- ✅ **Mutual Friends Algorithm**: Smart friend suggestions
- ✅ **Composite Key Support**: Amitie model with proper database configuration
- ✅ **Real-time Updates**: Automatic refresh after friend actions
- ✅ **Monolithic Architecture Documentation**: Critical architecture details added
- ✅ **Mobile Testing Setup**: Complete configuration for mobile device testing

### Next Features Planned:
- 🔄 **Real-time Messaging**: Chat functionality
- 🔄 **Notification System**: Real-time notifications
- 🔄 **Advanced Search**: Global search across posts, users, messages
- 🔄 **Admin Dashboard**: User management and analytics
- 🔄 **Post Editing**: Edit existing posts
- 🔄 **Multiple Images**: Support for multiple images per post
- 🔄 **Image Cropping**: In-app image editing
- 🔄 **Friend Groups**: Organize friends into custom groups
- 🔄 **Friend Activity Feed**: See friend posts and activity
- 🔄 **Bulk Friend Actions**: Select multiple friends for batch operations

### Technical Debt & Improvements:
- 🔄 Add more comprehensive factory states
- 🔄 Implement rate limiting for email sending
- 🔄 Add password reset functionality
- 🔄 Implement two-factor authentication
- 🔄 Add comprehensive test suite
- 🔄 Implement proper error boundaries
- 🔄 Add performance monitoring
- 🔄 Implement proper caching strategies
- 🔄 Add internationalization (i18n) support
- 🔄 Implement dark/light theme switching
- 🔄 Add WebSocket support for real-time features
- 🔄 Optimize database queries with advanced indexing
- 🔄 Implement GraphQL API for more efficient data fetching
- 🔄 Add service workers for offline capabilities

---

## 📞 SUPPORT & TROUBLESHOOTING - UPDATED

### Common Setup Issues:
1. **Email Not Sending**: Check Gmail App Password and .env configuration
2. **Images Not Loading**:
   - Verify storage link: `php artisan storage:link`
   - Check permissions: `chmod -R 755 storage/app/public`
   - Clear caches: `php artisan config:clear` etc.
   - Check Vite proxy configuration
3. **Routes Not Working**: Clear route cache and check bootstrap/app.php configuration
4. **Database Errors**: Verify migration order and foreign key constraints
5. **Network Errors**: Check CORS configuration and server connectivity
6. **Component Styling Issues**: Verify Tailwind CSS configuration and imports
7. **Authentication Problems**: Check Sanctum configuration and token handling
8. **API Connection Issues**: Verify Vite proxy configuration for /api routes
9. **Image Upload Errors**:
   - Check storage permissions
   - Ensure `storage/app/public/images/` directory exists
   - Verify PostController uses `store('images', 'public')`
10. **Token Errors**: Ensure personal_access_tokens table exists and HasApiTokens trait is used
11. **Like Errors**: Ensure Liker model doesn't expect date column (French schema)
12. **Friends System Errors**:
    - Check Amitie model has composite key configuration
    - Verify friends routes are inside sanctum middleware
    - Check database has Amitie table with proper structure
13. **Mobile Testing Issues**:
    - Phone not connecting: Check firewall and network settings
    - Images not loading: Verify Vite mobile configuration
    - API calls failing: Ensure Laravel running on `0.0.0.0`

### Debugging Tools:
- **Laravel Logs**: `tail -f storage/logs/laravel.log`
- **Route List**: `php artisan route:list`
- **Database**: `php artisan tinker`
- **Frontend**: Browser DevTools Network tab
- **Email Testing**: Mailtrap or Gmail test accounts
- **Vite Debugging**: Browser console and Vite dev tools
- **React DevTools**: Component inspection and state debugging
- **Storage Debug**: Check `storage/app/public/images/` directory
- **API Testing**: Postman or Insomnia for endpoint testing

### Performance Monitoring:
- **Database**: `php artisan db:monitor`
- **Cache**: `php artisan cache:stats`
- **Queue**: `php artisan queue:monitor`
- **Storage**: `php artisan storage:info`
- **Frontend**: Lighthouse audits and performance profiling
- **Backend**: Laravel Debugbar and query monitoring
- **Network**: Browser DevTools Network tab for API call timings

### Mobile Testing Checklist:
- [ ] Computer and phone on same Wi-Fi network
- [ ] Firewall allows ports 5173 and 8000
- [ ] Correct local IP in vite.config.mobile.js
- [ ] Laravel running with `--host=0.0.0.0`
- [ ] Vite running with mobile configuration
- [ ] Browser cache cleared on phone
- [ ] Test connection from phone browser

### Deployment Checklist:
- [ ] Environment variables configured (.env.production)
- [ ] Database migrations run (including personal_access_tokens)
- [ ] Storage link created (`php artisan storage:link`)
- [ ] Cache cleared and optimized
- [ ] Frontend assets built (`npm run build`)
- [ ] File permissions set correctly
- [ ] SSL certificate installed
- [ ] Backup system configured
- [ ] Monitoring and logging setup
- [ ] Security headers configured
- [ ] CORS properly configured for production domain
- [ ] Rate limiting enabled for API endpoints
- [ ] Database backups scheduled
- [ ] CDN configured for static assets
- [ ] Load balancer configured (if needed)
- [ ] Error tracking service configured (Sentry, Bugsnag)

---

## 🏗️ ARCHITECTURE OVERVIEW - UPDATED

### Backend Architecture:
- **Laravel 11+** with modern application structure
- **French Database Schema** with custom migrations
- **API-First Design** with Laravel Sanctum
- **Service Pattern** for business logic separation
- **Repository Pattern** for data access
- **Event-Driven Architecture** for real-time features
- **Queue System** for background processing
- **File Storage System** with correct image paths

### Frontend Architecture:
- **React 18** with functional components and hooks
- **Context API** for state management (AuthContext)
- **React Router** for navigation
- **Axios** for API communication with interceptors
- **Tailwind CSS** for styling
- **Component-Based Design** for reusability
- **Custom Hooks** for logic abstraction
- **Error Boundaries** for graceful error handling
- **Image Management** with preview and URL construction

### **Monolithic Architecture (CRITICAL):**
- **Single Codebase**: React embedded in Laravel via Vite
- **Unified Deployment**: One server for both frontend and backend
- **Development Proxy**: Vite proxies API calls to avoid CORS
- **Production Build**: Compiled React assets served by Laravel
- **Shared Configuration**: Single `.env` file for entire application

### Data Flow - Enhanced:
1. **User Action** → React Component (Home.jsx, Amitie.jsx)
2. **API Call** → Laravel Controller (PostController, AmitieController)
3. **Business Logic** → Service Methods (like, comment, friend management)
4. **Data Persistence** → Eloquent Models (French schema with composite keys)
5. **File Processing** → Storage System (correct path: `storage/app/public/images/`)
6. **Response** → React State Update
7. **UI Update** → Component Re-render with new data
8. **Real-time Updates** → Future: WebSocket Events

### Development Workflow:
1. **Local Development**:
   - Laravel: `localhost:8000`
   - Vite: `localhost:5173` (proxies to Laravel)
   - No CORS issues due to proxy

2. **Mobile Testing**:
   - Laravel: `0.0.0.0:8000` (network accessible)
   - Vite: `YOUR_IP:5173` (network accessible)
   - Phone accesses via network IP

3. **Production**:
   - Laravel serves compiled React assets
   - Single origin: `your-domain.com`
   - No proxy needed

### Security Architecture:
- **Authentication**: Laravel Sanctum tokens
- **Authorization**: Role-based access control
- **Validation**: Form request validation with French messages
- **Sanitization**: Input filtering and output escaping
- **CORS**: Cross-origin resource sharing configuration
- **HTTPS**: Secure communication enforcement
- **Rate Limiting**: API endpoint protection
- **File Validation**: Secure upload validation (5MB max, image types)
- **Permission Checks**: Users can only manage their own content and friendships
- **Friendship Security**: Prevents self-friending and duplicate requests

### Scalability Considerations:
- **Database Indexing**: Optimized query performance with proper indexes
- **Caching Strategy**: Multi-layer caching system (Redis/Memcached)
- **Asset Optimization**: Minified and compressed resources
- **Lazy Loading**: On-demand component and data loading
- **Background Processing**: Queue system for heavy operations (email sending, image processing)
- **Horizontal Scaling**: Stateless application design
- **CDN Integration**: For static assets and images
- **API Rate Limiting**: Prevent abuse and ensure fair usage
- **Database Read Replicas**: For high-traffic scenarios
- **Microservices Ready**: Modular design for future decomposition

---

**Last Updated**: December 2024  
**Database**: Tulk (French Schema - Liker without date column, Amitie with composite keys)  
**Stack**: Laravel 11 + React 18 + Tailwind CSS v4 + MySQL + Sanctum  
**Architecture**: ✅ Monolithic (React embedded in Laravel)  
**Development**: ✅ Localhost + Mobile Testing Configurations  
**Status**: ✅ Authentication Complete → ✅ Navigation Complete → ✅ Post CRUD Complete → ✅ Image System Complete → ✅ Like System Complete → ✅ Comment System Complete → ✅ Post Deletion Complete → ✅ Friends System Complete  
**Testing**: ✅ Manual Testing → 🚧 Automated Test Suite  
**Deployment**: 🚧 Development → 🚧 Staging → 🚧 Production Ready  