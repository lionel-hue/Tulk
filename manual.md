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

### 4. MIGRATION EXECUTION ORDER - CRITICAL# 🚀 TULK CHAT APPLICATION - PROJECT MANUAL

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

## 🔧 **NEW ARCHITECTURE: SEPARATE REACT + LARAVEL API** (Updated December 2024)

### **ARCHITECTURE TYPE: SEPARATE REACT FRONTEND + LARAVEL API BACKEND**
**IMPORTANT**: This project now uses a **SEPARATE ARCHITECTURE** where:
- **React Frontend** is a standalone application in `/front/` folder
- **Laravel Backend** is a pure API in `/back/` folder
- **Two separate servers** run during development:
  - React: `http://localhost:3000` (Vite dev server)
  - Laravel: `http://localhost:8000` (PHP artisan serve)
- **No proxy needed** - React calls Laravel API directly
- **CORS configured** for cross-origin communication

**Benefits of New Architecture:**
- ✅ **No Vite proxy configuration** headaches
- ✅ **Clean separation** of frontend and backend
- ✅ **Easy mobile testing** - run both on network IP
- ✅ **Independent deployment** possible
- ✅ **Better development experience** with React hot reload

### **Project Structure:**
```
Tulk-project/                # Parent directory
├── front/                   # React frontend application (PORT 3000)
│   ├── src/                 # React components (moved from back/resources/js/)
│   ├── package.json         # React dependencies
│   ├── vite.config.js       # Vite for React only
│   └── .env                 # Frontend environment: VITE_API_URL
│
├── back/                    # Laravel API backend (PORT 8000)
│   ├── app/                 # Laravel application
│   ├── routes/api.php       # API endpoints
│   ├── composer.json        # PHP dependencies
│   ├── .env                 # Laravel environment
│   └── storage/app/public/  # Image storage
│
└── manual.md                # This documentation
```

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
- **Rate Limiting** implemented for login protection

### ✅ FRONTEND COMPONENTS (Now in `/front/src/`)
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
- **Rate Limiting**: 5 attempts per minute per IP address to prevent brute-force attacks

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

## 🖼️ IMAGE MANAGEMENT SYSTEM - UPDATED FOR SEPARATE ARCHITECTURE

### **CRITICAL FIX FOR IMAGE DISPLAY ISSUE**

#### **Root Cause of Image Display Problem:**
1. **Database stores**: `images/filename.jpg` (relative path)
2. **Images are physically saved in**: `back/storage/app/public/images/filename.jpg`
3. **Laravel creates symlink**: `back/public/storage → back/storage/app/public`
4. **Images should be accessible at**: `http://localhost:8000/storage/images/filename.jpg`

#### **Image Storage Architecture - FIXED:**
```
CORRECT STRUCTURE:
back/storage/app/public/images/              # Laravel stores images here
└── filename.jpg                             # Actual image file

back/public/storage → symlink to storage/app/public   # Created by php artisan storage:link

IMAGE URLS SHOULD BE:
http://localhost:8000/storage/images/filename.jpg
```

#### **Image Upload Flow (Corrected):**
1. **React Frontend**: User selects image → FormData created → POST to `/api/posts`
2. **Laravel API**: Receives image → `$image->store('images', 'public')` → saves to `back/storage/app/public/images/filename.jpg`
3. **Database**: Stores path as `'images/filename.jpg'` (relative path - CORRECT)
4. **Image Display**: Frontend uses `getImageUrl()` which constructs: `http://localhost:8000/storage/images/filename.jpg`

#### **Updated getImageUrl() Function - FIXED:**
```javascript
// front/src/utils/imageUrls.js - UPDATED AND CORRECTED
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get Laravel backend URL from environment variable
    // IMPORTANT: Remove /api from the base URL to get Laravel root
    const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    
    // Database paths are stored as: 'images/filename.jpg'
    // Laravel serves them at: /storage/images/filename.jpg
    return `${baseUrl}/storage/${imagePath}`;
};
```

#### **Verification Steps for Image Display:**
1. **Check if image exists physically**:
   ```bash
   ls -la back/storage/app/public/images/
   # Should see your uploaded image files
   ```

2. **Check if symlink exists**:
   ```bash
   ls -la back/public/
   # Should see: storage -> ../storage/app/public
   ```

3. **Test image URL directly in browser**:
   ```
   http://localhost:8000/storage/images/your-filename.jpg
   # This should display the image
   ```

4. **Check database storage**:
   ```bash
   php artisan tinker
   App\Models\Article::find(1)->image;
   # Should return: 'images/filename.jpg'
   ```

5. **Verify API returns correct paths**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/posts/feed
   # Should show "image": "images/filename.jpg"
   ```

#### **Common Image Issues and Solutions:**

##### **Issue 1: Images not displaying (showing broken image icon)**
- **Cause**: Wrong URL construction in `getImageUrl()`
- **Fix**: Use the updated `getImageUrl()` function above

##### **Issue 2: 404 error when accessing image URL**
- **Cause**: Missing storage symlink or wrong permissions
- **Fix**:
  ```bash
  cd back
  php artisan storage:link
  chmod -R 755 storage/app/public
  chmod -R 755 public/storage
  ```

##### **Issue 3: Images saving but not appearing in storage**
- **Cause**: Files saving to wrong location
- **Fix**: Ensure PostController uses:
  ```php
  $imagePath = $image->store('images', 'public');
  // NOT: $image->store('public/images')
  ```

##### **Issue 4: Mobile images not loading**
- **Cause**: Using localhost instead of network IP
- **Fix**: Update `.env` files:
  - `front/.env`: `VITE_API_URL=http://YOUR_IP:8000/api`
  - `back/.env`: `FRONTEND_URL=http://YOUR_IP:3000`

#### **Profile Images:**
- **Upload**: During signup (optional) and profile editing
- **Storage**: `back/storage/app/public/images/` with unique filenames
- **Display**: Profile pictures show in header, posts, and profile sections
- **Fallback**: User initials in gradient circle when no image exists
- **Validation**: 5MB max size, JPEG/PNG/JPG/GIF formats

#### **Post Images:**
- **Upload**: When creating posts with preview functionality
- **Preview**: Real-time image preview with remove option (X button)
- **Validation**: Same as profile images (5MB max, image formats)
- **Display**: Professional sizing (max-height: 500px) with responsive design
- **Professional Aspect**: Images maintain aspect ratio with `object-fit: contain`

#### **Image URL System (UPDATED AND CORRECTED):**
- **Storage URLs**: `http://localhost:8000/storage/images/filename.jpg`
- **Public Access**: Enabled via `php artisan storage:link` in Laravel
- **Utility Function**: `getImageUrl()` now correctly constructs URLs
- **CORS Required**: Laravel must allow React's origin (localhost:3000)

#### **Critical Fixes Applied:**
1. **Storage Symlink**: Must be created with `php artisan storage:link` in Laravel
2. **CORS Configuration**: Laravel must allow React origin
3. **Path Consistency**: Store only `'images/filename.jpg'` in database
4. **Frontend URL Construction**: Updated `getImageUrl()` for separate architecture

#### **Image Components:**
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

### ✅ Authentication Rate Limiting - FULLY IMPLEMENTED
```javascript
// Custom ThrottleLogin middleware protects login endpoint
// Limits: 5 attempts per minute per IP
// Returns: 429 with "Too many login attempts. Please try again in X seconds."
```

**Features:**
- Protects against brute-force attacks
- Clear error messages with countdown timer
- Custom middleware bypasses CSRF issues
- Automatically resets after successful login

---

## 🛡️ ENHANCED ERROR HANDLING SYSTEM

### Network Error Detection:
- **No Internet**: "Problème de connexion internet. Veuillez vérifier votre connexion et réessayer."
- **Timeout**: "La requête a expiré. Veuillez vérifier votre connexion internet et réessayer."
- **Server Unreachable**: Clear network error messages
- **Rate Limiting**: "Too many login attempts. Please try again in X seconds."

