<?php
// routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\PostController;

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
});


// Add to routes/api.php
Route::post('/test-upload', function(Request $request) {
    try {
        if (!$request->hasFile('image')) {
            return response()->json(['error' => 'No image uploaded'], 400);
        }
        
        $image = $request->file('image');
        
        // Log file info
        Log::info('File info:', [
            'name' => $image->getClientOriginalName(),
            'size' => $image->getSize(),
            'mime' => $image->getMimeType(),
            'extension' => $image->getClientOriginalExtension(),
        ]);
        
        // Store the image
        $path = $image->store('images', 'public');
        
        Log::info('Image stored at: ' . $path);
        Log::info('Full path: ' . storage_path('app/public/' . $path));
        Log::info('URL: ' . Storage::url($path));
        
        // Check if file exists
        $exists = Storage::disk('public')->exists($path);
        
        return response()->json([
            'success' => true,
            'path' => $path,
            'url' => Storage::url($path),
            'exists' => $exists,
            'full_path' => storage_path('app/public/' . $path),
        ]);
        
    } catch (\Exception $e) {
        Log::error('Upload test failed: ' . $e->getMessage());
        return response()->json(['error' => $e->getMessage()], 500);
    }
});