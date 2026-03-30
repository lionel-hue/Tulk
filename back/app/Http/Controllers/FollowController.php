<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\Utilisateur;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FollowController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function follow(Request $request, $userId)
    {
        try {
            $user = Auth::user();
            $targetUser = Utilisateur::findOrFail($userId);

            // Can't follow yourself
            if ($user->id === $targetUser->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne pouvez pas vous suivre vous-même'
                ], 400);
            }

            // Check if already following
            $existingFollow = Follow::where('follower_id', $user->id)
                ->where('following_id', $userId)
                ->first();

            if ($existingFollow) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous suivez déjà cet utilisateur'
                ], 400);
            }

            // Create follow
            Follow::create([
                'follower_id' => $user->id,
                'following_id' => $userId,
                'created_at' => now()
            ]);

            // Send notification
            $this->notificationService->sendFollowNotification(
                $targetUser,
                $user,
                false
            );

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur suivi avec succès',
                'followers_count' => $targetUser->followers()->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error following user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du follow'
            ], 500);
        }
    }

    public function unfollow(Request $request, $userId)
    {
        try {
            $user = Auth::user();
            $targetUser = Utilisateur::findOrFail($userId);

            $follow = Follow::where('follower_id', $user->id)
                ->where('following_id', $userId)
                ->first();

            if (!$follow) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous ne suivez pas cet utilisateur'
                ], 404);
            }

            Follow::where('follower_id', $user->id)
                ->where('following_id', $userId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Utilisateur non suivi',
                'followers_count' => $targetUser->followers()->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error unfollowing user: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du unfollow'
            ], 500);
        }
    }

    public function getFollowers($userId)
    {
        try {
            $targetUser = Utilisateur::findOrFail($userId);

            $followers = $targetUser->followers()
                ->with('follower:id,nom,prenom,image,email')
                ->get()
                ->map(function ($follow) {
                    return [
                        'id' => $follow->follower->id,
                        'nom' => $follow->follower->nom,
                        'prenom' => $follow->follower->prenom,
                        'image' => $follow->follower->image,
                        'email' => $follow->follower->email,
                        'followed_at' => $follow->created_at
                    ];
                });

            return response()->json([
                'success' => true,
                'followers' => $followers
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting followers: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des followers'
            ], 500);
        }
    }

    public function getFollowing($userId)
    {
        try {
            $targetUser = Utilisateur::findOrFail($userId);

            $following = $targetUser->following()
                ->with('following:id,nom,prenom,image,email')
                ->get()
                ->map(function ($follow) {
                    return [
                        'id' => $follow->following->id,
                        'nom' => $follow->following->nom,
                        'prenom' => $follow->following->prenom,
                        'image' => $follow->following->image,
                        'email' => $follow->following->email,
                        'followed_at' => $follow->created_at
                    ];
                });

            return response()->json([
                'success' => true,
                'following' => $following
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting following: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des following'
            ], 500);
        }
    }
}
