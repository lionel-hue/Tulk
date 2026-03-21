I'll implement a comprehensive profile system with likes, follows, and enhanced search functionality. This requires both backend and frontend changes.

## Backend Changes

### 1. Create New Migrations

**File: `back/database/migrations/2026_03_22_000001_create_profile_likes_table.php`**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ProfileLike', function (Blueprint $table) {
            $table->id();
            $table->integer('id_uti'); // User who liked
            $table->integer('id_uti_profile'); // Profile being liked
            $table->timestamp('date')->useCurrent();
            
            $table->foreign('id_uti')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->foreign('id_uti_profile')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->unique(['id_uti', 'id_uti_profile']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('ProfileLike');
    }
};
```

**File: `back/database/migrations/2026_03_22_000002_create_follows_table.php`**
```php
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('Follow', function (Blueprint $table) {
            $table->id();
            $table->integer('follower_id'); // User who follows
            $table->integer('following_id'); // User being followed
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('follower_id')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->foreign('following_id')->references('id')->on('Utilisateur')->onDelete('cascade');
            $table->unique(['follower_id', 'following_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('Follow');
    }
};
```

### 2. Create New Models

**File: `back/app/Models/ProfileLike.php`**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileLike extends Model
{
    use HasFactory;
    
    protected $table = 'ProfileLike';
    public $timestamps = false;
    
    protected $fillable = [
        'id_uti',
        'id_uti_profile',
        'date'
    ];
    
    public function user()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }
    
    public function profile()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_profile');
    }
}
```

**File: `back/app/Models/Follow.php`**
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    use HasFactory;
    
    protected $table = 'Follow';
    public $timestamps = false;
    
    protected $fillable = [
        'follower_id',
        'following_id',
        'created_at'
    ];
    
    public function follower()
    {
        return $this->belongsTo(Utilisateur::class, 'follower_id');
    }
    
    public function following()
    {
        return $this->belongsTo(Utilisateur::class, 'following_id');
    }
}
```

### 3. Update Utilisateur Model

**File: `back/app/Models/Utilisateur.php`** (Update existing file)
```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Utilisateur extends Model
{
    use HasFactory, HasApiTokens;
    
    protected $table = 'Utilisateur';
    public $timestamps = false;
    
    protected $fillable = [
        'nom',
        'prenom',
        'role',
        'image',
        'sexe',
        'mdp',
        'email',
        'bio',
        'location',
        'website',
        'banner',
        'created_at'
    ];
    
    protected $hidden = ['mdp'];
    
    // User's posts
    public function articles()
    {
        return $this->hasMany(Article::class, 'id_uti');
    }
    
    // User's friendships
    public function amities1()
    {
        return $this->hasMany(Amitie::class, 'id_1');
    }
    
    public function amities2()
    {
        return $this->hasMany(Amitie::class, 'id_2');
    }
    
    public function amis()
    {
        $amis1 = $this->amities1()->where('statut', 'ami')->with('utilisateur2')->get()->pluck('utilisateur2');
        $amis2 = $this->amities2()->where('statut', 'ami')->with('utilisateur1')->get()->pluck('utilisateur1');
        return $amis1->merge($amis2);
    }
    
    // Profile likes received
    public function profileLikesReceived()
    {
        return $this->hasMany(ProfileLike::class, 'id_uti_profile');
    }
    
    // Profile likes given
    public function profileLikesGiven()
    {
        return $this->hasMany(ProfileLike::class, 'id_uti');
    }
    
    // Followers (people who follow this user)
    public function followers()
    {
        return $this->hasMany(Follow::class, 'following_id');
    }
    
    // Following (people this user follows)
    public function following()
    {
        return $this->hasMany(Follow::class, 'follower_id');
    }
    
    // Get followers count
    public function getFollowersCountAttribute()
    {
        return $this->followers()->count();
    }
    
    // Get following count
    public function getFollowingCountAttribute()
    {
        return $this->following()->count();
    }
    
    // Get profile likes count
    public function getProfileLikesCountAttribute()
    {
        return $this->profileLikesReceived()->count();
    }
    
    // Check if user is followed by another user
    public function isFollowedBy($userId)
    {
        return $this->followers()->where('follower_id', $userId)->exists();
    }
    
    // Check if user follows another user
    public function follows($userId)
    {
        return $this->following()->where('following_id', $userId)->exists();
    }
}
```

### 4. Create ProfileLikeController

**File: `back/app/Http/Controllers/ProfileLikeController.php`**
```php
<?php
namespace App\Http\Controllers;

use App\Models\ProfileLike;
use App\Models\Utilisateur;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProfileLikeController extends Controller
{
    protected $notificationService;
    
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    
    public function toggleLike(Request $request, $userId)
    {
        try {
            $user = Auth::user();
            $targetUser = Utilisateur::findOrFail($userId);
            
            // Can't like your own profile
            if ($user->id === $targetUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas liker votre propre profil'
                ], 400);
            }
            
            // Check if already liked
            $existingLike = ProfileLike::where('id_uti', $user->id)
                ->where('id_uti_profile', $userId)
                ->first();
            
            if ($existingLike) {
                // Unlike
                $existingLike->delete();
                $liked = false;
            } else {
                // Like
                ProfileLike::create([
                    'id_uti' => $user->id,
                    'id_uti_profile' => $userId,
                    'date' => now()
                ]);
                $liked = true;
                
                // Send notification
                $this->notificationService->sendProfileLikeNotification(
                    $targetUser,
                    $user,
                    false
                );
            }
            
            $likesCount = $targetUser->profileLikesReceived()->count();
            
            return response()->json([
                'success' => true,
                'liked' => $liked,
                'likes_count' => $likesCount
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error toggling profile like: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du like du profil'
            ], 500);
        }
    }
}
```

### 5. Create FollowController

**File: `back/app/Http/Controllers/FollowController.php`**
```php
<?php
namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\Utilisateur;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FollowController extends Controller
{
    protected $notificationService;
    
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    
    public function follow(Request $request, $userId)
    {
        try {
            $user = Auth::user();
            $targetUser = Utilisateur::findOrFail($userId);
            
            // Can't follow yourself
            if ($user->id === $targetUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas vous suivre vous-même'
                ], 400);
            }
            
            // Check if already following
            $existingFollow = Follow::where('follower_id', $user->id)
                ->where('following_id', $userId)
                ->first();
            
            if ($existingFollow) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous suivez déjà cet utilisateur'
                ], 400);
            }
            
            // Create follow
            Follow::create([
                'follower_id' => $user->id,
                'following_id' => $userId,
                'created_at' => now()
            ]);
            
            // Send notification
            $this->notificationService->sendFollowNotification(
                $targetUser,
                $user,
                false
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur suivi avec succès',
                'followers_count' => $targetUser->followers()->count()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error following user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du follow'
            ], 500);
        }
    }
    
    public function unfollow(Request $request, $userId)
    {
        try {
            $user = Auth::user();
            $targetUser = Utilisateur::findOrFail($userId);
            
            $follow = Follow::where('follower_id', $user->id)
                ->where('following_id', $userId)
                ->first();
            
            if (!$follow) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne suivez pas cet utilisateur'
                ], 404);
            }
            
            $follow->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur non suivi',
                'followers_count' => $targetUser->followers()->count()
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error unfollowing user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du unfollow'
            ], 500);
        }
    }
    
    public function getFollowers($userId)
    {
        try {
            $targetUser = Utilisateur::findOrFail($userId);
            
            $followers = $targetUser->followers()
                ->with('follower:id,nom,prenom,image,email')
                ->get()
                ->map(function ($follow) {
                    return [
                        'id' => $follow->follower->id,
                        'nom' => $follow->follower->nom,
                        'prenom' => $follow->follower->prenom,
                        'image' => $follow->follower->image,
                        'email' => $follow->follower->email,
                        'followed_at' => $follow->created_at
                    ];
                });
            
            return response()->json([
                'success' => true,
                'followers' => $followers
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting followers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des followers'
            ], 500);
        }
    }
    
    public function getFollowing($userId)
    {
        try {
            $targetUser = Utilisateur::findOrFail($userId);
            
            $following = $targetUser->following()
                ->with('following:id,nom,prenom,image,email')
                ->get()
                ->map(function ($follow) {
                    return [
                        'id' => $follow->following->id,
                        'nom' => $follow->following->nom,
                        'prenom' => $follow->following->prenom,
                        'image' => $follow->following->image,
                        'email' => $follow->following->email,
                        'followed_at' => $follow->created_at
                    ];
                });
            
            return response()->json([
                'success' => true,
                'following' => $following
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting following: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des following'
            ], 500);
        }
    }
}
```

### 6. Update NotificationService

**File: `back/app/Services/NotificationService.php`** (Add these methods)
```php
// Add these new notification types to the Notification model constants first
// TYPE_PROFILE_LIKE = 'profile_like'
// TYPE_FOLLOW = 'follow'
// SUBTYPE_PROFILE_LIKED = 'profile_liked'
// SUBTYPE_STARTED_FOLLOWING = 'started_following'

