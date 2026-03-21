<?php
// back/app/Http/Controllers/ProfileController.php
namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Article;
use App\Models\Amitie;
use App\Models\Commentaire;
use App\Models\Liker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    // Get user profile data
    public function getProfile($userId = null)
    {
        $user = Auth::user();
        $profileUser = $userId ? Utilisateur::find($userId) : $user;

        if (!$profileUser) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé'
            ], 404);
        }

        // Get friendship status with current user
        $friendshipStatus = null;
        $isFriend = false;
        $hasPendingRequest = false;

        if ($profileUser->id !== $user->id) {
            $friendship = Amitie::where(function ($query) use ($user, $profileUser) {
                $query->where('id_1', $user->id)->where('id_2', $profileUser->id);
            })->orWhere(function ($query) use ($user, $profileUser) {
                $query->where('id_1', $profileUser->id)->where('id_2', $user->id);
            })->first();

            if ($friendship) {
                $friendshipStatus = $friendship->statut;
                $isFriend = $friendship->statut === 'ami';
                $hasPendingRequest = $friendship->statut === 'en attente';
            }
        }

        // Get stats
        $postsCount = Article::where('id_uti', $profileUser->id)->count();
        $friendsCount = Amitie::where(function ($query) use ($profileUser) {
            $query->where('id_1', $profileUser->id)->orWhere('id_2', $profileUser->id);
        })->where('statut', 'ami')->count();

        $totalLikes = Liker::whereIn('id_arti', function ($query) use ($profileUser) {
            $query->select('id')->from('Article')->where('id_uti', $profileUser->id);
        })->count();

        $totalComments = Commentaire::whereIn('id_arti', function ($query) use ($profileUser) {
            $query->select('id')->from('Article')->where('id_uti', $profileUser->id);
        })->count();

        // Get recent friends (limit 6)
        $recentFriends = $this->getRecentFriends($profileUser->id, 6);

        // Get mutual friends if viewing another profile
        $mutualFriendsCount = 0;
        if ($profileUser->id !== $user->id) {
            $mutualFriendsCount = $this->countMutualFriends($user->id, $profileUser->id);
        }

        return response()->json([
            'success' => true,
            'profile' => [
                'id' => $profileUser->id,
                'nom' => $profileUser->nom,
                'prenom' => $profileUser->prenom,
                'email' => $profileUser->email,
                'image' => $profileUser->image ? Storage::url($profileUser->image) : null,
                'banner' => $profileUser->banner ? Storage::url($profileUser->banner) : null,
                'bio' => $profileUser->bio ?? '',
                'location' => $profileUser->location ?? '',
                'website' => $profileUser->website ?? '',
                'sexe' => $profileUser->sexe,
                'role' => $profileUser->role,
                'created_at' => $profileUser->created_at ?? now(),
                'stats' => [
                    'posts' => $postsCount,
                    'friends' => $friendsCount,
                    'likes_received' => $totalLikes,
                    'comments_received' => $totalComments
                ],
                'recent_friends' => $recentFriends,
                'mutual_friends_count' => $mutualFriendsCount,
                'friendship_status' => $friendshipStatus,
                'is_friend' => $isFriend,
                'has_pending_request' => $hasPendingRequest,
                'is_owner' => $profileUser->id === $user->id
            ]
        ]);
    }

    // Update profile
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'nom' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'bio' => 'nullable|string|max:500',
            'location' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'sexe' => 'nullable|in:M,F'
        ]);

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profil mis à jour avec succès',
            'user' => [
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'bio' => $user->bio,
                'location' => $user->location,
                'website' => $user->website,
                'sexe' => $user->sexe
            ]
        ]);
    }

    // Upload profile image
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        $user = Auth::user();
        $image = $request->file('image');
        $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        $imagePath = $image->storeAs('images/profiles', $imageName, 'public');

        // Delete old image if exists
        if ($user->image && Storage::disk('public')->exists($user->image)) {
            Storage::disk('public')->delete($user->image);
        }

        $user->update(['image' => $imagePath]);

        return response()->json([
            'success' => true,
            'message' => 'Photo de profil mise à jour',
            'image_url' => Storage::url($imagePath)
        ]);
    }

    // Upload banner image
    public function uploadBanner(Request $request)
    {
        $request->validate([
            'banner' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120'
        ]);

        $user = Auth::user();
        $banner = $request->file('banner');
        $bannerName = time() . '_' . uniqid() . '.' . $banner->getClientOriginalExtension();
        $bannerPath = $banner->storeAs('images/banners', $bannerName, 'public');

        // Delete old banner if exists
        if ($user->banner && Storage::disk('public')->exists($user->banner)) {
            Storage::disk('public')->delete($user->banner);
        }

        $user->update(['banner' => $bannerPath]);

        return response()->json([
            'success' => true,
            'message' => 'Bannière mise à jour',
            'banner_url' => Storage::url($bannerPath)
        ]);
    }

    // Get user posts
    public function getUserPosts($userId)
    {
        $posts = Article::with(['utilisateur', 'likes', 'commentaires'])
            ->where('id_uti', $userId)
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'description' => $post->description,
                    'image' => $post->image ? Storage::url($post->image) : null,
                    'date' => $post->date,
                    'likes_count' => $post->likes()->count(),
                    'comments_count' => $post->commentaires()->count()
                ];
            });

        return response()->json([
            'success' => true,
            'posts' => $posts
        ]);
    }

    // Helper: Get recent friends
    private function getRecentFriends($userId, $limit = 6)
    {
        $friendships = Amitie::where(function ($query) use ($userId) {
            $query->where('id_1', $userId)->orWhere('id_2', $userId);
        })->where('statut', 'ami')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        $friends = [];
        foreach ($friendships as $friendship) {
            $friendId = ($friendship->id_1 == $userId) ? $friendship->id_2 : $friendship->id_1;
            $friend = Utilisateur::select('id', 'nom', 'prenom', 'image')->find($friendId);
            if ($friend) {
                $friends[] = [
                    'id' => $friend->id,
                    'nom' => $friend->nom,
                    'prenom' => $friend->prenom,
                    'image' => $friend->image ? Storage::url($friend->image) : null
                ];
            }
        }

        return $friends;
    }

    // Helper: Count mutual friends
    private function countMutualFriends($user1Id, $user2Id)
    {
        $user1Friends = Amitie::where(function ($query) use ($user1Id) {
            $query->where('id_1', $user1Id)->orWhere('id_2', $user1Id);
        })->where('statut', 'ami')->get()
            ->map(function ($f) use ($user1Id) {
                return ($f->id_1 == $user1Id) ? $f->id_2 : $f->id_1;
            })->toArray();

        $user2Friends = Amitie::where(function ($query) use ($user2Id) {
            $query->where('id_1', $user2Id)->orWhere('id_2', $user2Id);
        })->where('statut', 'ami')->get()
            ->map(function ($f) use ($user2Id) {
                return ($f->id_1 == $user2Id) ? $f->id_2 : $f->id_1;
            })->toArray();

        return count(array_intersect($user1Friends, $user2Friends));
    }
}
