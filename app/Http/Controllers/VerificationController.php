<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store code in cache for 10 minutes
        Cache::put('verification_code_' . $request->email, $code, 600);

        // TODO: Send email with verification code
        // You'll need to set up Laravel Mail for this
        
        return response()->json([
            'message' => 'Code de vérification envoyé',
            'code' => $code // Remove this in production - only for testing
        ]);
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $cachedCode = Cache::get('verification_code_' . $request->email);

        if ($cachedCode && $cachedCode === $request->code) {
            Cache::forget('verification_code_' . $request->email);
            return response()->json(['message' => 'Code vérifié avec succès']);
        }

        return response()->json([
            'message' => 'Code de vérification invalide'
        ], 422);
    }
}