<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AmitieController;
use App\Http\Middleware\ThrottleLogin;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\ProfileLikeController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\MessageController;

Route::post('/login', [AuthController::class, 'login'])->middleware(ThrottleLogin::class);
Route::post('register', [AuthController::class, 'register']);
Route::post('send-verification', [VerificationController::class, 'sendVerificationCode']);
Route::post('verify-code', [VerificationController::class, 'verifyCode']);
Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('verify-2fa', [AuthController::class, 'verify2fa']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    // Posts routes
    Route::get('/posts/feed', [PostController::class, 'getFeedPosts']);
    Route::post('/posts', [PostController::class, 'createPost']);
    Route::delete('/posts/{post}', [PostController::class, 'deletePost']);
    Route::get('/posts/unread-count', [PostController::class, 'unreadCount']);
    Route::post('/posts/mark-read', [PostController::class, 'markFeedAsRead']);

    // Like routes
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike']);

    // Comment routes
    Route::get('/posts/{post}/comments', [PostController::class, 'getComments']);
    Route::post('/posts/{post}/comments', [PostController::class, 'addComment']);

    // Friends routes
    Route::prefix('friends')->group(function () {
        Route::get('/', [AmitieController::class, 'getFriends']);
        Route::get('/suggestions', [AmitieController::class, 'getSuggestions']);
        Route::get('/pending', [AmitieController::class, 'getPendingRequests']);
        Route::get('/pending-count', [AmitieController::class, 'pendingCount']);
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


    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [App\Http\Controllers\NotificationController::class, 'index']);
        Route::get('/unread-count', [App\Http\Controllers\NotificationController::class, 'unreadCount']);
        Route::post('/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [App\Http\Controllers\NotificationController::class, 'destroy']);
        Route::delete('/all', [App\Http\Controllers\NotificationController::class, 'deleteAll']);
        Route::post('/delete-old', [App\Http\Controllers\NotificationController::class, 'deleteOld']);
    });

    // Profile Like routes
    Route::post('/profile/{userId}/like', [ProfileLikeController::class, 'toggleLike']);

    // Follow routes
    Route::post('/profile/{userId}/follow', [FollowController::class, 'follow']);
    Route::delete('/profile/{userId}/follow', [FollowController::class, 'unfollow']);
    Route::get('/profile/{userId}/followers', [FollowController::class, 'getFollowers']);
    Route::get('/profile/{userId}/following', [FollowController::class, 'getFollowing']);

    // Message routes
    Route::prefix('messages')->group(function () {
        Route::get('/conversations', [App\Http\Controllers\MessageController::class, 'getConversations']);
        Route::get('/unread-count', [App\Http\Controllers\MessageController::class, 'unreadCount']);
        Route::get('/{userId}', [App\Http\Controllers\MessageController::class, 'getMessages']);
        Route::post('/', [App\Http\Controllers\MessageController::class, 'sendMessage']);
    });

    // Group routes
    Route::prefix('groups')->group(function () {
        Route::get('/', [App\Http\Controllers\GroupController::class, 'index']);
        Route::post('/', [App\Http\Controllers\GroupController::class, 'store']);
        Route::get('/{id}', [App\Http\Controllers\GroupController::class, 'show']);
        Route::post('/{id}/invite', [App\Http\Controllers\GroupController::class, 'invite']);
        Route::delete('/{id}/members/{userId}', [App\Http\Controllers\GroupController::class, 'removeMember']);
        Route::patch('/{id}/members/{userId}/role', [App\Http\Controllers\GroupController::class, 'updateRole']);
        Route::post('/{id}/leave', [App\Http\Controllers\GroupController::class, 'leave']);
        Route::patch('/{id}/settings', [App\Http\Controllers\GroupController::class, 'toggleSettings']);
        
        // Group Messages
        Route::get('/{id}/messages', [App\Http\Controllers\GroupMessageController::class, 'index']);
        Route::post('/{id}/messages', [App\Http\Controllers\GroupMessageController::class, 'store']);
        Route::delete('/{id}/messages/{messageId}', [App\Http\Controllers\GroupMessageController::class, 'destroy']);
    });

    // Block routes
    Route::prefix('blocks')->group(function () {
        Route::get('/', [App\Http\Controllers\BloquageController::class, 'index']);
        Route::post('/block', [App\Http\Controllers\BloquageController::class, 'block']);
        Route::post('/unblock', [App\Http\Controllers\BloquageController::class, 'unblock']);
    });

    // Settings routes
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::put('/settings', [SettingsController::class, 'update']);
    Route::post('/settings/change-password', [SettingsController::class, 'changePassword']);
});