### Visual Error Indicators:
- **Red Theme**: Standard validation errors (email taken, invalid code, etc.)
- **Yellow Theme**: Network-related errors with WiFi off icon
- **Green Theme**: Success messages with checkmark icons
- **429 Errors**: Rate limiting warnings with timer display

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
- ✅ CORS errors (new for separate architecture)
- ✅ Rate limiting errors with automatic countdown

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

## 🗂️ UPDATED FILE STRUCTURE FOR SEPARATE ARCHITECTURE

### BACKEND (Laravel) - `/back/`
```
back/
├── app/
│   ├── Models/
│   │   ├── Utilisateur.php (HasApiTokens trait, image relationships)
│   │   ├── Article.php (With likes, comments, utilisateur relationships)
│   │   ├── Commentaire.php (With utilisateur, article relationships)
│   │   ├── Amitie.php (Friendship relationships - composite keys)
│   │   ├── Message.php
│   │   └── Liker.php (Like relationships - NO date column)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php (Image upload support)
│   │   │   ├── VerificationController.php
│   │   │   ├── PostController.php (Complete: create, feed, like, comment, delete)
│   │   │   ├── AmitieController.php (Complete friend management)
│   │   │   ├── UserController.php
│   │   │   └── MessageController.php
│   │   └── Middleware/
│   │       ├── ThrottleLogin.php (Custom rate limiting middleware)
│   │       └── VerifyCsrfToken.php (CSRF exceptions for API)
│   └── Mail/
│       └── VerificationCodeMail.php
├── bootstrap/
│   └── app.php (Updated middleware configuration - NO statefulApi)
├── routes/
│   └── api.php (API endpoints only - no web routes for React)
├── database/
│   ├── factories/
│   │   ├── UtilisateurFactory.php
│   │   ├── ArticleFactory.php
│   │   └── CommentaireFactory.php
│   ├── migrations/ (French schema migrations + personal_access_tokens)
│   └── seeders/
│       └── UtilisateurSeeder.php
├── storage/app/public/images/ (Image storage)
└── .env (Laravel environment)
```

### FRONTEND (React) - `/front/` (New Location!)
```
front/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx (Image upload)
│   │   ├── main/
│   │   │   ├── Home.jsx (COMPLETE: posts, likes, comments, delete, images)
│   │   │   ├── Header.jsx (Profile images + integrated search)
│   │   │   ├── SideMenuNav.jsx (No search feature)
│   │   │   ├── Amitie.jsx (Complete friends section)
│   │   │   └── Modal.jsx (Confirm dialogs)
│   │   └── shared/
│   │       ├── Loader.jsx
│   │       └── ErrorBoundary.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useModal.js
│   ├── utils/
│   │   ├── api.js (Axios instance with interceptors - UPDATED for separate arch)
│   │   ├── validation.js
│   │   └── imageUrls.js (CRITICAL: updated getImageUrl() function - FIXED)
│   ├── App.jsx
│   └── index.jsx
├── public/ (Static assets)
├── package.json (React dependencies)
├── vite.config.js (Vite for React only - simplified)
└── .env (Frontend environment: VITE_API_URL)
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
- **Rate Limit Warning**: `#f97316` (orange)

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
- ⏰ **Rate Limit**: `Timer` icon

---

## 🛠️ TECHNICAL CONFIGURATION - UPDATED FOR SEPARATE ARCHITECTURE

## 🔧 **DEVELOPMENT SETUP - SEPARATE ARCHITECTURE**

### **Environment Configuration**

#### **Frontend (`front/.env`):**
```env
VITE_API_URL=http://localhost:8000/api
# For mobile testing: VITE_API_URL=http://YOUR_IP:8000/api
```

#### **Backend (`back/.env`):**
```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Tulk
DB_USERNAME=tulk_user
DB_PASSWORD=Tulk123!

# CORS configuration (CRITICAL for separate architecture)
FRONTEND_URL=http://localhost:3000
# For mobile testing: FRONTEND_URL=http://YOUR_IP:3000

# Email configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tulksoft@gmail.com
MAIL_PASSWORD=gmxaokplajawlrjd
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tulksoft@gmail.com
MAIL_FROM_NAME="Tulk"
```

### **Current Bootstrap Configuration (`back/bootstrap/app.php`):**
```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        api: __DIR__ . '/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // REMOVE statefulApi() - you're using token auth
        // $middleware->statefulApi();

        // Add CORS middleware for React
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        $middleware->web([
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        $middleware->api([
            // Remove EnsureFrontendRequestsAreStateful since you're using tokens
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
```

### **Frontend Vite Configuration (`front/vite.config.js`):**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Allow network access for mobile testing
    port: 3000,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
```

### **Backend CORS Configuration (`back/config/cors.php`):**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### **Development Commands:**

#### **Standard Development (Localhost only):**
```bash
# Terminal 1: Laravel API
cd back
php artisan serve --port=8000

# Terminal 2: React frontend
cd front
npm run dev

# Access:
# React: http://localhost:3000
# Laravel API: http://localhost:8000/api
```

#### **Mobile Testing on Same Network:**
```bash
# Find your computer's IP address
hostname -I  # Linux/Mac (example: 192.168.1.100)

# Update environment files
# In front/.env: VITE_API_URL=http://192.168.1.100:8000/api
# In back/.env: FRONTEND_URL=http://192.168.1.100:3000

# Terminal 1: Laravel on network
cd back
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2: React on network
cd front
npm run dev -- --host 0.0.0.0

# On phone browser: http://192.168.1.100:3000
```

### **API Communication - Updated for Separate Architecture:**

#### **Frontend API Configuration (`front/src/utils/api.js`):**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;
```

#### **Image URL Helper - UPDATED AND CORRECTED (`front/src/utils/imageUrls.js`):**
```javascript
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get Laravel backend URL from environment variable
    // IMPORTANT: Remove /api from the base URL to get Laravel root
    const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    
    // Database paths are stored as: 'images/filename.jpg'
    // Laravel serves them at: /storage/images/filename.jpg
    return `${baseUrl}/storage/${imagePath}`;
};
```

### **Security Features:**
- Password hashing with bcrypt
- Sanctum token authentication
- Form validation on both client and server
- XSS protection with React's built-in escaping
- CORS properly configured for cross-origin requests
- **Rate limiting on authentication endpoints** (5 attempts/minute)
- Secure file upload validation
- SQL injection protection with Eloquent
- **Post Deletion**: Permission checks (users can only delete their own posts)
- **Friendship Validation**: Prevents self-friending and duplicate requests
- **Authorization**: Users can only manage their own friendships
- **CSRF Protection**: For web routes, disabled for API routes

### **Performance Optimization:**
- **Lazy Loading**: Component and image lazy loading
- **Code Splitting**: Route-based code splitting
- **Caching**: API response caching where appropriate
- **Optimized Assets**: Compressed images and minified code
- **Efficient Queries**: Optimized database queries with indexes
- **Image Optimization**: Automatic compression and responsive sizing
- **Debounced Search**: 500ms delay for friend search
- **Limited Results**: Friends suggestions limited to 10, search to 20

---

## 🚀 QUICK START COMMANDS - UPDATED FOR SEPARATE ARCHITECTURE

### **Initial Setup:**
```bash
# Clone repository
git clone <your-repo>
cd Tulk-project

# Backend setup
cd back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link  # CRITICAL FOR IMAGES

# Frontend setup
cd ../front
npm install
```

### **Development Servers:**
```bash
# Standard Development (two terminals)
# Terminal 1: Laravel API
cd back && php artisan serve --port=8000

# Terminal 2: React
cd front && npm run dev

# Access: http://localhost:3000
```

