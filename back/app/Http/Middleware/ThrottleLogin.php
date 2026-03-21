<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;

class ThrottleLogin
{
    public function handle(Request $request, Closure $next)
    {
        // Define login rate limiter inline
        RateLimiter::for('custom_login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });

        // Check if the user has made too many login attempts
        if (RateLimiter::tooManyAttempts('custom_login:' . $request->ip(), 5)) {
            $seconds = RateLimiter::availableIn('custom_login:' . $request->ip());
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $seconds . ' seconds.'
            ], 429);
        }

        // Increment the login attempts
        RateLimiter::hit('custom_login:' . $request->ip());

        // Process the request
        $response = $next($request);

        // Clear attempts on successful login
        if ($response->getStatusCode() == 200 || $response->getStatusCode() == 201) {
            RateLimiter::clear('custom_login:' . $request->ip());
        }

        return $response;
    }
}