# 🚀 TULK CHAT APPLICATION - PROJECT MANUAL

## 📋 CRITICAL PROJECT CONSIDERATIONS & ARCHITECTURE

### 1. DATABASE SCHEMA - FRENCH NAMING CONVENTION
- **ALL table names** use French names with Capital first letter: Utilisateur, Article, Commentaire, Amitie, Message, Liker
- **ALL column names** use French abbreviations: id_uti, id_arti, statut, mdp, prenom, nom
- **NO Laravel timestamps** - Using custom date fields from original SQL
- **Foreign keys** follow French naming: id_uti_1, id_uti_2

### 2. MIGRATION ARCHITECTURE
- Migrations must EXACTLY match original SQL structure
- No automatic id bigint - Using integer('id', true) for exact int(255) match
- Foreign keys defined in SEPARATE migration to match SQL constraint order
- No timestamps() - Using custom timestamp fields from SQL

### 3. DATABASE TIMESTAMPS - IMPORTANT
- French tables don't have timestamps by default
- Add `public $timestamps = false;` to all French models
- This matches original SQL structure exactly
- Models affected: Utilisateur, Article, Commentaire, Amitie, Message, Liker

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

### 8. FRONTEND-BACKEND INTEGRATION
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

### 🚧 FUTURE FEATURES
- Friendship system with request management
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

### Friends Section
- **Friend Requests**: Incoming friendship requests management
- **Friends List**: Grid of user's friends with profile images and quick actions
- **Find Friends**: Search and discovery functionality
- **Friend Management**: Add/remove friends and manage relationships

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
- Future: Amitie, Message, Liker factories

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
│   ├── Amitie.php (Friendship relationships)
│   ├── Message.php
│   └── Liker.php (Like relationships - NO date column)
├── Http/Controllers/
│   ├── AuthController.php (Image upload support)
│   ├── VerificationController.php
│   ├── PostController.php (Complete: create, feed, like, comment, delete)
│   ├── UserController.php
│   └── MessageController.php
├── Mail/
│   └── VerificationCodeMail.php
routes/
├── api.php (API endpoints with social features)
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
│   │   ├── Header.jsx (Profile images)
│   │   ├── SideMenuNav.jsx (No search feature)
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
- **Background**: #0a0a0a (black)
- **Card**: #141414 (dark gray)
- **Border**: #262626 (medium gray)
- **Primary**: #ffffff (white)
- **Text**: #ededed (light gray)
- **Secondary Text**: #9ca3af (gray-400)
- **Success**: #10b981 (green)
- **Error**: #ef4444 (red)
- **Warning**: #f59e0b (yellow)
- **Accent**: #3b82f6 (blue)
- **Like Active**: #ef4444 (red)

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
- ✅ **Success**: CheckCircle (green)
- ⚠️ **Errors**: AlertCircle (red)
- 📶 **Network**: WifiOff (yellow)
- 👁️ **Password**: Eye/EyeOff toggle
- 🔄 **Loading**: Loader2 spinner
- 👤 **User**: User icon
- 🔔 **Notifications**: Bell icon
- 💬 **Messages**: MessageCircle icon
- 👥 **Friends**: Users icon
- 📊 **Dashboard**: LayoutDashboard icon
- 🖼️ **Images**: Image icon
- 📷 **Camera**: Camera icon
- ❌ **Remove**: X icon
- ❤️ **Like**: Heart icon (filled when active)
- 🗑️ **Delete**: Trash2 icon
- 💬 **Comment**: MessageCircle icon

---

## 🛠️ TECHNICAL CONFIGURATION - UPDATED

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

---

## 🚀 QUICK START COMMANDS - UPDATED

