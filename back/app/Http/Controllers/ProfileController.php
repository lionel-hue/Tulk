<?php
// back/app/Http/Controllers/ProfileController.php
namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ProfileLike;
use App\Models\Follow;
use App\Models\Amitie;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function getProfile($userId = null)
    {
        try {
            $user = Auth::user();
            $targetUserId = $userId ?? $user->id;
            $targetUser = Utilisateur::findOrFail($targetUserId);

            // Get friendship status
            $friendship = Amitie::where(function ($query) use ($user, $targetUserId) {
                $query->where('id_1', $user->id)
                    ->where('id_2', $targetUserId);
            })->orWhere(function ($query) use ($user, $targetUserId) {
                $query->where('id_1', $targetUserId)
                    ->where('id_2', $user->id);
            })->first();

            // Get follow status
            $isFollowing = Follow::where('follower_id', $user->id)
                ->where('following_id', $targetUserId)
                ->exists();
            $isFollower = Follow::where('follower_id', $targetUserId)
                ->where('following_id', $user->id)
                ->exists();

            // Get profile like status
            $hasLikedProfile = ProfileLike::where('id_uti', $user->id)
                ->where('id_uti_profile', $targetUserId)
                ->exists();

            // Get recent friends - FIXED: removed ->get()
            $recentFriends = $targetUser->amis()
                ->take(12)
                ->map(function ($friend) {
                    return [
                        'id' => $friend->id,
                        'nom' => $friend->nom,
                        'prenom' => $friend->prenom,
                        'image' => $friend->image,
                    ];
                });

            // Get mutual friends count
            $mutualFriendsCount = 0;
            if ($targetUserId !== $user->id) {
                $userFriendIds = $user->amis()->pluck('id')->toArray();
                $targetFriendIds = $targetUser->amis()->pluck('id')->toArray();
                $mutualFriendsCount = count(array_intersect($userFriendIds, $targetFriendIds));
            }

            return response()->json([
                'success' => true,
                'profile' => [
                    'id' => $targetUser->id,
                    'nom' => $targetUser->nom,
                    'prenom' => $targetUser->prenom,
                    'email' => $targetUser->email,
                    'image' => $targetUser->image ? Storage::url($targetUser->image) : null,
                    'banner' => $targetUser->banner ? Storage::url($targetUser->banner) : null,
                    'bio' => $targetUser->bio,
                    'location' => $targetUser->location,
                    'website' => $targetUser->website,
                    'sexe' => $targetUser->sexe,
                    'role' => $targetUser->role,
                    'created_at' => $targetUser->created_at,
                    'is_owner' => $targetUserId === $user->id,
                    'is_friend' => $friendship && $friendship->statut === 'ami',
                    'has_pending_request' => $friendship && $friendship->statut === 'en attente' && $friendship->id_2 === $user->id,
                    'is_following' => $isFollowing,
                    'is_follower' => $isFollower,
                    'has_liked_profile' => $hasLikedProfile,
                    'mutual_friends_count' => $mutualFriendsCount,
                    'stats' => [
                        'posts' => $targetUser->articles()->count(),
                        'friends' => $targetUser->amis()->count(),
                        'followers' => $targetUser->followers()->count(),
                        'following' => $targetUser->following()->count(),
                        'likes_received' => $targetUser->profileLikesReceived()->count(),
                        'comments_received' => $targetUser->articles()
                            ->join('Commentaire', 'Article.id', '=', 'Commentaire.id_arti')
                            ->count()
                    ],
                    'recent_friends' => $recentFriends
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement du profil'
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = Auth::user();

            $request->validate([
                'nom' => 'nullable|string|max:255',
                'prenom' => 'nullable|string|max:255',
                'bio' => 'nullable|string|max:500',
                'location' => 'nullable|string|max:255',
                'website' => 'nullable|url|max:255',
            ]);

            $updateData = [];
            if ($request->has('nom')) $updateData['nom'] = $request->nom;
            if ($request->has('prenom')) $updateData['prenom'] = $request->prenom;
            if ($request->has('bio')) $updateData['bio'] = $request->bio;
            if ($request->has('location')) $updateData['location'] = $request->location;
            if ($request->has('website')) $updateData['website'] = $request->website;

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Profil mis à jour',
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'bio' => $user->bio,
                    'location' => $user->location,
                    'website' => $user->website,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Échec de la mise à jour'
            ], 500);
        }
    }

    public function uploadImage(Request $request)
    {
        try {
            $user = Auth::user();

            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            if ($user->image && Storage::disk('public')->exists($user->image)) {
                Storage::disk('public')->delete($user->image);
            }

            $imagePath = $request->file('image')->store('images', 'public');
            $user->update(['image' => $imagePath]);

            return response()->json([
                'success' => true,
                'message' => 'Photo mise à jour',
                'image_url' => Storage::url($imagePath)
            ]);
        } catch (\Exception $e) {
            Log::error('Image upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Échec du téléchargement'
            ], 500);
        }
    }

    public function uploadBanner(Request $request)
    {
        try {
            $user = Auth::user();

            $request->validate([
                'banner' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            if ($user->banner && Storage::disk('public')->exists($user->banner)) {
                Storage::disk('public')->delete($user->banner);
            }

            $bannerPath = $request->file('banner')->store('banners', 'public');
            $user->update(['banner' => $bannerPath]);

            return response()->json([
                'success' => true,
                'message' => 'Bannière mise à jour',
                'banner_url' => Storage::url($bannerPath)
            ]);
        } catch (\Exception $e) {
            Log::error('Banner upload error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Échec du téléchargement'
            ], 500);
        }
    }

    public function getUserPosts($userId)
    {
        try {
            $targetUser = Utilisateur::findOrFail($userId);

            $posts = $targetUser->articles()
                ->with(['utilisateur', 'likes', 'commentaires'])
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'description' => $post->description,
                        'image' => $post->image ? Storage::url($post->image) : null,
                        'date' => $post->date,
                        'likes_count' => $post->likes()->count(),
                        'comments_count' => $post->commentaires()->count(),
                    ];
                });

            return response()->json([
                'success' => true,
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading user posts: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du chargement des posts'
            ], 500);
        }
    }
}
    