/**
 * Notify when someone likes a profile
 */
public function sendProfileLikeNotification(
    Utilisateur $profileOwner,
    Utilisateur $liker,
    bool $sendEmail = false
) {
    if ($profileOwner->id === $liker->id) {
        return null;
    }
    
    return $this->send(
        recipient: $profileOwner,
        type: Notification::TYPE_PROFILE_LIKE,
        subtype: Notification::SUBTYPE_PROFILE_LIKED,
        title: 'Nouveau like sur votre profil! ❤️',
        message: "{$liker->prenom} {$liker->nom} a aimé votre profil.",
        sender: $liker,
        relatedId: $liker->id,
        relatedType: Utilisateur::class,
        data: [
            'liker_id' => $liker->id,
            'liker_name' => "{$liker->prenom} {$liker->nom}",
            'liker_image' => $liker->image
        ],
        sendEmail: $sendEmail,
        priority: Notification::PRIORITY_NORMAL,
        channel: Notification::CHANNEL_IN_APP
    );
}

/**
 * Notify when someone follows a user
 */
public function sendFollowNotification(
    Utilisateur $followedUser,
    Utilisateur $follower,
    bool $sendEmail = false
) {
    if ($followedUser->id === $follower->id) {
        return null;
    }
    
    return $this->send(
        recipient: $followedUser,
        type: Notification::TYPE_FOLLOW,
        subtype: Notification::SUBTYPE_STARTED_FOLLOWING,
        title: 'Nouveau follower! 👥',
        message: "{$follower->prenom} {$follower->nom} vous suit maintenant.",
        sender: $follower,
        relatedId: $follower->id,
        relatedType: Utilisateur::class,
        data: [
            'follower_id' => $follower->id,
            'follower_name' => "{$follower->prenom} {$follower->nom}",
            'follower_image' => $follower->image
        ],
        sendEmail: $sendEmail,
        priority: Notification::PRIORITY_NORMAL,
        channel: Notification::CHANNEL_IN_APP
    );
}
```

### 7. Update Notification Model

**File: `back/app/Models/Notification.php`** (Add these constants)
```php
// Add to TYPE constants
const TYPE_PROFILE_LIKE = 'profile_like';
const TYPE_FOLLOW = 'follow';