### **Mobile Testing:**
```bash
# Find your IP
hostname -I

# Update .env files with your IP
# front/.env: VITE_API_URL=http://YOUR_IP:8000/api
# back/.env: FRONTEND_URL=http://YOUR_IP:3000

# Start servers for mobile
# Terminal 1: Laravel on network
cd back && php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2: React on network
cd front && npm run dev -- --host 0.0.0.0

# On phone: http://YOUR_IP:3000
```

### **Database Operations:**
```bash
# Run migrations (INCLUDES personal_access_tokens)
cd back
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

### **Storage Setup - CRITICAL:**
```bash
# In Laravel backend
cd back
php artisan storage:link

# Ensure permissions
chmod -R 755 storage/app/public
chmod -R 755 public/storage

# Ensure correct directory structure
mkdir -p storage/app/public/images

# Remove incorrect nested directories if they exist
rm -rf storage/app/public/public 2>/dev/null || true
```

### **Email Testing:**
```bash
# Test email configuration
cd back
php artisan tinker
Mail::raw('Test', fn($m) => $m->to('test@test.com')->subject('Test'))

# Preview email templates
php artisan vendor:publish --tag=laravel-mail
```

### **Cache & Configuration:**
```bash
# Clear all caches (run after major changes)
cd back
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

### **Factory Commands:**
```bash
# Create a factory
cd back
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

### **Frontend Development:**
```bash
# Install dependencies
cd front
npm install

# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 TESTING CREDENTIALS

### Available Test Users:
- **Regular User**: sissolionel@gmail.com / 123456
- **Admin User**: admin@tulk.com / admin123 (if created)
- **Moderator User**: mod@tulk.com / mod123 (if created)

### API Testing Endpoints:
- **Authentication**:
  - `POST /api/login` (Rate limited: 5 attempts/minute)
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

## 🐛 KNOWN ISSUES & SOLUTIONS - UPDATED FOR SEPARATE ARCHITECTURE

### Issue: Images Not Displaying (Broken Image Icons)
- **Problem**: Images saved in database but not displaying in frontend
- **Root Cause**: Incorrect URL construction in `getImageUrl()` function
- **Solution**: 
  1. Update `front/src/utils/imageUrls.js` with the corrected function
  2. Ensure database stores paths as `'images/filename.jpg'`
  3. Test direct image access: `http://localhost:8000/storage/images/filename.jpg`

### Issue: CORS Errors in Browser Console
- **Problem**: React (localhost:3000) can't call Laravel API (localhost:8000)
- **Root Cause**: Missing or incorrect CORS configuration
- **Solution**:
  1. Install CORS package: `composer require fruitcake/laravel-cors`
  2. Update `back/config/cors.php` with correct origins
  3. Clear cache: `php artisan config:clear`
  4. Ensure `FRONTEND_URL` is set in Laravel `.env`

### Issue: Image Upload Fails with "Image was not saved to disk"
- **Problem**: Images weren't being saved to correct location
- **Root Cause**: Incorrect storage path in PostController
- **Solution**: Use `$image->store('images', 'public')` instead of custom path logic

### Issue: Liker Table Column Not Found Error
- **Problem**: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'date'`
- **Root Cause**: Liker table doesn't have date column (French schema)
- **Solution**: Remove `'date' => now()` from Liker creation in PostController

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

### Issue: Mobile Testing - Can't Connect from Phone
- **Problem**: Phone can't access development server
- **Solution**:
  1. Ensure phone and computer are on same Wi-Fi network
  2. Check firewall allows ports 3000 and 8000
  3. Use correct local IP address in environment files
  4. Run Laravel with `--host=0.0.0.0`
  5. Run React with `--host 0.0.0.0`

### Issue: API Calls Going to Wrong URL
- **Problem**: React still trying to call `/api` instead of full URL
- **Root Cause**: `VITE_API_URL` not set in frontend `.env`
- **Solution**: Ensure `front/.env` has `VITE_API_URL=http://localhost:8000/api`

### Issue: React Hot Reload Not Working
- **Problem**: Changes to React components don't reflect immediately
- **Solution**: 
  1. Ensure running `npm run dev` not `npm run build`
  2. Check Vite is running on correct port (3000)
  3. Clear browser cache

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

### Issue: CSRF Errors on Login
- **Problem**: Browser login gets 419 CSRF token mismatch
- **Root Cause**: Using stateful API with CSRF protection
- **Solution**: 
  1. Remove `statefulApi()` from `bootstrap/app.php`
  2. Remove `EnsureFrontendRequestsAreStateful` from API middleware
  3. Use token authentication instead of cookie/session

### Issue: Rate Limiting Not Working
- **Problem**: Login attempts not being limited
- **Root Cause**: CSRF blocking requests before rate limiter
- **Solution**: Use custom `ThrottleLogin` middleware that bypasses CSRF

---

## 🔄 UPDATE LOG - MAJOR MILESTONES

### Latest Updates (December 2024):
- ✅ **IMAGE DISPLAY FIX**: Corrected `getImageUrl()` function to properly construct URLs
- ✅ **AUTHENTICATION FIX**: Removed `statefulApi()` to fix CSRF issues
- ✅ **RATE LIMITING**: Implemented custom `ThrottleLogin` middleware (5 attempts/minute)
- ✅ **ARCHITECTURE CHANGE**: Switched from Monolithic to Separate React + Laravel API
- ✅ **Frontend Moved**: React components now in `/front/src/` folder
- ✅ **Backend Simplified**: Laravel now pure API in `/back/` folder
- ✅ **CORS Configured**: Proper cross-origin communication setup
- ✅ **Mobile Testing Simplified**: No more Vite proxy headaches

### Previous Updates:
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

### Image Display Troubleshooting:
1. **Images not showing in browser**:
   ```bash
   # Test image URL directly
   curl -I http://localhost:8000/storage/images/filename.jpg
   # Should return 200 OK
   
   # Check storage symlink
   ls -la back/public/storage
   # Should point to ../storage/app/public
   
   # Check file exists
   ls -la back/storage/app/public/images/filename.jpg
   ```

2. **Check database storage**:
   ```bash
   php artisan tinker
   App\Models\Article::find(1)->image;
   # Should return: 'images/filename.jpg'
   ```

3. **Check frontend URL construction**:
   ```javascript
   // In browser console
   console.log(getImageUrl('images/test.jpg'));
   // Should log: http://localhost:8000/storage/images/test.jpg
   ```

### Common Setup Issues:
1. **CORS Errors**: 
   - Install CORS: `composer require fruitcake/laravel-cors`
   - Update `back/config/cors.php`
   - Set `FRONTEND_URL` in Laravel `.env`

2. **API Connection Issues**:
   - Check `VITE_API_URL` in frontend `.env`
   - Verify Laravel is running: `php artisan serve --port=8000`
   - Check React is running: `npm run dev` in front/

3. **Mobile Testing Issues**:
   - Phone and computer on same Wi-Fi
   - Update IP addresses in both `.env` files
   - Run both servers with `--host=0.0.0.0`
   - Check firewall allows ports 3000 and 8000

4. **Email Not Sending**: Check Gmail App Password and .env configuration

5. **Routes Not Working**: Clear route cache: `php artisan route:clear`

6. **Database Errors**: Verify migration order and foreign key constraints

7. **Component Styling Issues**: Verify Tailwind CSS configuration and imports

8. **Authentication Problems**: Check Sanctum configuration and token handling

9. **Token Errors**: Ensure personal_access_tokens table exists and HasApiTokens trait is used

10. **Like Errors**: Ensure Liker model doesn't expect date column (French schema)

11. **Friends System Errors**:
    - Check Amitie model has composite key configuration
    - Verify friends routes are inside sanctum middleware
    - Check database has Amitie table with proper structure

