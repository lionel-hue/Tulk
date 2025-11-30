<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;


Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('send-verification', [VerificationController::class, 'sendVerificationCode']);
Route::post('verify-code', [VerificationController::class, 'verifyCode']);
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/posts/feed', [PostController::class, 'getFeedPosts']);
    Route::post('/posts', [PostController::class, 'createPost']);
});