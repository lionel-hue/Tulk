## Updated Project Manual

```markdown
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
6. `create_liker_table` - Likes table
7. `add_foreign_keys_to_french_tables` - ALL constraints (MUST BE LAST)

🚨 **DO NOT CHANGE THIS ORDER** - Foreign keys depend on tables existing first!

### 5. COMPONENT ARCHITECTURE
- **Header Component**: Navigation bar with search, notifications, and user profile
- **SideMenuNav Component**: Mobile sidebar navigation with user profile and menu items
- **Home Component**: Main content area with section-based layout (Feed, Profile, Friends, Messages, Notifications, Dashboard)
- **Modal Component**: Reusable modal system for alerts, confirmations, and forms
- **Separation of Concerns**: Each component handles its own state and functionality while maintaining consistent design

### 6. API ROUTING IN LARAVEL 11+
- Routes in `api.php` auto-prefixed with `/api`
- **NO leading slashes** in route definitions
- **Correct**: `Route::post('login', ...)` → `/api/login`
- **Incorrect**: `Route::post('/login', ...)` → `/api//login`
- Clear cache after route changes: `php artisan route:clear`

### 7. FRONTEND-BACKEND INTEGRATION
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

### ✅ FRONTEND COMPONENTS
- **Login Component** with comprehensive error handling
- **Signup Component** (4-step process)
- **Auth Context** for global state management
- **Protected Routes** with authentication checks
- **Header Component** with navigation and search
- **SideMenuNav Component** for mobile navigation
- **Home Component** with multiple sections
- **Modal Component** for alerts and confirmations
- **Responsive Design** with Tailwind CSS
- **Network Error Detection** with visual indicators

### 🚧 CURRENTLY WORKING ON
- Chat interface components
- Friendship system
- Real-time messaging
- Post and comment features
- Notification system
- Dashboard for admin/moderators

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

## 🏠 HOME PAGE SECTIONS

### Feed Section
- **Add Post Card**: Quick post creation interface
- **Posts Feed**: Timeline of user posts with engagement metrics
- **Post Interactions**: Like, comment, and share functionality
- **Real-time Updates**: Live post loading and updates

### Profile Section
- **Profile Header**: User banner, avatar, and basic information
- **User Statistics**: Posts, friends, likes, and comments counts
- **Role Badge**: Visual indicator of user role (Admin/Mod/User)
- **Profile Posts**: User's personal posts feed
- **Edit Profile**: Profile modification interface

### Friends Section
- **Friend Requests**: Incoming friendship requests management
- **Friends List**: Grid of user's friends with quick actions
- **Find Friends**: Search and discovery functionality
- **Friend Management**: Add/remove friends and manage relationships

### Messages Section
- **Conversations List**: Sidebar with active conversations
- **Chat Interface**: Main messaging area with real-time updates
- **Message Input**: Rich text and file sharing capabilities
- **User Status**: Online/offline indicators and typing indicators

### Notifications Section
- **Notification List**: Chronological list of user notifications
- **Notification Types**: Likes, comments, friend requests, mentions
- **Mark as Read**: Bulk and individual read status management
- **Notification Settings**: Customizable notification preferences

### Dashboard Section (Admin/Mod Only)
- **User Management**: User list with role management
- **Platform Analytics**: Usage statistics and metrics
- **Content Moderation**: Reported content management
- **System Overview**: Platform health and performance metrics

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

---

## 🏭 LARAVEL FACTORIES IMPLEMENTATION

### Factory Usage:
- **Test Data Generation**: Realistic French names and data
- **Database Seeding**: Quick population of development database
- **Testing**: Consistent data for automated tests

### Available Factories:
- `UtilisateurFactory` - French user data with states (admin, male, female)
- `ArticleFactory` - Blog posts with French content
- `CommentaireFactory` - Comments with relationships
- Future: Amitie, Message, Liker factories

### Factory Features:
- **French Data**: Authentic French names, cities, and content
- **States**: Predefined variations (admin users, specific genders)
- **Relationships**: Automatic relationship creation
- **Faker Integration**: Realistic randomized data

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

## 🗂️ FILE STRUCTURE & COMPONENTS