### Development Servers:
```bash
# Backend (Laravel)
php artisan serve --port=8000

# Frontend (Vite)
npm run dev

# Both with process manager
npm run dev:full
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
- **Login**: POST `/api/login`
- **Register**: POST `/api/register`
- **Send Verification**: POST `/api/send-verification`
- **Verify Code**: POST `/api/verify-code`
- **Get Feed Posts**: GET `/api/posts/feed`
- **Create Post**: POST `/api/posts` (supports multipart/form-data)
- **Like Post**: POST `/api/posts/{id}/like`
- **Get Comments**: GET `/api/posts/{id}/comments`
- **Add Comment**: POST `/api/posts/{id}/comments`
- **Delete Post**: DELETE `/api/posts/{post}`

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

### Next Features Planned:
- 🔄 **Friendship System**: Friend requests and management
- 🔄 **Real-time Messaging**: Chat functionality
- 🔄 **Notification System**: Real-time notifications
- 🔄 **Post Editing**: Edit existing posts
- 🔄 **Multiple Images**: Support for multiple images per post
- 🔄 **Image Cropping**: In-app image editing
- 🔄 **Admin Dashboard**: User management and analytics

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

---

## 📞 SUPPORT & TROUBLESHOOTING - UPDATED

### Common Setup Issues:
1. **Email Not Sending**: Check Gmail App Password and .env configuration
2. **Images Not Loading**: 
   - Verify storage link: `php artisan storage:link`
   - Check permissions: `chmod -R 755 storage/app/public`
   - Clear caches: `php artisan config:clear` etc.
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

### Debugging Tools:
- **Laravel Logs**: `tail -f storage/logs/laravel.log`
- **Route List**: `php artisan route:list`
- **Database**: `php artisan tinker`
- **Frontend**: Browser DevTools Network tab
- **Email Testing**: Mailtrap or Gmail test accounts
- **Vite Debugging**: Browser console and Vite dev tools
- **React DevTools**: Component inspection and state debugging
- **Storage Debug**: Check `storage/app/public/images/` directory

### Performance Monitoring:
- **Database**: `php artisan db:monitor`
- **Cache**: `php artisan cache:stats`
- **Queue**: `php artisan queue:monitor`
- **Storage**: `php artisan storage:info`
- **Frontend**: Lighthouse audits and performance profiling
- **Backend**: Laravel Debugbar and query monitoring

### Deployment Checklist:
- [ ] Environment variables configured
- [ ] Database migrations run (including personal_access_tokens)
- [ ] Storage link created (`php artisan storage:link`)
- [ ] Cache cleared and optimized
- [ ] Frontend assets built
- [ ] File permissions set correctly
- [ ] SSL certificate installed
- [ ] Backup system configured
- [ ] Monitoring and logging setup
- [ ] Security headers configured

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

### Data Flow - Enhanced:
1. **User Action** → React Component (Home.jsx)
2. **API Call** → Laravel Controller (PostController)
3. **Business Logic** → Service Methods (like, comment, delete)
4. **Data Persistence** → Eloquent Models (French schema)
5. **File Processing** → Storage System (correct path: storage/app/public/images/)
6. **Response** → React State Update
7. **UI Update** → Component Re-render with new data
8. **Real-time Updates** → Future: WebSocket Events

### Security Architecture:
- **Authentication**: Laravel Sanctum tokens
- **Authorization**: Role-based access control
- **Validation**: Form request validation
- **Sanitization**: Input filtering and output escaping
- **CORS**: Cross-origin resource sharing configuration
- **HTTPS**: Secure communication enforcement
- **Rate Limiting**: API endpoint protection
- **File Validation**: Secure upload validation
- **Permission Checks**: Users can only delete their own posts

### Scalability Considerations:
- **Database Indexing**: Optimized query performance
- **Caching Strategy**: Multi-layer caching system
- **Asset Optimization**: Minified and compressed resources
- **Lazy Loading**: On-demand component and data loading
- **Background Processing**: Queue system for heavy operations
- **Horizontal Scaling**: Stateless application design
- **CDN Integration**: For static assets and images

---

**Last Updated**: December 2024  
**Database**: Tulk (French Schema - Liker without date column)  
**Stack**: Laravel 11 + React 18 + Tailwind CSS v4 + MySQL + Sanctum  
**Status**: ✅ Authentication Complete → ✅ Navigation Complete → ✅ Post CRUD Complete → ✅ Image System Complete → ✅ Like System Complete → ✅ Comment System Complete → ✅ Post Deletion Complete  
**Testing**: ✅ Manual Testing → 🚧 Automated Test Suite  
**Deployment**: 🚧 Development → 🚧 Staging → 🚧 Production Ready  

---