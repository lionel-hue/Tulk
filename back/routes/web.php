<?php

use Illuminate\Support\Facades\Route;

// API routes are in api.php
// This catch-all route should serve your React app for all frontend routes
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');