### Debugging Tools:
- **Laravel Logs**: `tail -f back/storage/logs/laravel.log`
- **Route List**: `php artisan route:list` (in back/)
- **Database**: `php artisan tinker` (in back/)
- **Frontend**: Browser DevTools Network tab
- **Email Testing**: Mailtrap or Gmail test accounts
- **React DevTools**: Component inspection and state debugging
- **Storage Debug**: Check `back/storage/app/public/images/` directory
- **API Testing**: Postman or Insomnia for endpoint testing
- **Image Debug**: Test image URLs directly in browser

### Performance Monitoring:
- **Database**: `php artisan db:monitor` (in back/)
- **Cache**: `php artisan cache:stats` (in back/)
- **Queue**: `php artisan queue:monitor` (in back/)
- **Storage**: `php artisan storage:info` (in back/)
- **Frontend**: Lighthouse audits and performance profiling
- **Backend**: Laravel Debugbar and query monitoring
- **Network**: Browser DevTools Network tab for API call timings

### Mobile Testing Checklist:
- [ ] Computer and phone on same Wi-Fi network
- [ ] Firewall allows ports 3000 and 8000
- [ ] Correct IP in `front/.env` (VITE_API_URL)
- [ ] Correct IP in `back/.env` (FRONTEND_URL)
- [ ] Laravel running with `--host=0.0.0.0` (in back/)
- [ ] React running with `--host 0.0.0.0` (in front/)
- [ ] Browser cache cleared on phone
- [ ] Test connection from phone browser
- [ ] Test image display on phone

### Deployment Checklist:
- [ ] Environment variables configured for production
- [ ] Database migrations run (including personal_access_tokens)
- [ ] Storage link created (`php artisan storage:link`)
- [ ] Cache cleared and optimized
- [ ] React built for production (`npm run build` in front/)
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

## 🏗️ ARCHITECTURE OVERVIEW - UPDATED FOR SEPARATE ARCHITECTURE

### **New Architecture: Separate React + Laravel API**

#### **Backend Architecture (Laravel - `/back/`):**
- **Laravel 11+** with modern application structure
- **French Database Schema** with custom migrations
- **API-First Design** with Laravel Sanctum
- **Service Pattern** for business logic separation
- **Repository Pattern** for data access
- **Event-Driven Architecture** for real-time features
- **Queue System** for background processing
- **File Storage System** with correct image paths
- **Pure API** - no frontend rendering responsibilities
- **Middleware Configuration**: Custom rate limiting, CORS enabled, CSRF disabled for API

#### **Frontend Architecture (React - `/front/`):**
- **React 18** with functional components and hooks
- **Context API** for state management (AuthContext)
- **React Router** for navigation
- **Axios** for API communication with interceptors
- **Tailwind CSS** for styling
- **Component-Based Design** for reusability
- **Custom Hooks** for logic abstraction
- **Error Boundaries** for graceful error handling
- **Image Management** with preview and URL construction
- **Standalone Application** - independent from Laravel
- **Utility Functions**: Correct image URL construction for separate architecture

#### **Data Flow - Separate Architecture:**
1. **User Action** → React Component (in `/front/src/`)
2. **API Call** → Laravel Controller (in `/back/app/Http/Controllers/`)
3. **Business Logic** → Service Methods (like, comment, friend management)
4. **Data Persistence** → Eloquent Models (French schema with composite keys)
5. **File Processing** → Storage System (correct path: `back/storage/app/public/images/`)
6. **Response** → React State Update
7. **UI Update** → Component Re-render with new data
8. **Real-time Updates** → Future: WebSocket Events

#### **Image Flow - Corrected:**
1. **Image Upload**: React → Laravel API → `storage('images', 'public')`
2. **Path Storage**: Database stores `'images/filename.jpg'`
3. **URL Construction**: Frontend uses `getImageUrl('images/filename.jpg')`
4. **Image Serving**: Laravel serves from `public/storage/images/filename.jpg`
5. **Frontend Display**: React renders `<img src="http://localhost:8000/storage/images/filename.jpg">`

#### **Development Workflow - New:**
1. **Local Development**:
   - Laravel: `localhost:8000` (API only)
   - React: `localhost:3000` (frontend only)
   - CORS configured for cross-origin communication

2. **Mobile Testing**:
   - Laravel: `0.0.0.0:8000` (network accessible)
   - React: `YOUR_IP:3000` (network accessible)
   - Phone accesses React, which calls Laravel API

3. **Production**:
   - Option 1: Combined (React build in Laravel public folder)
   - Option 2: Separate (React on Vercel, Laravel on Forge)
   - Same API endpoints, different deployment strategies

#### **Security Architecture:**
- **Authentication**: Laravel Sanctum tokens
- **Authorization**: Role-based access control
- **Validation**: Form request validation with French messages
- **Sanitization**: Input filtering and output escaping
- **CORS**: Cross-origin resource sharing configuration (critical for separate architecture)
- **HTTPS**: Secure communication enforcement
- **Rate Limiting**: API endpoint protection (login: 5 attempts/minute)
- **File Validation**: Secure upload validation (5MB max, image types)
- **Permission Checks**: Users can only manage their own content and friendships
- **Friendship Security**: Prevents self-friending and duplicate requests
- **CSRF Protection**: Disabled for API routes, enabled for web routes

#### **Scalability Considerations:**
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
- **Independent Scaling**: Frontend and backend can scale independently

#### **Benefits of Separate Architecture:**
1. ✅ **Clear Separation**: Frontend and backend responsibilities clearly defined
2. ✅ **Independent Development**: Can work on frontend without running Laravel
3. ✅ **Better Tooling**: Use best tools for each part (Vite for React, Laravel for API)
4. ✅ **Easier Testing**: Test API independently with Postman, test UI independently
5. ✅ **Flexible Deployment**: Can deploy separately (React to static hosting, Laravel to API server)
6. ✅ **Team Scalability**: Frontend and backend teams can work independently
7. ✅ **Technology Flexibility**: Can swap frontend framework without affecting backend
8. ✅ **Performance**: Static frontend assets can be served from CDN
9. ✅ **Mobile Testing**: Much simpler setup without proxy configuration
10. ✅ **Future Proof**: Ready for mobile apps using same API

#### **Migration Path from Monolithic:**
1. **Extracted React**: Moved from `back/resources/js/` to `front/src/`
2. **Updated API Calls**: Changed from relative `/api` to absolute `VITE_API_URL`
3. **Updated Image URLs**: `getImageUrl()` now correctly constructs URLs
4. **Added CORS**: Laravel configured to accept requests from React origin
5. **Separated Environment**: Different `.env` files for frontend and backend
6. **Simplified Vite Config**: No more Laravel Vite plugin or proxy configuration
7. **Fixed CSRF**: Removed stateful API configuration for token-based auth
8. **Added Rate Limiting**: Custom middleware for login protection

---

**Last Updated**: December 2024  
**Database**: Tulk (French Schema - Liker without date column, Amitie with composite keys)  
**Stack**: Laravel 11 + React 18 + Tailwind CSS v4 + MySQL + Sanctum  
**Architecture**: ✅ **SEPARATE** (React Frontend + Laravel API Backend)  
**Development**: ✅ Localhost + Mobile Testing Configurations  
**Authentication**: ✅ Token-based with Rate Limiting (5 attempts/minute)  
**Image System**: ✅ **FIXED** (Correct URL construction and storage)  
**Status**: ✅ Authentication Complete → ✅ Navigation Complete → ✅ Post CRUD Complete → ✅ Image System Complete → ✅ Like System Complete → ✅ Comment System Complete → ✅ Post Deletion Complete → ✅ Friends System Complete → ✅ Architecture Migration Complete → ✅ Rate Limiting Complete → ✅ CSRF Fix Complete  
**Testing**: ✅ Manual Testing → 🚧 Automated Test Suite  
**Deployment**: 🚧 Development → 🚧 Staging → 🚧 Production Ready
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

## 🔧 **NEW ARCHITECTURE: SEPARATE REACT + LARAVEL API** (Updated December 2024)

