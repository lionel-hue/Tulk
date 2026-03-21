<?php

use Illuminate\Support\Facades\Route;

// NO CSRF route - you don't need it!
// Just serve the React app if someone visits the Laravel URL directly
Route::get('/{any?}', function () {
    return view('welcome');
})->where('any', '.*');