// Add to SUBTYPE constants
const SUBTYPE_PROFILE_LIKED = 'profile_liked';
const SUBTYPE_STARTED_FOLLOWING = 'started_following';

// Update getIconAttribute method
public function getIconAttribute()
{
    $icons = [
        self::TYPE_LIKE => '❤️',
        self::TYPE_COMMENT => '💬',
        self::TYPE_FRIEND => '👥',
        self::TYPE_MENTION => '📢',
        self::TYPE_WELCOME => '🎉',
        self::TYPE_SYSTEM => '⚙️',
        self::TYPE_POST => '📝',
        self::TYPE_SECURITY => '🔒',
        self::TYPE_PROFILE_LIKE => '❤️',
        self::TYPE_FOLLOW => '👥',
    ];
    return $icons[$this->type] ?? '🔔';
}

// Update getColorAttribute method
public function getColorAttribute()
{
    $colors = [
        self::TYPE_LIKE => 'text-red-500 bg-red-500/10 border-red-500/20',
        self::TYPE_COMMENT => 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        self::TYPE_FRIEND => 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        self::TYPE_MENTION => 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        self::TYPE_WELCOME => 'text-pink-500 bg-pink-500/10 border-pink-500/20',
        self::TYPE_SYSTEM => 'text-gray-500 bg-gray-500/10 border-gray-500/20',
        self::TYPE_POST => 'text-green-500 bg-green-500/10 border-green-500/20',
        self::TYPE_SECURITY => 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        self::TYPE_PROFILE_LIKE => 'text-red-500 bg-red-500/10 border-red-500/20',
        self::TYPE_FOLLOW => 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    ];
    return $colors[$this->type] ?? 'text-gray-500 bg-gray-500/10 border-gray-500/20';
}
```

### 8. Update ProfileController

**File: `back/app/Http/Controllers/ProfileController.php`** (Update existing)
```php
<?php
namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ProfileLike;
use App\Models\Follow;
use App\Models\Amitie;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getProfile($userId = null)
    {
        try {
            $user = Auth::user();
            $targetUserId = $userId ?? $user->id;
            $targetUser = Utilisateur::findOrFail($targetUserId);
            
            // Get friendship status
            $friendship = Amitie::where(function ($query) use ($user, $targetUserId) {
                $query->where('id_1', $user->id)
                    ->where('id_2', $targetUserId);
            })->orWhere(function ($query) use ($user, $targetUserId) {
                $query->where('id_1', $targetUserId)
                    ->where('id_2', $user->id);
            })->first();
            
            // Get follow status
            $isFollowing = Follow::where('follower_id', $user->id)
                ->where('following_id', $targetUserId)
                ->exists();
            
            $isFollower = Follow::where('follower_id', $targetUserId)
                ->where('following_id', $user->id)
                ->exists();
            
            // Get profile like status
            $hasLikedProfile = ProfileLike::where('id_uti', $user->id)
                ->where('id_uti_profile', $targetUserId)
                ->exists();
            
            // Get recent friends
            $recentFriends = $targetUser->amis()
                ->take(12)
                ->get()
                ->map(function ($friend) {
                    return [
                        'id' => $friend->id,
                        'nom' => $friend->nom,
                        'prenom' => $friend->prenom,
                        'image' => $friend->image,
                    ];
                });
            
            // Get mutual friends count
            $mutualFriendsCount = 0;
            if ($targetUserId !== $user->id) {
                $userFriendIds = $user->amis()->pluck('id')->toArray();
                $targetFriendIds = $targetUser->amis()->pluck('id')->toArray();
                $mutualFriendsCount = count(array_intersect($userFriendIds, $targetFriendIds));
            }
            
            return response()->json([
                'success' => true,
                'profile' => [
                    'id' => $targetUser->id,
                    'nom' => $targetUser->nom,
                    'prenom' => $targetUser->prenom,
                    'email' => $targetUser->email,
                    'image' => $targetUser->image ? Storage::url($targetUser->image) : null,
                    'banner' => $targetUser->banner ? Storage::url($targetUser->banner) : null,
                    'bio' => $targetUser->bio,
                    'location' => $targetUser->location,
                    'website' => $targetUser->website,
                    'sexe' => $targetUser->sexe,
                    'role' => $targetUser->role,
                    'created_at' => $targetUser->created_at,
                    'is_owner' => $targetUserId === $user->id,
                    'is_friend' => $friendship && $friendship->statut === 'ami',
                    'has_pending_request' => $friendship && $friendship->statut === 'en attente' && $friendship->id_2 === $user->id,
                    'is_following' => $isFollowing,
                    'is_follower' => $isFollower,
                    'has_liked_profile' => $hasLikedProfile,
                    'mutual_friends_count' => $mutualFriendsCount,
                    'stats' => [
                        'posts' => $targetUser->articles()->count(),
                        'friends' => $targetUser->amis()->count(),
                        'followers' => $targetUser->followers()->count(),
                        'following' => $targetUser->following()->count(),
                        'likes_received' => $targetUser->profileLikesReceived()->count(),
                        'comments_received' => $targetUser->articles()
                            ->join('Commentaire', 'Article.id', '=', 'Commentaire.id_arti')
                            ->count()
                    ],
                    'recent_friends' => $recentFriends
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error loading profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement du profil'
            ], 500);
        }
    }
    
    // ... keep other methods (updateProfile, uploadImage, uploadBanner, getUserPosts)
}
```

### 9. Update AmitieController Search

**File: `back/app/Http/Controllers/AmitieController.php`** (Update search method)
```php
public function search(Request $request)
{
    $request->validate([
        'query' => 'required|string|min:2'
    ]);
    
    $user = Auth::user();
    $query = $request->input('query');
    
    $users = Utilisateur::where('id', '!=', $user->id)
        ->where(function ($q) use ($query) {
            $q->where('nom', 'LIKE', "%{$query}%")
              ->orWhere('prenom', 'LIKE', "%{$query}%")
              ->orWhere('email', 'LIKE', "%{$query}%");
        })
        ->select('id', 'nom', 'prenom', 'email', 'image', 'role', 'bio', 'location')
        ->limit(20)
        ->get()
        ->map(function ($userData) use ($user) {
            $friendship = Amitie::where(function ($q) use ($user, $userData) {
                $q->where('id_1', $user->id)
                  ->where('id_2', $userData->id);
            })->orWhere(function ($q) use ($user, $userData) {
                $q->where('id_1', $userData->id)
                  ->where('id_2', $user->id);
            })->first();
            
            $isFollowing = \App\Models\Follow::where('follower_id', $user->id)
                ->where('following_id', $userData->id)
                ->exists();
            
            return [
                'id' => $userData->id,
                'nom' => $userData->nom,
                'prenom' => $userData->prenom,
                'email' => $userData->email,
                'image' => $userData->image,
                'role' => $userData->role,
                'bio' => substr($userData->bio ?? '', 0, 100),
                'location' => $userData->location,
                'friendship_status' => $friendship ? $friendship->statut : null,
                'is_friend' => $friendship && $friendship->statut == 'ami',
                'has_pending_request' => $friendship && $friendship->statut == 'en attente',
                'is_following' => $isFollowing,
                'followers_count' => $userData->followers()->count(),
                'posts_count' => $userData->articles()->count(),
                'mutual_friends' => $this->countMutualFriends($user->id, $userData->id)
            ];
        });
    
    return response()->json([
        'success' => true,
        'users' => $users
    ]);
}
```

### 10. Update API Routes

**File: `back/routes/api.php`** (Update)
```php
<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AmitieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileLikeController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\ThrottleLogin;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->middleware(ThrottleLogin::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/send-verification', [VerificationController::class, 'sendVerificationCode']);
Route::post('/verify-code', [VerificationController::class, 'verifyCode']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Posts routes
    Route::get('/posts/feed', [PostController::class, 'getFeedPosts']);
    Route::post('/posts', [PostController::class, 'createPost']);
    Route::delete('/posts/{post}', [PostController::class, 'deletePost']);
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike']);
    Route::get('/posts/{post}/comments', [PostController::class, 'getComments']);
    Route::post('/posts/{post}/comments', [PostController::class, 'addComment']);
    
    // Friends routes
    Route::prefix('friends')->group(function () {
        Route::get('/', [AmitieController::class, 'getFriends']);
        Route::get('/suggestions', [AmitieController::class, 'getSuggestions']);
        Route::get('/pending', [AmitieController::class, 'getPendingRequests']);
        Route::get('/search', [AmitieController::class, 'search']);
        Route::post('/request', [AmitieController::class, 'sendRequest']);
        Route::post('/accept', [AmitieController::class, 'acceptRequest']);
        Route::post('/remove', [AmitieController::class, 'removeFriend']);
    });
    
    // Profile routes
    Route::get('/profile/{userId?}', [ProfileController::class, 'getProfile']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);
    Route::post('/profile/banner', [ProfileController::class, 'uploadBanner']);
    Route::get('/profile/{userId}/posts', [ProfileController::class, 'getUserPosts']);
    
    // Profile Like routes
    Route::post('/profile/{userId}/like', [ProfileLikeController::class, 'toggleLike']);
    
    // Follow routes
    Route::post('/profile/{userId}/follow', [FollowController::class, 'follow']);
    Route::delete('/profile/{userId}/follow', [FollowController::class, 'unfollow']);
    Route::get('/profile/{userId}/followers', [FollowController::class, 'getFollowers']);
    Route::get('/profile/{userId}/following', [FollowController::class, 'getFollowing']);
    
    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/all', [NotificationController::class, 'deleteAll']);
    });
});
```

## Frontend Changes

### 1. Update Header Search

**File: `front/src/components/Header.jsx`** (Update search handling)
```jsx
// Add this function to handle search navigation
const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearchQuery.trim().length >= 2) {
        navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`);
    }
};

// Update the search form
<div className="header-search">
    <form onSubmit={handleSearchSubmit} className="w-full">
        <input
            ref={searchInputRef}
            type="text"
            placeholder={getSearchPlaceholder()}
            value={localSearchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            className="w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
        />
    </form>
    {localSearchQuery ? (
        <button
            onClick={clearSearch}
            className="absolute right-8 text-gray-400 hover:text-white transition-colors"
        >
            <X size={18} />
        </button>
    ) : (
        <Search size={18} className="absolute right-3" />
    )}
</div>
```

### 2. Create SearchResults Component

**File: `front/src/components/main/SearchResults.jsx`**
```jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import Modal, { useModal } from '../Modal';
import { getImageUrl } from '../../utils/imageUrls';
import {
    UserPlus,
    UserCheck,
    UserX,
    Heart,
    MessageCircle,
    Users,
    FileText,
    X,
    Check,
    Loader2
} from 'lucide-react';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { modal, setModal, confirm } = useModal();
    
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState('');
    
    useEffect(() => {
        const searchQuery = searchParams.get('q');
        if (searchQuery && searchQuery.trim().length >= 2) {
            setQuery(searchQuery);
            handleSearch(searchQuery);
        }
    }, [searchParams]);
    
    const handleSearch = async (searchQuery) => {
        setLoading(true);
        try {
            const response = await api.get(`/friends/search?query=${encodeURIComponent(searchQuery)}`);
            if (response.data.success) {
                setResults(response.data.users);
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible d\'effectuer la recherche'
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handleLikeProfile = async (userId) => {
        try {
            const response = await api.post(`/profile/${userId}/like`);
            if (response.data.success) {
                setResults(results.map(u => 
                    u.id === userId 
                        ? { ...u, has_liked_profile: response.data.liked, profile_likes_count: response.data.likes_count }
                        : u
                ));
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: response.data.liked ? 'Profil liké avec succès!' : 'Like retiré'
                });
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors du like'
            });
        }
    };
    
    const handleFollow = async (userId) => {
        try {
            const response = await api.post(`/profile/${userId}/follow`);
            if (response.data.success) {
                setResults(results.map(u => 
                    u.id === userId ? { ...u, is_following: true } : u
                ));
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Utilisateur suivi avec succès!'
                });
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors du follow'
            });
        }
    };
    
    const handleUnfollow = async (userId) => {
        try {
            const response = await api.delete(`/profile/${userId}/follow`);
            if (response.data.success) {
                setResults(results.map(u => 
                    u.id === userId ? { ...u, is_following: false } : u
                ));
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Utilisateur non suivi'
                });
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors du unfollow'
            });
        }
    };
    
    const handleSendFriendRequest = async (userId) => {
        try {
            const response = await api.post('/friends/request', { user_id: userId });
            if (response.data.success) {
                setResults(results.map(u => 
                    u.id === userId ? { ...u, has_pending_request: true } : u
                ));
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Demande d\'amitié envoyée!'
                });
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors de l\'envoi de la demande'
            });
        }
    };
    
    const getUserAvatar = (userData) => {
        if (userData?.image) {
            return (
                <img
                    src={getImageUrl(userData.image)}
                    alt={`${userData.prenom} ${userData.nom}`}
                    className="w-full h-full rounded-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
            );
        }
        return (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-sm font-bold">
                {userData?.prenom?.[0]}{userData?.nom?.[0]}
            </div>
        );
    };
    
    return (
        <div className="section-content active">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="section-header mb-6">
                    <div className="flex items-center gap-3">
                        <h2>Résultats pour "{query}"</h2>
                        <span className="text-gray-400">{results.length} utilisateur(s)</span>
                    </div>
                    <button
                        onClick={() => navigate('/home')}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-400">Recherche en cours...</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-12 bg-[#141414] border border-[#262626] rounded-xl">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">Aucun résultat</h3>
                        <p className="text-gray-400">Aucun utilisateur trouvé pour cette recherche</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.map(userData => (
                            <div key={userData.id} className="bg-[#141414] border border-[#262626] rounded-xl p-4">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                        {getUserAvatar(userData)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-lg">
                                            {userData.prenom} {userData.nom}
                                        </h3>
                                        <p className="text-gray-400 text-sm truncate">{userData.email}</p>
                                        {userData.bio && (
                                            <p className="text-gray-500 text-sm mt-1 line-clamp-2">{userData.bio}</p>
                                        )}
                                        {userData.location && (
                                            <p className="text-gray-500 text-xs mt-1">📍 {userData.location}</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Stats */}
                                <div className="flex gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <FileText size={14} />
                                        <span>{userData.posts_count || 0} posts</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <Users size={14} />
                                        <span>{userData.followers_count || 0} followers</span>
                                    </div>
                                    {userData.mutual_friends > 0 && (
                                        <div className="flex items-center gap-1 text-purple-400">
                                            <UserCheck size={14} />
                                            <span>{userData.mutual_friends} ami(s) mutuel(s)</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Actions */}
                                <div className="flex gap-2 flex-wrap">
                                    {/* Like Profile */}
                                    <button
                                        onClick={() => handleLikeProfile(userData.id)}
                                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                                            userData.has_liked_profile
                                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                : 'bg-[#262626] text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <Heart size={16} fill={userData.has_liked_profile ? 'currentColor' : 'none'} />
                                        {userData.has_liked_profile ? 'Liké' : 'Liker'}
                                    </button>
                                    
                                    {/* Follow/Unfollow */}
                                    <button
                                        onClick={() => userData.is_following ? handleUnfollow(userData.id) : handleFollow(userData.id)}
                                        className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                                            userData.is_following
                                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                : 'bg-[#262626] text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        <UserCheck size={16} />
                                        {userData.is_following ? 'Abonné' : 'S\'abonner'}
                                    </button>
                                    
                                    {/* Friend/Messages */}
                                    {userData.is_friend ? (
                                        <button
                                            onClick={() => navigate(`/messages?userId=${userData.id}`)}
                                            className="px-3 py-2 bg-[#262626] text-gray-400 hover:text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all"
                                        >
                                            <MessageCircle size={16} />
                                            Message
                                        </button>
                                    ) : userData.has_pending_request ? (
                                        <div className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-medium text-sm flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            En attente
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleSendFriendRequest(userData.id)}
                                            className="px-3 py-2 bg-white text-black rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                                        >
                                            <UserPlus size={16} />
                                            Ami
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
```

### 3. Update Profile Component

**File: `front/src/components/main/Profile.jsx`** (Update the action buttons section)
```jsx
{/* Action Buttons - Update this section */}
<div className='flex gap-3 flex-wrap'>
    {isOwner ? (
        !isEditing ? (
            <button
                onClick={() => setIsEditing(true)}
                className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
            >
                <Edit2 size={18} />
                Modifier
            </button>
        ) : (
            <>
                <button
                    onClick={() => {
                        setIsEditing(false)
                        setEditData({
                            nom: profile.nom,
                            prenom: profile.prenom,
                            bio: profile.bio || '',
                            location: profile.location || '',
                            website: profile.website || '',
                            sexe: profile.sexe || ''
                        })
                    }}
                    className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-[#363636] transition-all flex items-center gap-2'
                >
                    <X size={18} />
                    Annuler
                </button>
                <button
                    onClick={handleSaveProfile}
                    className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                >
                    <Save size={18} />
                    Enregistrer
                </button>
            </>
        )
    ) : (
        <>
            {/* Like Profile */}
            <button
                onClick={handleLikeProfile}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    profile.has_liked_profile
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-[#262626] text-gray-400 hover:text-white'
                }`}
            >
                <Heart size={18} fill={profile.has_liked_profile ? 'currentColor' : 'none'} />
                <span>{profile.stats.likes_received}</span>
            </button>
            
            {/* Follow/Unfollow */}
            <button
                onClick={profile.is_following ? handleUnfollow : handleFollow}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    profile.is_following
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-white text-black hover:bg-gray-200'
                }`}
            >
                <UserCheck size={18} />
                {profile.is_following ? 'Abonné' : 'S\'abonner'}
            </button>
            
            {/* Friend Actions */}
            {profile.is_friend ? (
                <button
                    onClick={handleRemoveFriend}
                    className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center gap-2'
                >
                    <UserX size={18} />
                    Retirer
                </button>
            ) : profile.has_pending_request ? (
                <>
                    <button
                        onClick={handleAcceptRequest}
                        className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                    >
                        <Check size={18} />
                        Accepter
                    </button>
                    <button
                        onClick={handleRemoveFriend}
                        className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-[#363636] transition-all flex items-center gap-2'
                    >
                        <X size={18} />
                        Refuser
                    </button>
                </>
            ) : (
                <button
                    onClick={handleSendRequest}
                    className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                >
                    <UserPlus size={18} />
                    Ajouter
                </button>
            )}
        </>
    )}
</div>
```

