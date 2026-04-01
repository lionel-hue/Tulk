<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Services\NotificationService;

class SettingsController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get current user settings
     */
    public function index()
    {
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'settings' => [
                'lang' => $user->lang ?? 'fr',
                'theme' => $user->theme ?? 'dark',
                'email_notifications' => (bool) ($user->email_notifications ?? true),
                'two_factor_enabled' => (bool) ($user->two_factor_enabled ?? false),
            ]
        ]);
    }

    /**
     * Update user settings
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'lang' => 'nullable|string|in:en,fr',
            'theme' => 'nullable|string|in:light,dark',
            'email_notifications' => 'nullable|boolean',
            'two_factor_enabled' => 'nullable|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour avec succès',
            'settings' => [
                'lang' => $user->lang,
                'theme' => $user->theme,
                'email_notifications' => (bool) $user->email_notifications,
                'two_factor_enabled' => (bool) $user->two_factor_enabled,
            ]
        ]);
    }

    /**
     * Change the user's password
     */
    public function changePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->mdp)) {
            return response()->json([
                'success' => false,
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        $user->update(['mdp' => Hash::make($request->new_password)]);

        // Send security notification email
        $this->notificationService->sendPasswordChangedNotification($user);

        return response()->json([
            'success' => true,
            'message' => 'Mot de passe modifié avec succès. Un e-mail de confirmation vous a été envoyé.'
        ]);
    }
}