### **ARCHITECTURE TYPE: SEPARATE REACT FRONTEND + LARAVEL API BACKEND**
**IMPORTANT**: This project now uses a **SEPARATE ARCHITECTURE** where:
- **React Frontend** is a standalone application in `/front/` folder
- **Laravel Backend** is a pure API in `/back/` folder
- **Two separate servers** run during development:
  - React: `http://localhost:3000` (Vite dev server)
  - Laravel: `http://localhost:8000` (PHP artisan serve)
- **No proxy needed** - React calls Laravel API directly
- **CORS configured** for cross-origin communication

**Benefits of New Architecture:**
- ✅ **No Vite proxy configuration** headaches
- ✅ **Clean separation** of frontend and backend
- ✅ **Easy mobile testing** - run both on network IP
- ✅ **Independent deployment** possible
- ✅ **Better development experience** with React hot reload

### **Project Structure:**
```
Tulk-project/                # Parent directory
├── front/                   # React frontend application (PORT 3000)
│   ├── src/                 # React components (moved from back/resources/js/)
│   ├── package.json         # React dependencies
│   ├── vite.config.js       # Vite for React only
│   └── .env                 # Frontend environment: VITE_API_URL
│
├── back/                    # Laravel API backend (PORT 8000)
│   ├── app/                 # Laravel application
│   ├── routes/api.php       # API endpoints
│   ├── composer.json        # PHP dependencies
│   ├── .env                 # Laravel environment
│   └── storage/app/public/  # Image storage
│
└── manual.md                # This documentation
```

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
- **Rate Limiting** implemented for login protection

### ✅ FRONTEND COMPONENTS (Now in `/front/src/`)
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
- **Rate Limiting**: 5 attempts per minute per IP address to prevent brute-force attacks

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

## 🖼️ IMAGE MANAGEMENT SYSTEM - UPDATED FOR SEPARATE ARCHITECTURE

### **CRITICAL FIX FOR IMAGE DISPLAY ISSUE**

#### **Root Cause of Image Display Problem:**
1. **Database stores**: `images/filename.jpg` (relative path)
2. **Images are physically saved in**: `back/storage/app/public/images/filename.jpg`
3. **Laravel creates symlink**: `back/public/storage → back/storage/app/public`
4. **Images should be accessible at**: `http://localhost:8000/storage/images/filename.jpg`

#### **Image Storage Architecture - FIXED:**
```
CORRECT STRUCTURE:
back/storage/app/public/images/              # Laravel stores images here
└── filename.jpg                             # Actual image file

back/public/storage → symlink to storage/app/public   # Created by php artisan storage:link

IMAGE URLS SHOULD BE:
http://localhost:8000/storage/images/filename.jpg
```

#### **Image Upload Flow (Corrected):**
1. **React Frontend**: User selects image → FormData created → POST to `/api/posts`
2. **Laravel API**: Receives image → `$image->store('images', 'public')` → saves to `back/storage/app/public/images/filename.jpg`
3. **Database**: Stores path as `'images/filename.jpg'` (relative path - CORRECT)
4. **Image Display**: Frontend uses `getImageUrl()` which constructs: `http://localhost:8000/storage/images/filename.jpg`

#### **Updated getImageUrl() Function - FIXED:**
```javascript
// front/src/utils/imageUrls.js - UPDATED AND CORRECTED
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get Laravel backend URL from environment variable
    // IMPORTANT: Remove /api from the base URL to get Laravel root
    const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    
    // Database paths are stored as: 'images/filename.jpg'
    // Laravel serves them at: /storage/images/filename.jpg
    return `${baseUrl}/storage/${imagePath}`;
};
```

#### **Verification Steps for Image Display:**
1. **Check if image exists physically**:
   ```bash
   ls -la back/storage/app/public/images/
   # Should see your uploaded image files
   ```

2. **Check if symlink exists**:
   ```bash
   ls -la back/public/
   # Should see: storage -> ../storage/app/public
   ```

3. **Test image URL directly in browser**:
   ```
   http://localhost:8000/storage/images/your-filename.jpg
   # This should display the image
   ```

4. **Check database storage**:
   ```bash
   php artisan tinker
   App\Models\Article::find(1)->image;
   # Should return: 'images/filename.jpg'
   ```

5. **Verify API returns correct paths**:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/posts/feed
   # Should show "image": "images/filename.jpg"
   ```

#### **Common Image Issues and Solutions:**

##### **Issue 1: Images not displaying (showing broken image icon)**
- **Cause**: Wrong URL construction in `getImageUrl()`
- **Fix**: Use the updated `getImageUrl()` function above

##### **Issue 2: 404 error when accessing image URL**
- **Cause**: Missing storage symlink or wrong permissions
- **Fix**:
  ```bash
  cd back
  php artisan storage:link
  chmod -R 755 storage/app/public
  chmod -R 755 public/storage
  ```

##### **Issue 3: Images saving but not appearing in storage**
- **Cause**: Files saving to wrong location
- **Fix**: Ensure PostController uses:
  ```php
  $imagePath = $image->store('images', 'public');
  // NOT: $image->store('public/images')
  ```

##### **Issue 4: Mobile images not loading**
- **Cause**: Using localhost instead of network IP
- **Fix**: Update `.env` files:
  - `front/.env`: `VITE_API_URL=http://YOUR_IP:8000/api`
  - `back/.env`: `FRONTEND_URL=http://YOUR_IP:3000`

#### **Profile Images:**
- **Upload**: During signup (optional) and profile editing
- **Storage**: `back/storage/app/public/images/` with unique filenames
- **Display**: Profile pictures show in header, posts, and profile sections
- **Fallback**: User initials in gradient circle when no image exists
- **Validation**: 5MB max size, JPEG/PNG/JPG/GIF formats

#### **Post Images:**
- **Upload**: When creating posts with preview functionality
- **Preview**: Real-time image preview with remove option (X button)
- **Validation**: Same as profile images (5MB max, image formats)
- **Display**: Professional sizing (max-height: 500px) with responsive design
- **Professional Aspect**: Images maintain aspect ratio with `object-fit: contain`

#### **Image URL System (UPDATED AND CORRECTED):**
- **Storage URLs**: `http://localhost:8000/storage/images/filename.jpg`
- **Public Access**: Enabled via `php artisan storage:link` in Laravel
- **Utility Function**: `getImageUrl()` now correctly constructs URLs
- **CORS Required**: Laravel must allow React's origin (localhost:3000)

#### **Critical Fixes Applied:**
1. **Storage Symlink**: Must be created with `php artisan storage:link` in Laravel
2. **CORS Configuration**: Laravel must allow React origin
3. **Path Consistency**: Store only `'images/filename.jpg'` in database
4. **Frontend URL Construction**: Updated `getImageUrl()` for separate architecture

#### **Image Components:**
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

### ✅ Authentication Rate Limiting - FULLY IMPLEMENTED
```javascript
// Custom ThrottleLogin middleware protects login endpoint
// Limits: 5 attempts per minute per IP
// Returns: 429 with "Too many login attempts. Please try again in X seconds."
```

**Features:**
- Protects against brute-force attacks
- Clear error messages with countdown timer
- Custom middleware bypasses CSRF issues
- Automatically resets after successful login

---

## 🛡️ ENHANCED ERROR HANDLING SYSTEM

### Network Error Detection:
- **No Internet**: "Problème de connexion internet. Veuillez vérifier votre connexion et réessayer."
- **Timeout**: "La requête a expiré. Veuillez vérifier votre connexion internet et réessayer."
- **Server Unreachable**: Clear network error messages
- **Rate Limiting**: "Too many login attempts. Please try again in X seconds."