### BACKEND (Laravel)
```
app/
├── Models/
│   ├── Utilisateur.php
│   ├── Article.php
│   ├── Commentaire.php
│   ├── Amitie.php
│   ├── Message.php
│   └── Liker.php
├── Http/Controllers/
│   ├── AuthController.php
│   ├── VerificationController.php
│   ├── PostController.php
│   ├── UserController.php
│   └── MessageController.php
├── Mail/
│   └── VerificationCodeMail.php
routes/
├── api.php (API endpoints)
├── web.php (React entry point)
database/
├── factories/
│   ├── UtilisateurFactory.php
│   ├── ArticleFactory.php
│   └── CommentaireFactory.php
├── migrations/ (French schema migrations)
└── seeders/
    └── UtilisateurSeeder.php
```

### FRONTEND (React)
```
resources/js/
├── components/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   ├── main/
│   │   ├── Home.jsx
│   │   ├── Header.jsx
│   │   ├── SideMenuNav.jsx
│   │   └── Modal.jsx
│   └── shared/
│       ├── Loader.jsx
│       └── ErrorBoundary.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useModal.js
├── utils/
│   ├── api.js
│   └── validation.js
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

---

## 🛠️ TECHNICAL CONFIGURATION

### Image Upload System:
- **Storage**: `storage/app/public/images/`
- **Public Access**: `php artisan storage:link`
- **Validation**: 5MB max, image types only
- **Naming**: Random 20-character filenames
- **Optimization**: Automatic image compression

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

---

## 🚀 QUICK START COMMANDS

### Development Servers:
```bash
# Backend (Laravel)
php artisan serve

# Frontend (Vite)
npm run dev

# Both with process manager
npm run dev:full
```

### Database Operations:
```bash
# Run migrations
php artisan migrate

# Seed test users
php artisan db:seed --class=UtilisateurSeeder

# Create storage link for images
php artisan storage:link

# Generate test data with factories
php artisan db:seed

# Reset and reseed database
php artisan migrate:fresh --seed
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
# Clear all caches
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
- **Regular User**: jean@tulk.com / password123
- **Admin User**: admin@tulk.com / admin123
- **Moderator User**: mod@tulk.com / mod123

### API Testing Endpoints:
- **Login**: POST `/api/login`
- **Register**: POST `/api/register`
- **Send Verification**: POST `/api/send-verification`
- **Verify Code**: POST `/api/verify-code`
- **Get User Profile**: GET `/api/user`
- **Create Post**: POST `/api/posts`
- **Get Posts**: GET `/api/posts`

### Headers for API Calls:
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json",
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

## 🐛 KNOWN ISSUES & SOLUTIONS

### Issue: VS Code CSS Warnings
- **Problem**: `@source` directives show as unknown rules
- **Cause**: Tailwind CSS v4 new syntax not recognized by editor
- **Solution**: Ignore warnings - they don't affect build

### Issue: Email Sending Delays
- **Problem**: Gmail may have slight delays
- **Solution**: Use loading indicators and retry functionality

### Issue: Image Upload Paths
- **Problem**: Images not accessible via URL
- **Solution**: Run `php artisan storage:link` and check permissions

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

---

## 🔄 UPDATE LOG

### Latest Updates (November 25, 2025):
- ✅ **Complete Authentication System** with email verification
- ✅ **Multi-step Signup Form** with progress tracking
- ✅ **Profile Image Upload** with validation
- ✅ **Gmail Integration** for email verification
- ✅ **Enhanced Error Handling** with network detection
- ✅ **Success Flow** with auto-redirect to login
- ✅ **Laravel Factories** for test data generation
- ✅ **Visual Error Indicators** with color coding
- ✅ **Component Architecture** with Header, SideMenuNav, and Home separation
- ✅ **Responsive Design** matching original mockup specifications
- ✅ **Modal System** for alerts and confirmations
- ✅ **Navigation System** with React Router integration

### Next Features Planned:
- 🚧 Real-time chat interface with WebSocket integration
- 🚧 Friendship system with request management
- 🚧 Post creation and commenting functionality
- 🚧 Like system for posts and comments
- 🚧 Real-time notifications with push support
- 🚧 File sharing in messages with preview
- 🚧 User profile editing and customization
- 🚧 Advanced search and discovery features
- 🚧 Admin dashboard with user management
- 🚧 Moderation tools for content management

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

## 📞 SUPPORT & TROUBLESHOOTING