**Add these handler functions to Profile.jsx:**
```jsx
// Add these state variables
const [likingProfile, setLikingProfile] = useState(false);
const [following, setFollowing] = useState(false);

// Add these handler functions
const handleLikeProfile = async () => {
    try {
        setLikingProfile(true);
        const response = await api.post(`/profile/${profile.id}/like`);
        if (response.data.success) {
            setProfile(prev => ({
                ...prev,
                has_liked_profile: response.data.liked,
                stats: {
                    ...prev.stats,
                    likes_received: response.data.likes_count
                }
            }));
            setModal({
                show: true,
                type: 'success',
                title: 'Succès',
                message: response.data.liked ? 'Profil liké avec succès!' : 'Like retiré'
            });
        }
    } catch (error) {
        setModal({
            show: true,
            type: 'error',
            title: 'Erreur',
            message: error.response?.data?.message || 'Erreur lors du like'
        });
    } finally {
        setLikingProfile(false);
    }
};

const handleFollow = async () => {
    try {
        setFollowing(true);
        const response = await api.post(`/profile/${profile.id}/follow`);
        if (response.data.success) {
            setProfile(prev => ({
                ...prev,
                is_following: true,
                stats: {
                    ...prev.stats,
                    followers: prev.stats.followers + 1
                }
            }));
            setModal({
                show: true,
                type: 'success',
                title: 'Succès',
                message: 'Utilisateur suivi avec succès!'
            });
        }
    } catch (error) {
        setModal({
            show: true,
            type: 'error',
            title: 'Erreur',
            message: error.response?.data?.message || 'Erreur lors du follow'
        });
    } finally {
        setFollowing(false);
    }
};

const handleUnfollow = async () => {
    const confirmed = await confirm('Voulez-vous vraiment vous désabonner ?', 'Confirmer');
    if (!confirmed) return;
    
    try {
        setFollowing(true);
        const response = await api.delete(`/profile/${profile.id}/follow`);
        if (response.data.success) {
            setProfile(prev => ({
                ...prev,
                is_following: false,
                stats: {
                    ...prev.stats,
                    followers: Math.max(0, prev.stats.followers - 1)
                }
            }));
            setModal({
                show: true,
                type: 'success',
                title: 'Succès',
                message: 'Utilisateur non suivi'
            });
        }
    } catch (error) {
        setModal({
            show: true,
            type: 'error',
            title: 'Erreur',
            message: error.response?.data?.message || 'Erreur lors du unfollow'
        });
    } finally {
        setFollowing(false);
    }
};
```

