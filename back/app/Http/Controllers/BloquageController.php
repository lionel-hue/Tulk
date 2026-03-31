<?php
// back/app/Http/Controllers/BloquageController.php
namespace App\Http\Controllers;

use App\Models\Bloquage;
use App\Models\Utilisateur;
use App\Models\Amitie;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class BloquageController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();
            $blocked = Bloquage::where('id_bloqueur', $user->id)
                ->with('bloque')
                ->get()
                ->pluck('bloque');

            return response()->json([
                'success' => true,
                'blocked_users' => $blocked
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function block(Request $request)
    {
        try {
            $user = Auth::user();
            $targetId = $request->user_id;

            if ($user->id == $targetId) {
                return response()->json(['success' => false, 'message' => 'Vous ne pouvez pas vous bloquer'], 400);
            }

            // Create blockage
            Bloquage::updateOrCreate([
                'id_bloqueur' => $user->id,
                'id_bloque' => $targetId
            ]);

            // Cleanup: remove friendships and follows
            Amitie::where(function($q) use ($user, $targetId) {
                $q->where('id_1', $user->id)->where('id_2', $targetId);
            })->orWhere(function($q) use ($user, $targetId) {
                $q->where('id_1', $targetId)->where('id_2', $user->id);
            })->delete();

            Follow::where(function($q) use ($user, $targetId) {
                $q->where('follower_id', $user->id)->where('following_id', $targetId);
            })->orWhere(function($q) use ($user, $targetId) {
                $q->where('follower_id', $targetId)->where('following_id', $user->id);
            })->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur bloqué'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function unblock(Request $request)
    {
        try {
            $user = Auth::user();
            $targetId = $request->user_id;

            Bloquage::where('id_bloqueur', $user->id)
                ->where('id_bloque', $targetId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur débloqué'
            ]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