### Visual Error Indicators:
- **Red Theme**: Standard validation errors (email taken, invalid code, etc.)
- **Yellow Theme**: Network-related errors with WiFi off icon
- **Green Theme**: Success messages with checkmark icons
- **429 Errors**: Rate limiting warnings with timer display

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
- ✅ CORS errors (new for separate architecture)
- ✅ Rate limiting errors with automatic countdown

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

## 🗂️ UPDATED FILE STRUCTURE FOR SEPARATE ARCHITECTURE

### BACKEND (Laravel) - `/back/`
```
back/
├── app/
│   ├── Models/
│   │   ├── Utilisateur.php (HasApiTokens trait, image relationships)
│   │   ├── Article.php (With likes, comments, utilisateur relationships)
│   │   ├── Commentaire.php (With utilisateur, article relationships)
│   │   ├── Amitie.php (Friendship relationships - composite keys)
│   │   ├── Message.php
│   │   └── Liker.php (Like relationships - NO date column)
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php (Image upload support)
│   │   │   ├── VerificationController.php
│   │   │   ├── PostController.php (Complete: create, feed, like, comment, delete)
│   │   │   ├── AmitieController.php (Complete friend management)
│   │   │   ├── UserController.php
│   │   │   └── MessageController.php
│   │   └── Middleware/
│   │       ├── ThrottleLogin.php (Custom rate limiting middleware)
│   │       └── VerifyCsrfToken.php (CSRF exceptions for API)
│   └── Mail/
│       └── VerificationCodeMail.php
├── bootstrap/
│   └── app.php (Updated middleware configuration - NO statefulApi)
├── routes/
│   └── api.php (API endpoints only - no web routes for React)
├── database/
│   ├── factories/
│   │   ├── UtilisateurFactory.php
│   │   ├── ArticleFactory.php
│   │   └── CommentaireFactory.php
│   ├── migrations/ (French schema migrations + personal_access_tokens)
│   └── seeders/
│       └── UtilisateurSeeder.php
├── storage/app/public/images/ (Image storage)
└── .env (Laravel environment)
```

### FRONTEND (React) - `/front/` (New Location!)
```
front/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx (Image upload)
│   │   ├── main/
│   │   │   ├── Home.jsx (COMPLETE: posts, likes, comments, delete, images)
│   │   │   ├── Header.jsx (Profile images + integrated search)
│   │   │   ├── SideMenuNav.jsx (No search feature)
│   │   │   ├── Amitie.jsx (Complete friends section)
│   │   │   └── Modal.jsx (Confirm dialogs)
│   │   └── shared/
│   │       ├── Loader.jsx
│   │       └── ErrorBoundary.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useModal.js
│   ├── utils/
│   │   ├── api.js (Axios instance with interceptors - UPDATED for separate arch)
│   │   ├── validation.js
│   │   └── imageUrls.js (CRITICAL: updated getImageUrl() function - FIXED)
│   ├── App.jsx
│   └── index.jsx
├── public/ (Static assets)
├── package.json (React dependencies)
├── vite.config.js (Vite for React only - simplified)
└── .env (Frontend environment: VITE_API_URL)
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
- **Rate Limit Warning**: `#f97316` (orange)

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
- ⏰ **Rate Limit**: `Timer` icon

---

## 🛠️ TECHNICAL CONFIGURATION - UPDATED FOR SEPARATE ARCHITECTURE

## 🔧 **DEVELOPMENT SETUP - SEPARATE ARCHITECTURE**

### **Environment Configuration**

#### **Frontend (`front/.env`):**
```env
VITE_API_URL=http://localhost:8000/api
# For mobile testing: VITE_API_URL=http://YOUR_IP:8000/api
```

#### **Backend (`back/.env`):**
```env
APP_NAME=Laravel
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=Tulk
DB_USERNAME=tulk_user
DB_PASSWORD=Tulk123!

# CORS configuration (CRITICAL for separate architecture)
FRONTEND_URL=http://localhost:3000
# For mobile testing: FRONTEND_URL=http://YOUR_IP:3000

# Email configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tulksoft@gmail.com
MAIL_PASSWORD=gmxaokplajawlrjd
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tulksoft@gmail.com
MAIL_FROM_NAME="Tulk"
```

### **Current Bootstrap Configuration (`back/bootstrap/app.php`):**
```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        api: __DIR__ . '/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // REMOVE statefulApi() - you're using token auth
        // $middleware->statefulApi();

        // Add CORS middleware for React
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);

        $middleware->web([
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);

        $middleware->api([
            // Remove EnsureFrontendRequestsAreStateful since you're using tokens
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
```

### **Frontend Vite Configuration (`front/vite.config.js`):**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0', // Allow network access for mobile testing
    port: 3000,
    cors: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})
```

### **Backend CORS Configuration (`back/config/cors.php`):**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### **Development Commands:**

#### **Standard Development (Localhost only):**
```bash
# Terminal 1: Laravel API
cd back
php artisan serve --port=8000

# Terminal 2: React frontend
cd front
npm run dev

# Access:
# React: http://localhost:3000
# Laravel API: http://localhost:8000/api
```

#### **Mobile Testing on Same Network:**
```bash
# Find your computer's IP address
hostname -I  # Linux/Mac (example: 192.168.1.100)

# Update environment files
# In front/.env: VITE_API_URL=http://192.168.1.100:8000/api
# In back/.env: FRONTEND_URL=http://192.168.1.100:3000

# Terminal 1: Laravel on network
cd back
php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2: React on network
cd front
npm run dev -- --host 0.0.0.0

# On phone browser: http://192.168.1.100:3000
```

### **API Communication - Updated for Separate Architecture:**

#### **Frontend API Configuration (`front/src/utils/api.js`):**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;
```

#### **Image URL Helper - UPDATED AND CORRECTED (`front/src/utils/imageUrls.js`):**
```javascript
export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get Laravel backend URL from environment variable
    // IMPORTANT: Remove /api from the base URL to get Laravel root
    const baseUrl = import.meta.env.VITE_API_URL 
        ? import.meta.env.VITE_API_URL.replace('/api', '')
        : 'http://localhost:8000';
    
    // Database paths are stored as: 'images/filename.jpg'
    // Laravel serves them at: /storage/images/filename.jpg
    return `${baseUrl}/storage/${imagePath}`;
};
```

### **Security Features:**
- Password hashing with bcrypt
- Sanctum token authentication
- Form validation on both client and server
- XSS protection with React's built-in escaping
- CORS properly configured for cross-origin requests
- **Rate limiting on authentication endpoints** (5 attempts/minute)
- Secure file upload validation
- SQL injection protection with Eloquent
- **Post Deletion**: Permission checks (users can only delete their own posts)
- **Friendship Validation**: Prevents self-friending and duplicate requests
- **Authorization**: Users can only manage their own friendships
- **CSRF Protection**: For web routes, disabled for API routes

### **Performance Optimization:**
- **Lazy Loading**: Component and image lazy loading
- **Code Splitting**: Route-based code splitting
- **Caching**: API response caching where appropriate
- **Optimized Assets**: Compressed images and minified code
- **Efficient Queries**: Optimized database queries with indexes
- **Image Optimization**: Automatic compression and responsive sizing
- **Debounced Search**: 500ms delay for friend search
- **Limited Results**: Friends suggestions limited to 10, search to 20

---

## 🚀 QUICK START COMMANDS - UPDATED FOR SEPARATE ARCHITECTURE

### **Initial Setup:**
```bash
# Clone repository
git clone <your-repo>
cd Tulk-project

# Backend setup
cd back
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link  # CRITICAL FOR IMAGES

# Frontend setup
cd ../front
npm install
```

### **Development Servers:**
```bash
# Standard Development (two terminals)
# Terminal 1: Laravel API
cd back && php artisan serve --port=8000

# Terminal 2: React
cd front && npm run dev

# Access: http://localhost:3000
```

