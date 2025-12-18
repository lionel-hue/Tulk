<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Mail\VerificationCodeMail;

class VerificationController extends Controller
{
    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string'
        ]);

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store code in cache for 10 minutes
        Cache::put('verification_code_' . $request->email, $code, 600);

        try {
            // Send email
            Mail::to($request->email)->send(new VerificationCodeMail($code, $request->name));
            
            return response()->json([
                'message' => 'Code de vérification envoyé avec succès'
            ]);
            
        } catch (\Exception $e) {
            // Remove the code from cache if email fails
            Cache::forget('verification_code_' . $request->email);
            
            return response()->json([
                'message' => 'Erreur lors de l\'envoi de l\'email: ' . $e->getMessage()
            ], 500);
        }
    }

    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        $cachedCode = Cache::get('verification_code_' . $request->email);

        if ($cachedCode && $cachedCode === $request->code) {
            return response()->json([
                'message' => 'Code vérifié avec succès',
                'verified' => true
            ]);
        }

        return response()->json([
            'message' => 'Code de vérification invalide ou expiré',
            'verified' => false
        ], 422);
    }
}