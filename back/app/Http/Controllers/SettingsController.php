<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SettingsController extends Controller
{
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
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Paramètres mis à jour avec succès',
            'settings' => [
                'lang' => $user->lang,
                'theme' => $user->theme,
                'email_notifications' => (bool) $user->email_notifications,
            ]
        ]);
    }
}