**Update the Stats Grid in Profile.jsx:**
```jsx
{/* Stats Grid - Update to show followers/following */}
<div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 pt-8 border-t border-[#262626]'>
    <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
        <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
            <FileText size={20} />
            <span className='text-sm'>Publications</span>
        </div>
        <div className='text-2xl md:text-3xl font-bold text-white'>
            {profile.stats.posts}
        </div>
    </div>
    <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
        <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
            <Users size={20} />
            <span className='text-sm'>Amis</span>
        </div>
        <div className='text-2xl md:text-3xl font-bold text-white'>
            {profile.stats.friends}
        </div>
    </div>
    <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
        <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
            <Heart size={20} />
            <span className='text-sm'>Likes profil</span>
        </div>
        <div className='text-2xl md:text-3xl font-bold text-white'>
            {profile.stats.likes_received}
        </div>
    </div>
    <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
        <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
            <UserCheck size={20} />
            <span className='text-sm'>Followers</span>
        </div>
        <div className='text-2xl md:text-3xl font-bold text-white'>
            {profile.stats.followers}
        </div>
    </div>
    <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
        <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
            <Users size={20} />
            <span className='text-sm'>Following</span>
        </div>
        <div className='text-2xl md:text-3xl font-bold text-white'>
            {profile.stats.following}
        </div>
    </div>
    <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
        <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
            <MessageCircle size={20} />
            <span className='text-sm'>Commentaires</span>
        </div>
        <div className='text-2xl md:text-3xl font-bold text-white'>
            {profile.stats.comments_received}
        </div>
    </div>
</div>
```