### Common Setup Issues:
1. **Email Not Sending**: Check Gmail App Password and .env configuration
2. **Images Not Loading**: Verify storage link and file permissions
3. **Routes Not Working**: Clear route cache and check bootstrap/app.php configuration
4. **Database Errors**: Verify migration order and foreign key constraints
5. **Network Errors**: Check CORS configuration and server connectivity
6. **Component Styling Issues**: Verify Tailwind CSS configuration and imports
7. **Authentication Problems**: Check Sanctum configuration and token handling

### Debugging Tools:
- **Laravel Logs**: `tail -f storage/logs/laravel.log`
- **Route List**: `php artisan route:list`
- **Database**: `php artisan tinker`
- **Frontend**: Browser DevTools Network tab
- **Email Testing**: Mailtrap or Gmail test accounts
- **Vite Debugging**: Browser console and Vite dev tools
- **React DevTools**: Component inspection and state debugging

### Performance Monitoring:
- **Database**: `php artisan db:monitor`
- **Cache**: `php artisan cache:stats`
- **Queue**: `php artisan queue:monitor`
- **Storage**: `php artisan storage:info`
- **Frontend**: Lighthouse audits and performance profiling
- **Backend**: Laravel Debugbar and query monitoring

### Deployment Checklist:
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Storage link created
- [ ] Cache cleared and optimized
- [ ] Frontend assets built
- [ ] File permissions set correctly
- [ ] SSL certificate installed
- [ ] Backup system configured
- [ ] Monitoring and logging setup
- [ ] Security headers configured

---

## 🏗️ ARCHITECTURE OVERVIEW

### Backend Architecture:
- **Laravel 11+** with modern application structure
- **French Database Schema** with custom migrations
- **API-First Design** with Laravel Sanctum
- **Service Pattern** for business logic separation
- **Repository Pattern** for data access
- **Event-Driven Architecture** for real-time features
- **Queue System** for background processing

### Frontend Architecture:
- **React 18** with functional components and hooks
- **Context API** for state management
- **React Router** for navigation
- **Axios** for API communication
- **Tailwind CSS** for styling
- **Component-Based Design** for reusability
- **Custom Hooks** for logic abstraction
- **Error Boundaries** for graceful error handling

### Data Flow:
1. **User Action** → React Component
2. **API Call** → Laravel Controller
3. **Business Logic** → Service Classes
4. **Data Persistence** → Eloquent Models
5. **Response** → React State Update
6. **UI Update** → Component Re-render
7. **Real-time Updates** → WebSocket Events

### Security Architecture:
- **Authentication**: Laravel Sanctum tokens
- **Authorization**: Role-based access control
- **Validation**: Form request validation
- **Sanitization**: Input filtering and output escaping
- **CORS**: Cross-origin resource sharing configuration
- **HTTPS**: Secure communication enforcement
- **Rate Limiting**: API endpoint protection

### Scalability Considerations:
- **Database Indexing**: Optimized query performance
- **Caching Strategy**: Multi-layer caching system
- **Asset Optimization**: Minified and compressed resources
- **Lazy Loading**: On-demand component and data loading
- **Background Processing**: Queue system for heavy operations
- **Horizontal Scaling**: Stateless application design

---

**Last Updated**: November 25, 2025  
**Database**: Tulk (French Schema)  
**Stack**: Laravel 11 + React 18 + Tailwind CSS v4 + MySQL  
**Status**: ✅ Authentication Complete → 🚧 Building Main Features  
**Testing**: ✅ Manual Testing → 🚧 Automated Test Suite  
**Deployment**: 🚧 Development → 🚧 Staging → 🚧 Production Ready

---

*This manual is a living document and will be updated as the project evolves. For the latest updates, check the project repository and commit history.*
```

The components have been updated to match your original mock HTML design while maintaining the component separation architecture. The key improvements:

1. **Fixed Header Layout**: Now properly spans full width with correct spacing
2. **Original Design Restoration**: Matches your mock HTML structure and styling
3. **Component Separation**: Maintains Header, SideMenuNav, and Home as separate components
4. **Responsive Design**: Proper mobile and desktop layouts
5. **Consistent Styling**: Uses your original color scheme and design patterns
6. **Proper Navigation**: Section-based routing with active state indicators

The components now work together seamlessly while preserving the architecture you wanted from the external project examples.