### **Mobile Testing:**
```bash
# Find your IP
hostname -I

# Update .env files with your IP
# front/.env: VITE_API_URL=http://YOUR_IP:8000/api
# back/.env: FRONTEND_URL=http://YOUR_IP:3000

# Start servers for mobile
# Terminal 1: Laravel on network
cd back && php artisan serve --host=0.0.0.0 --port=8000

# Terminal 2: React on network
cd front && npm run dev -- --host 0.0.0.0

# On phone: http://YOUR_IP:3000
```

### **Database Operations:**
```bash
# Run migrations (INCLUDES personal_access_tokens)
cd back
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

### **Storage Setup - CRITICAL:**
```bash
# In Laravel backend
cd back
php artisan storage:link

# Ensure permissions
chmod -R 755 storage/app/public
chmod -R 755 public/storage

# Ensure correct directory structure
mkdir -p storage/app/public/images

# Remove incorrect nested directories if they exist
rm -rf storage/app/public/public 2>/dev/null || true
```

### **Email Testing:**
```bash
# Test email configuration
cd back
php artisan tinker
Mail::raw('Test', fn($m) => $m->to('test@test.com')->subject('Test'))

# Preview email templates
php artisan vendor:publish --tag=laravel-mail
```

### **Cache & Configuration:**
```bash
# Clear all caches (run after major changes)
cd back
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

### **Factory Commands:**
```bash
# Create a factory
cd back
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

### **Frontend Development:**
```bash
# Install dependencies
cd front
npm install

# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🧪 TESTING CREDENTIALS

### Available Test Users:
- **Regular User**: sissolionel@gmail.com / 123456
- **Admin User**: admin@tulk.com / admin123 (if created)
- **Moderator User**: mod@tulk.com / mod123 (if created)

### API Testing Endpoints:
- **Authentication**:
  - `POST /api/login` (Rate limited: 5 attempts/minute)
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

## 🐛 KNOWN ISSUES & SOLUTIONS - UPDATED FOR SEPARATE ARCHITECTURE

### Issue: Images Not Displaying (Broken Image Icons)
- **Problem**: Images saved in database but not displaying in frontend
- **Root Cause**: Incorrect URL construction in `getImageUrl()` function
- **Solution**: 
  1. Update `front/src/utils/imageUrls.js` with the corrected function
  2. Ensure database stores paths as `'images/filename.jpg'`
  3. Test direct image access: `http://localhost:8000/storage/images/filename.jpg`

### Issue: CORS Errors in Browser Console
- **Problem**: React (localhost:3000) can't call Laravel API (localhost:8000)
- **Root Cause**: Missing or incorrect CORS configuration
- **Solution**:
  1. Install CORS package: `composer require fruitcake/laravel-cors`
  2. Update `back/config/cors.php` with correct origins
  3. Clear cache: `php artisan config:clear`
  4. Ensure `FRONTEND_URL` is set in Laravel `.env`

### Issue: Image Upload Fails with "Image was not saved to disk"
- **Problem**: Images weren't being saved to correct location
- **Root Cause**: Incorrect storage path in PostController
- **Solution**: Use `$image->store('images', 'public')` instead of custom path logic

### Issue: Liker Table Column Not Found Error
- **Problem**: `SQLSTATE[42S22]: Column not found: 1054 Unknown column 'date'`
- **Root Cause**: Liker table doesn't have date column (French schema)
- **Solution**: Remove `'date' => now()` from Liker creation in PostController

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

### Issue: Mobile Testing - Can't Connect from Phone
- **Problem**: Phone can't access development server
- **Solution**:
  1. Ensure phone and computer are on same Wi-Fi network
  2. Check firewall allows ports 3000 and 8000
  3. Use correct local IP address in environment files
  4. Run Laravel with `--host=0.0.0.0`
  5. Run React with `--host 0.0.0.0`

### Issue: API Calls Going to Wrong URL
- **Problem**: React still trying to call `/api` instead of full URL
- **Root Cause**: `VITE_API_URL` not set in frontend `.env`
- **Solution**: Ensure `front/.env` has `VITE_API_URL=http://localhost:8000/api`

### Issue: React Hot Reload Not Working
- **Problem**: Changes to React components don't reflect immediately
- **Solution**: 
  1. Ensure running `npm run dev` not `npm run build`
  2. Check Vite is running on correct port (3000)
  3. Clear browser cache

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

### Issue: CSRF Errors on Login
- **Problem**: Browser login gets 419 CSRF token mismatch
- **Root Cause**: Using stateful API with CSRF protection
- **Solution**: 
  1. Remove `statefulApi()` from `bootstrap/app.php`
  2. Remove `EnsureFrontendRequestsAreStateful` from API middleware
  3. Use token authentication instead of cookie/session

### Issue: Rate Limiting Not Working
- **Problem**: Login attempts not being limited
- **Root Cause**: CSRF blocking requests before rate limiter
- **Solution**: Use custom `ThrottleLogin` middleware that bypasses CSRF

---

## 🔄 UPDATE LOG - MAJOR MILESTONES

### Latest Updates (December 2024):
- ✅ **IMAGE DISPLAY FIX**: Corrected `getImageUrl()` function to properly construct URLs
- ✅ **AUTHENTICATION FIX**: Removed `statefulApi()` to fix CSRF issues
- ✅ **RATE LIMITING**: Implemented custom `ThrottleLogin` middleware (5 attempts/minute)
- ✅ **ARCHITECTURE CHANGE**: Switched from Monolithic to Separate React + Laravel API
- ✅ **Frontend Moved**: React components now in `/front/src/` folder
- ✅ **Backend Simplified**: Laravel now pure API in `/back/` folder
- ✅ **CORS Configured**: Proper cross-origin communication setup
- ✅ **Mobile Testing Simplified**: No more Vite proxy headaches

### Previous Updates:
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

### Image Display Troubleshooting:
1. **Images not showing in browser**:
   ```bash
   # Test image URL directly
   curl -I http://localhost:8000/storage/images/filename.jpg
   # Should return 200 OK
   
   # Check storage symlink
   ls -la back/public/storage
   # Should point to ../storage/app/public
   
   # Check file exists
   ls -la back/storage/app/public/images/filename.jpg
   ```

2. **Check database storage**:
   ```bash
   php artisan tinker
   App\Models\Article::find(1)->image;
   # Should return: 'images/filename.jpg'
   ```

3. **Check frontend URL construction**:
   ```javascript
   // In browser console
   console.log(getImageUrl('images/test.jpg'));
   // Should log: http://localhost:8000/storage/images/test.jpg
   ```

### Common Setup Issues:
1. **CORS Errors**: 
   - Install CORS: `composer require fruitcake/laravel-cors`
   - Update `back/config/cors.php`
   - Set `FRONTEND_URL` in Laravel `.env`

2. **API Connection Issues**:
   - Check `VITE_API_URL` in frontend `.env`
   - Verify Laravel is running: `php artisan serve --port=8000`
   - Check React is running: `npm run dev` in front/

3. **Mobile Testing Issues**:
   - Phone and computer on same Wi-Fi
   - Update IP addresses in both `.env` files
   - Run both servers with `--host=0.0.0.0`
   - Check firewall allows ports 3000 and 8000

4. **Email Not Sending**: Check Gmail App Password and .env configuration

5. **Routes Not Working**: Clear route cache: `php artisan route:clear`

6. **Database Errors**: Verify migration order and foreign key constraints

7. **Component Styling Issues**: Verify Tailwind CSS configuration and imports

8. **Authentication Problems**: Check Sanctum configuration and token handling

9. **Token Errors**: Ensure personal_access_tokens table exists and HasApiTokens trait is used

10. **Like Errors**: Ensure Liker model doesn't expect date column (French schema)

11. **Friends System Errors**:
    - Check Amitie model has composite key configuration
    - Verify friends routes are inside sanctum middleware
    - Check database has Amitie table with proper structure

