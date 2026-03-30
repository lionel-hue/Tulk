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

Route::post('/login', [AuthController::class, 'login'])->middleware(ThrottleLogin::class);
Route::post('register', [AuthController::class, 'register']);
Route::post('send-verification', [VerificationController::class, 'sendVerificationCode']);
Route::post('verify-code', [VerificationController::class, 'verifyCode']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    // Posts routes
    Route::get('/posts/feed', [PostController::class, 'getFeedPosts']);
    Route::post('/posts', [PostController::class, 'createPost']);
    Route::delete('/posts/{post}', [PostController::class, 'deletePost']);

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
        Route::get('/{userId}', [App\Http\Controllers\MessageController::class, 'getMessages']);
        Route::post('/', [App\Http\Controllers\MessageController::class, 'sendMessage']);
    });
});
