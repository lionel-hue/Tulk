<?php
// back/app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Services\NotificationService;

class AuthController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
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
            'role' => 'user',
        ]);

        // Clear the verification code
        Cache::forget('verification_code_' . $request->email);

        // Send welcome notification
        $this->notificationService->sendWelcomeNotification($user, true);

        // Create Sanctum token
        $token = $user->createToken('auth_token')->plainTextToken;
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
                'image' => $imageUrl,
            ]
        ], 201);
    }

    public function login(Request $request)
    {
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

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->mdp)) {
            return response()->json([
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $imageUrl = $user->image ? Storage::url($user->image) : null;

        // Optional: Send login alert notification for security
        // $this->notificationService->sendLoginAlertNotification(
        //     $user,
        //     $request->ip(),
        //     $request->userAgent(),
        //     false // Don't email on every login (can be annoying)
        // );

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => $user->role,
                'image' => $imageUrl,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Forgot password - sends a reset code by email.
     * Always returns 200 regardless of whether email exists (security)
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Adresse email invalide'], 422);
        }

        $user = Utilisateur::where('email', $request->email)->first();

        // Always return success response for security (don't reveal if email exists)
        if (!$user) {
            return response()->json([
                'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
            ]);
        }

        // Generate a 6-character reset code
        $resetCode = strtoupper(Str::random(6));
        
        // Store the code in cache for 30 minutes
        Cache::put('password_reset_' . $request->email, $resetCode, now()->addMinutes(30));

        // Send the email
        try {
            Mail::raw(
                "Bonjour {$user->prenom},\n\nVotre code de réinitialisation de mot de passe Tulk est : {$resetCode}\n\nCe code expires dans 30 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nL'équipe Tulk",
                function ($message) use ($user, $resetCode) {
                    $message->to($user->email)
                            ->subject("[Tulk] Code de réinitialisation de mot de passe : {$resetCode}");
                }
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
        ]);
    }
}