### Debugging Tools:
- **Laravel Logs**: `tail -f back/storage/logs/laravel.log`
- **Route List**: `php artisan route:list` (in back/)
- **Database**: `php artisan tinker` (in back/)
- **Frontend**: Browser DevTools Network tab
- **Email Testing**: Mailtrap or Gmail test accounts
- **React DevTools**: Component inspection and state debugging
- **Storage Debug**: Check `back/storage/app/public/images/` directory
- **API Testing**: Postman or Insomnia for endpoint testing
- **Image Debug**: Test image URLs directly in browser

### Performance Monitoring:
- **Database**: `php artisan db:monitor` (in back/)
- **Cache**: `php artisan cache:stats` (in back/)
- **Queue**: `php artisan queue:monitor` (in back/)
- **Storage**: `php artisan storage:info` (in back/)
- **Frontend**: Lighthouse audits and performance profiling
- **Backend**: Laravel Debugbar and query monitoring
- **Network**: Browser DevTools Network tab for API call timings

### Mobile Testing Checklist:
- [ ] Computer and phone on same Wi-Fi network
- [ ] Firewall allows ports 3000 and 8000
- [ ] Correct IP in `front/.env` (VITE_API_URL)
- [ ] Correct IP in `back/.env` (FRONTEND_URL)
- [ ] Laravel running with `--host=0.0.0.0` (in back/)
- [ ] React running with `--host 0.0.0.0` (in front/)
- [ ] Browser cache cleared on phone
- [ ] Test connection from phone browser
- [ ] Test image display on phone

### Deployment Checklist:
- [ ] Environment variables configured for production
- [ ] Database migrations run (including personal_access_tokens)
- [ ] Storage link created (`php artisan storage:link`)
- [ ] Cache cleared and optimized
- [ ] React built for production (`npm run build` in front/)
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

## 🏗️ ARCHITECTURE OVERVIEW - UPDATED FOR SEPARATE ARCHITECTURE

### **New Architecture: Separate React + Laravel API**

#### **Backend Architecture (Laravel - `/back/`):**
- **Laravel 11+** with modern application structure
- **French Database Schema** with custom migrations
- **API-First Design** with Laravel Sanctum
- **Service Pattern** for business logic separation
- **Repository Pattern** for data access
- **Event-Driven Architecture** for real-time features
- **Queue System** for background processing
- **File Storage System** with correct image paths
- **Pure API** - no frontend rendering responsibilities
- **Middleware Configuration**: Custom rate limiting, CORS enabled, CSRF disabled for API

#### **Frontend Architecture (React - `/front/`):**
- **React 18** with functional components and hooks
- **Context API** for state management (AuthContext)
- **React Router** for navigation
- **Axios** for API communication with interceptors
- **Tailwind CSS** for styling
- **Component-Based Design** for reusability
- **Custom Hooks** for logic abstraction
- **Error Boundaries** for graceful error handling
- **Image Management** with preview and URL construction
- **Standalone Application** - independent from Laravel
- **Utility Functions**: Correct image URL construction for separate architecture

#### **Data Flow - Separate Architecture:**
1. **User Action** → React Component (in `/front/src/`)
2. **API Call** → Laravel Controller (in `/back/app/Http/Controllers/`)
3. **Business Logic** → Service Methods (like, comment, friend management)
4. **Data Persistence** → Eloquent Models (French schema with composite keys)
5. **File Processing** → Storage System (correct path: `back/storage/app/public/images/`)
6. **Response** → React State Update
7. **UI Update** → Component Re-render with new data
8. **Real-time Updates** → Future: WebSocket Events

#### **Image Flow - Corrected:**
1. **Image Upload**: React → Laravel API → `storage('images', 'public')`
2. **Path Storage**: Database stores `'images/filename.jpg'`
3. **URL Construction**: Frontend uses `getImageUrl('images/filename.jpg')`
4. **Image Serving**: Laravel serves from `public/storage/images/filename.jpg`
5. **Frontend Display**: React renders `<img src="http://localhost:8000/storage/images/filename.jpg">`

#### **Development Workflow - New:**
1. **Local Development**:
   - Laravel: `localhost:8000` (API only)
   - React: `localhost:3000` (frontend only)
   - CORS configured for cross-origin communication

2. **Mobile Testing**:
   - Laravel: `0.0.0.0:8000` (network accessible)
   - React: `YOUR_IP:3000` (network accessible)
   - Phone accesses React, which calls Laravel API

3. **Production**:
   - Option 1: Combined (React build in Laravel public folder)
   - Option 2: Separate (React on Vercel, Laravel on Forge)
   - Same API endpoints, different deployment strategies

#### **Security Architecture:**
- **Authentication**: Laravel Sanctum tokens
- **Authorization**: Role-based access control
- **Validation**: Form request validation with French messages
- **Sanitization**: Input filtering and output escaping
- **CORS**: Cross-origin resource sharing configuration (critical for separate architecture)
- **HTTPS**: Secure communication enforcement
- **Rate Limiting**: API endpoint protection (login: 5 attempts/minute)
- **File Validation**: Secure upload validation (5MB max, image types)
- **Permission Checks**: Users can only manage their own content and friendships
- **Friendship Security**: Prevents self-friending and duplicate requests
- **CSRF Protection**: Disabled for API routes, enabled for web routes

#### **Scalability Considerations:**
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
- **Independent Scaling**: Frontend and backend can scale independently

#### **Benefits of Separate Architecture:**
1. ✅ **Clear Separation**: Frontend and backend responsibilities clearly defined
2. ✅ **Independent Development**: Can work on frontend without running Laravel
3. ✅ **Better Tooling**: Use best tools for each part (Vite for React, Laravel for API)
4. ✅ **Easier Testing**: Test API independently with Postman, test UI independently
5. ✅ **Flexible Deployment**: Can deploy separately (React to static hosting, Laravel to API server)
6. ✅ **Team Scalability**: Frontend and backend teams can work independently
7. ✅ **Technology Flexibility**: Can swap frontend framework without affecting backend
8. ✅ **Performance**: Static frontend assets can be served from CDN
9. ✅ **Mobile Testing**: Much simpler setup without proxy configuration
10. ✅ **Future Proof**: Ready for mobile apps using same API

#### **Migration Path from Monolithic:**
1. **Extracted React**: Moved from `back/resources/js/` to `front/src/`
2. **Updated API Calls**: Changed from relative `/api` to absolute `VITE_API_URL`
3. **Updated Image URLs**: `getImageUrl()` now correctly constructs URLs
4. **Added CORS**: Laravel configured to accept requests from React origin
5. **Separated Environment**: Different `.env` files for frontend and backend
6. **Simplified Vite Config**: No more Laravel Vite plugin or proxy configuration
7. **Fixed CSRF**: Removed stateful API configuration for token-based auth
8. **Added Rate Limiting**: Custom middleware for login protection

---

**Last Updated**: December 2024  
**Database**: Tulk (French Schema - Liker without date column, Amitie with composite keys)  
**Stack**: Laravel 11 + React 18 + Tailwind CSS v4 + MySQL + Sanctum  
**Architecture**: ✅ **SEPARATE** (React Frontend + Laravel API Backend)  
**Development**: ✅ Localhost + Mobile Testing Configurations  
**Authentication**: ✅ Token-based with Rate Limiting (5 attempts/minute)  
**Image System**: ✅ **FIXED** (Correct URL construction and storage)  
**Status**: ✅ Authentication Complete → ✅ Navigation Complete → ✅ Post CRUD Complete → ✅ Image System Complete → ✅ Like System Complete → ✅ Comment System Complete → ✅ Post Deletion Complete → ✅ Friends System Complete → ✅ Architecture Migration Complete → ✅ Rate Limiting Complete → ✅ CSRF Fix Complete  
**Testing**: ✅ Manual Testing → 🚧 Automated Test Suite  
**Deployment**: 🚧 Development → 🚧 Staging → 🚧 Production Ready