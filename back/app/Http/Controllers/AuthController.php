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
use Illuminate\Support\Facades\Log;
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

        $user = Utilisateur::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'mdp' => Hash::make($request->mdp),
            'sexe' => $request->sexe,
            'image' => $imagePath,
            'role' => 'user',
        ]);

        Cache::forget('verification_code_' . $request->email);

        $this->notificationService->sendWelcomeNotification($user, true);

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

        // 2FA: if enabled, send OTP and require verification
        if ($user->two_factor_enabled) {
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            Cache::put('2fa_code_' . $user->email, $otp, now()->addMinutes(10));

            try {
                Mail::send('emails.two_factor', [
                    'userName' => $user->prenom ?? $user->nom,
                    'otp' => $otp,
                ], function ($m) use ($user) {
                    $m->to($user->email)->subject('[Tulk] Votre code de vérification 2FA');
                });
            } catch (\Exception $e) {
                \Log::error('Failed to send 2FA email: ' . $e->getMessage());
            }

            return response()->json([
                'requires_2fa' => true,
                'email' => $user->email,
                'message' => 'Un code de vérification a été envoyé à votre email.'
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
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
                'image' => $imageUrl,
                'lang' => $user->lang ?? 'fr',
                'theme' => $user->theme ?? 'dark',
                'email_notifications' => (bool) ($user->email_notifications ?? true),
                'two_factor_enabled' => (bool) $user->two_factor_enabled,
            ]
        ]);
    }

    /**
     * Verify a 2FA OTP code and return auth token
     */
    public function verify2fa(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Données invalides'], 422);
        }

        $cached = Cache::get('2fa_code_' . $request->email);
        if (!$cached || $cached !== $request->code) {
            return response()->json(['message' => 'Code invalide ou expiré.'], 401);
        }

        $user = Utilisateur::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        Cache::forget('2fa_code_' . $request->email);

        $token = $user->createToken('auth_token')->plainTextToken;
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
                'image' => $imageUrl,
                'lang' => $user->lang ?? 'fr',
                'theme' => $user->theme ?? 'dark',
                'email_notifications' => (bool) ($user->email_notifications ?? true),
                'two_factor_enabled' => (bool) $user->two_factor_enabled,
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

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Adresse email invalide'], 422);
        }

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
            ]);
        }

        $resetCode = strtoupper(Str::random(6));
        Cache::put('password_reset_' . $request->email, $resetCode, now()->addMinutes(30));

        try {
            Mail::send('emails.password_reset', [
                'userName' => $user->prenom,
                'resetCode' => $resetCode
            ], function ($message) use ($user, $resetCode) {
                $message->to($user->email)
                        ->subject("[Tulk] Code de réinitialisation de mot de passe : {$resetCode}");
            });
        } catch (\Exception $e) {
            \Log::error('Failed to send password reset email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.'
        ]);
    }
}
