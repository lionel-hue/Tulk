<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AmitieController;

Route::post('login', [AuthController::class, 'login']);
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
});
