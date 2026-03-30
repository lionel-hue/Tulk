<?php
namespace App\Http\Controllers;

use App\Models\ProfileLike;
use App\Models\Utilisateur;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProfileLikeController extends Controller
{
    protected $notificationService;
    
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    
    public function toggleLike(Request $request, $userId)
    {
        try {
            $user = Auth::user();
            $targetUser = Utilisateur::findOrFail($userId);
            
            // Can't like your own profile
            if ($user->id === $targetUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas liker votre propre profil'
                ], 400);
            }
            
            // Check if already liked
            $existingLike = ProfileLike::where('id_uti', $user->id)
                ->where('id_uti_profile', $userId)
                ->first();
            
            if ($existingLike) {
                // Unlike
                ProfileLike::where('id_uti', $user->id)
                    ->where('id_uti_profile', $userId)
                    ->delete();
                $liked = false;
            } else {
                // Like
                ProfileLike::create([
                    'id_uti' => $user->id,
                    'id_uti_profile' => $userId,
                    'date' => now()
                ]);
                $liked = true;
                
                // Send notification
                $this->notificationService->sendProfileLikeNotification(
                    $targetUser,
                    $user,
                    false
                );
            }
            
            $likesCount = $targetUser->profileLikesReceived()->count();
            
            return response()->json([
                'success' => true,
                'liked' => $liked,
                'likes_count' => $likesCount
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error toggling profile like: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du like du profil'
            ], 500);
        }
    }
}