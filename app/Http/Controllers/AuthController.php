<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find user by email
        $user = Utilisateur::where('email', $request->email)->first();

        // Check if user exists and password matches
        if (!$user || !Hash::check($request->password, $user->mdp)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Format the image URL - FIXED: Use proper storage URL
        $imageUrl = $user->image ? Storage::url($user->image) : null;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'image' => $imageUrl, // This will be relative path like /storage/images/filename.jpg
            ]
        ]);
    }

    public function register(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'prenom' => 'nullable|string|max:255',
            'email' => 'required|email|unique:Utilisateur,email',
            'mdp' => 'required|min:6',
            'sexe' => 'nullable|in:M,F',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            'verification_code' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify the verification code
        $cachedCode = Cache::get('verification_code_' . $request->email);

        if (!$cachedCode || $cachedCode !== $request->verification_code) {
            return response()->json([
                'message' => 'Code de vérification invalide ou expiré'
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = Str::random(20) . '.' . $image->getClientOriginalExtension();

            // Store image in storage/app/public/images
            $imagePath = $image->storeAs('images', $imageName, 'public');
        }

        // Create user
        $user = Utilisateur::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'mdp' => Hash::make($request->mdp),
            'sexe' => $request->sexe,
            'image' => $imagePath,
            'role' => 'user', // Default role
        ]);

        // Clear the verification code after successful registration
        Cache::forget('verification_code_' . $request->email);

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Format the image URL - FIXED: Use proper storage URL
        $imageUrl = $imagePath ? Storage::url($imagePath) : null;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'image' => $imageUrl, // This will be relative path like /storage/images/filename.jpg
            ]
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }
}