### 4. Update App Routes

**File: `front/src/App.jsx`** (Add search route)
```jsx
import SearchResults from './components/main/SearchResults'

// Add this route before the catch-all
<Route
    path='/search'
    element={
        <ProtectedRoute>
            <SearchResults />
        </ProtectedRoute>
    }
/>
```

### 5. Update Notifications Component

**File: `front/src/components/main/Notifications.jsx`** (Update icon handling)
```jsx
const getNotificationIcon = type => {
    const icons = {
        like: <Heart className='text-red-500' size={20} />,
        comment: <MessageCircle className='text-blue-500' size={20} />,
        friend_request: <UserPlus className='text-purple-500' size={20} />,
        friend_accepted: <UserCheck className='text-green-500' size={20} />,
        mention: <AtSign className='text-yellow-500' size={20} />,
        welcome: <Gift className='text-pink-500' size={20} />,
        system: <Settings className='text-gray-500' size={20} />,
        profile_like: <Heart className='text-red-500' size={20} />,
        follow: <UserCheck className='text-purple-500' size={20} />
    }
    return icons[type] || <Bell className='text-gray-500' size={20} />
}

const getNotificationColor = type => {
    const colors = {
        like: 'bg-red-500/10 border-red-500/20',
        comment: 'bg-blue-500/10 border-blue-500/20',
        friend_request: 'bg-purple-500/10 border-purple-500/20',
        friend_accepted: 'bg-green-500/10 border-green-500/20',
        mention: 'bg-yellow-500/10 border-yellow-500/20',
        welcome: 'bg-pink-500/10 border-pink-500/20',
        system: 'bg-gray-500/10 border-gray-500/20',
        profile_like: 'bg-red-500/10 border-red-500/20',
        follow: 'bg-purple-500/10 border-purple-500/20'
    }
    return colors[type] || 'bg-gray-500/10 border-gray-500/20'
}
```

## Run Migrations

After adding all the files, run:

```bash
cd back
php artisan migrate
php artisan config:clear
php artisan cache:clear
```

This implementation provides:

1. ✅ **Profile Like System** - Users can like/unlike profiles with notifications
2. ✅ **Follow/Unfollow System** - Full follow management with notifications
3. ✅ **Enhanced Search** - Search returns people with brief info and action buttons
4. ✅ **Search Results** - Shows like, follow, add friend, message buttons based on relationship
5. ✅ **Profile Page Updates** - Shows followers, following, profile likes counts
6. ✅ **Notifications** - Handles all new action types (profile like, follow, unfollow)
7. ✅ **My Profile Stats** - Shows your own followers, following, and profile likes

All notifications are properly integrated with the existing NotificationService!