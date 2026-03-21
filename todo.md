After carefully analyzing your codebase against the todo.md specifications, I've identified several files that need corrections to properly implement the follow, like, and search features. Here are the **full corrected files** that need updates:

---

## 1. Backend: `back/app/Models/Notification.php`

**Issue:** Missing `TYPE_PROFILE_LIKE` and `TYPE_FOLLOW` constants and their icon/color mappings.

```php
<?php
// back/app/Models/Notification.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $table = 'Notification';
    public $timestamps = true;

    protected $fillable = [
        'id_uti',
        'id_uti_from',
        'type',
        'subtype',
        'title',
        'message',
        'related_id',
        'related_type',
        'data',
        'is_read',
        'email_sent',
        'read_at',
        'priority',
        'channel'
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'email_sent' => 'boolean',
        'read_at' => 'datetime',
    ];

    // Notification Types
    const TYPE_POST = 'post';
    const TYPE_LIKE = 'like';
    const TYPE_COMMENT = 'comment';
    const TYPE_FRIEND = 'friend';
    const TYPE_MENTION = 'mention';
    const TYPE_SYSTEM = 'system';
    const TYPE_WELCOME = 'welcome';
    const TYPE_SECURITY = 'security';
    const TYPE_PROFILE_LIKE = 'profile_like';
    const TYPE_FOLLOW = 'follow';

    // Notification Subtypes
    const SUBTYPE_POST_CREATED = 'post_created';
    const SUBTYPE_POST_UPDATED = 'post_updated';
    const SUBTYPE_POST_DELETED = 'post_deleted';
    const SUBTYPE_LIKE_RECEIVED = 'like_received';
    const SUBTYPE_COMMENT_RECEIVED = 'comment_received';
    const SUBTYPE_COMMENT_REPLY = 'comment_reply';
    const SUBTYPE_FRIEND_REQUEST = 'friend_request';
    const SUBTYPE_FRIEND_ACCEPTED = 'friend_accepted';
    const SUBTYPE_FRIEND_REMOVED = 'friend_removed';
    const SUBTYPE_MENTION_POST = 'mention_post';
    const SUBTYPE_MENTION_COMMENT = 'mention_comment';
    const SUBTYPE_WELCOME = 'welcome';
    const SUBTYPE_LOGIN_ALERT = 'login_alert';
    const SUBTYPE_PASSWORD_CHANGED = 'password_changed';
    const SUBTYPE_SYSTEM_ANNOUNCEMENT = 'system_announcement';
    const SUBTYPE_PROFILE_LIKED = 'profile_liked';
    const SUBTYPE_STARTED_FOLLOWING = 'started_following';

    // Priority Levels
    const PRIORITY_LOW = 'low';
    const PRIORITY_NORMAL = 'normal';
    const PRIORITY_HIGH = 'high';
    const PRIORITY_CRITICAL = 'critical';

    // Channels
    const CHANNEL_IN_APP = 'in_app';
    const CHANNEL_EMAIL = 'email';
    const CHANNEL_BOTH = 'both';

    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti');
    }

    public function utilisateurFrom()
    {
        return $this->belongsTo(Utilisateur::class, 'id_uti_from');
    }

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function markAsRead()
    {
        $this->update([
            'is_read' => true,
            'read_at' => now()
        ]);
    }

    public function getIconAttribute()
    {
        $icons = [
            self::TYPE_LIKE => '❤️',
            self::TYPE_COMMENT => '💬',
            self::TYPE_FRIEND => '👥',
            self::TYPE_MENTION => '📢',
            self::TYPE_WELCOME => '🎉',
            self::TYPE_SYSTEM => '⚙️',
            self::TYPE_POST => '📝',
            self::TYPE_SECURITY => '🔒',
            self::TYPE_PROFILE_LIKE => '❤️',
            self::TYPE_FOLLOW => '👥',
        ];
        return $icons[$this->type] ?? '🔔';
    }

    public function getColorAttribute()
    {
        $colors = [
            self::TYPE_LIKE => 'text-red-500 bg-red-500/10 border-red-500/20',
            self::TYPE_COMMENT => 'text-blue-500 bg-blue-500/10 border-blue-500/20',
            self::TYPE_FRIEND => 'text-purple-500 bg-purple-500/10 border-purple-500/20',
            self::TYPE_MENTION => 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
            self::TYPE_WELCOME => 'text-pink-500 bg-pink-500/10 border-pink-500/20',
            self::TYPE_SYSTEM => 'text-gray-500 bg-gray-500/10 border-gray-500/20',
            self::TYPE_POST => 'text-green-500 bg-green-500/10 border-green-500/20',
            self::TYPE_SECURITY => 'text-orange-500 bg-orange-500/10 border-orange-500/20',
            self::TYPE_PROFILE_LIKE => 'text-red-500 bg-red-500/10 border-red-500/20',
            self::TYPE_FOLLOW => 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        ];
        return $colors[$this->type] ?? 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }

    public function getBadgeColorAttribute()
    {
        $colors = [
            self::PRIORITY_LOW => 'bg-gray-500',
            self::PRIORITY_NORMAL => 'bg-blue-500',
            self::PRIORITY_HIGH => 'bg-orange-500',
            self::PRIORITY_CRITICAL => 'bg-red-500',
        ];
        return $colors[$this->priority ?? self::PRIORITY_NORMAL] ?? 'bg-blue-500';
    }

    public function shouldSendEmail()
    {
        return $this->channel === self::CHANNEL_EMAIL ||
            $this->channel === self::CHANNEL_BOTH;
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    public function scopeForUser($query, $userId)
    {
        return $query->where('id_uti', $userId);
    }

    public function scopePriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}
```

---

## 2. Backend: `back/app/Http/Controllers/ProfileController.php`

**Issue:** Missing complete `getProfile` method with all relationship checks and stats.

```php
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

            // Get recent friends
            $recentFriends = $targetUser->amis()
                ->take(12)
                ->get()
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
```

---

## 3. Backend: `back/app/Http/Controllers/AmitieController.php`

**Issue:** Search method missing `is_following`, `followers_count`, `posts_count`, `bio`, `location` fields.

```php
<?php
// back/app/Http/Controllers/AmitieController.php
namespace App\Http\Controllers;

use App\Models\Amitie;
use App\Models\Utilisateur;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\NotificationService;

class AmitieController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function sendRequest(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:Utilisateur,id'
        ]);

        $user = Auth::user();
        $targetUserId = $request->input('user_id');
        $targetUser = Utilisateur::find($targetUserId);

        $existingFriendship = Amitie::where(function ($query) use ($user, $targetUserId) {
            $query->where('id_1', $user->id)
                ->where('id_2', $targetUserId);
        })->orWhere(function ($query) use ($user, $targetUserId) {
            $query->where('id_1', $targetUserId)
                ->where('id_2', $user->id);
        })->first();

        if ($existingFriendship) {
            return response()->json([
                'success' => false,
                'message' => 'Demande d\'amitié déjà existante'
            ], 400);
        }

        $amitie = Amitie::create([
            'id_1' => $user->id,
            'id_2' => $targetUserId,
            'statut' => 'en attente'
        ]);

        if ($targetUser) {
            $this->notificationService->sendFriendRequestNotification(
                $targetUser,
                $user,
                true
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande d\'amitié envoyée',
            'friendship' => $amitie
        ]);
    }

    public function acceptRequest(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:Utilisateur,id'
        ]);

        $user = Auth::user();
        $requesterId = $request->input('user_id');
        $requester = Utilisateur::find($requesterId);

        $friendship = Amitie::where('id_1', $requesterId)
            ->where('id_2', $user->id)
            ->where('statut', 'en attente')
            ->first();

        if (!$friendship) {
            return response()->json([
                'success' => false,
                'message' => 'Demande d\'amitié non trouvée'
            ], 404);
        }

        $friendship->update(['statut' => 'ami']);

        if ($requester) {
            $this->notificationService->sendFriendAcceptedNotification(
                $requester,
                $user,
                true
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Demande d\'amitié acceptée',
            'friendship' => $friendship
        ]);
    }

    public function removeFriend(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:Utilisateur,id'
        ]);

        $user = Auth::user();
        $friendId = $request->input('user_id');
        $friend = Utilisateur::find($friendId);

        $friendship = Amitie::where(function ($query) use ($user, $friendId) {
            $query->where('id_1', $user->id)
                ->where('id_2', $friendId);
        })->orWhere(function ($query) use ($user, $friendId) {
            $query->where('id_1', $friendId)
                ->where('id_2', $user->id);
        })->first();

        if (!$friendship) {
            return response()->json([
                'success' => false,
                'message' => 'Relation d\'amitié non trouvée'
            ], 404);
        }

        if ($friend && $friendship->statut === 'ami') {
            $this->notificationService->sendFriendRemovedNotification(
                $friend,
                $user,
                false
            );
        }

        $friendship->delete();

        return response()->json([
            'success' => true,
            'message' => 'Relation d\'amitié supprimée'
        ]);
    }

    public function getFriends()
    {
        $user = Auth::user();
        $friendships = Amitie::where(function ($query) use ($user) {
            $query->where('id_1', $user->id)
                ->orWhere('id_2', $user->id);
        })
            ->where('statut', 'ami')
            ->get();

        $friends = [];
        foreach ($friendships as $friendship) {
            $friendId = ($friendship->id_1 == $user->id) ? $friendship->id_2 : $friendship->id_1;
            $friend = Utilisateur::select('id', 'nom', 'prenom', 'email', 'image', 'role')
                ->find($friendId);
            if ($friend) {
                $friends[] = [
                    'id' => $friend->id,
                    'nom' => $friend->nom,
                    'prenom' => $friend->prenom,
                    'email' => $friend->email,
                    'image' => $friend->image,
                    'role' => $friend->role,
                    'friendship_id' => $friendship->id_1 . '_' . $friendship->id_2,
                    'friendship_date' => $friendship->created_at ?? null
                ];
            }
        }

        return response()->json([
            'success' => true,
            'friends' => $friends
        ]);
    }

    public function getSuggestions()
    {
        $user = Auth::user();
        $currentFriends = Amitie::where(function ($query) use ($user) {
            $query->where('id_1', $user->id)
                ->orWhere('id_2', $user->id);
        })
            ->where('statut', 'ami')
            ->get()
            ->map(function ($friendship) use ($user) {
                return ($friendship->id_1 == $user->id) ? $friendship->id_2 : $friendship->id_1;
            })
            ->toArray();

        $suggestions = [];
        foreach ($currentFriends as $friendId) {
            $friendFriendships = Amitie::where(function ($query) use ($friendId) {
                $query->where('id_1', $friendId)
                    ->orWhere('id_2', $friendId);
            })
                ->where('statut', 'ami')
                ->get();

            foreach ($friendFriendships as $friendFriendship) {
                $potentialFriendId = ($friendFriendship->id_1 == $friendId) ?
                    $friendFriendship->id_2 : $friendFriendship->id_1;
                if (
                    $potentialFriendId != $user->id &&
                    !in_array($potentialFriendId, $currentFriends) &&
                    !isset($suggestions[$potentialFriendId])
                ) {
                    $mutualFriends = $this->countMutualFriends($user->id, $potentialFriendId);
                    $userData = Utilisateur::select('id', 'nom', 'prenom', 'email', 'image', 'role')
                        ->find($potentialFriendId);
                    if ($userData) {
                        $suggestions[$potentialFriendId] = [
                            'id' => $userData->id,
                            'nom' => $userData->nom,
                            'prenom' => $userData->prenom,
                            'email' => $userData->email,
                            'image' => $userData->image,
                            'role' => $userData->role,
                            'mutual_friends' => $mutualFriends,
                        ];
                    }
                }
            }
        }

        usort($suggestions, function ($a, $b) {
            return $b['mutual_friends'] <=> $a['mutual_friends'];
        });

        return response()->json([
            'success' => true,
            'suggestions' => array_slice($suggestions, 0, 10)
        ]);
    }

    public function getPendingRequests()
    {
        $user = Auth::user();
        $pendingRequests = Amitie::where('id_2', $user->id)
            ->where('statut', 'en attente')
            ->with('utilisateur1:id,nom,prenom,email,image,role')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->utilisateur1->id,
                    'nom' => $request->utilisateur1->nom,
                    'prenom' => $request->utilisateur1->prenom,
                    'email' => $request->utilisateur1->email,
                    'image' => $request->utilisateur1->image,
                    'role' => $request->utilisateur1->role,
                    'request_date' => $request->created_at ?? null
                ];
            });

        return response()->json([
            'success' => true,
            'pending_requests' => $pendingRequests
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2'
        ]);

        $user = Auth::user();
        $query = $request->input('query');

        $users = Utilisateur::where('id', '!=', $user->id)
            ->where(function ($q) use ($query) {
                $q->where('nom', 'LIKE', "%{$query}%")
                    ->orWhere('prenom', 'LIKE', "%{$query}%")
                    ->orWhere('email', 'LIKE', "%{$query}%");
            })
            ->select('id', 'nom', 'prenom', 'email', 'image', 'role', 'bio', 'location')
            ->limit(20)
            ->get()
            ->map(function ($userData) use ($user) {
                $friendship = Amitie::where(function ($q) use ($user, $userData) {
                    $q->where('id_1', $user->id)
                        ->where('id_2', $userData->id);
                })->orWhere(function ($q) use ($user, $userData) {
                    $q->where('id_1', $userData->id)
                        ->where('id_2', $user->id);
                })->first();

                $isFollowing = Follow::where('follower_id', $user->id)
                    ->where('following_id', $userData->id)
                    ->exists();

                return [
                    'id' => $userData->id,
                    'nom' => $userData->nom,
                    'prenom' => $userData->prenom,
                    'email' => $userData->email,
                    'image' => $userData->image,
                    'role' => $userData->role,
                    'bio' => substr($userData->bio ?? '', 0, 100),
                    'location' => $userData->location,
                    'friendship_status' => $friendship ? $friendship->statut : null,
                    'is_friend' => $friendship && $friendship->statut == 'ami',
                    'has_pending_request' => $friendship && $friendship->statut == 'en attente',
                    'is_following' => $isFollowing,
                    'followers_count' => $userData->followers()->count(),
                    'posts_count' => $userData->articles()->count(),
                    'mutual_friends' => $this->countMutualFriends($user->id, $userData->id)
                ];
            });

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    private function countMutualFriends($user1Id, $user2Id)
    {
        $user1Friends = Amitie::where(function ($query) use ($user1Id) {
            $query->where('id_1', $user1Id)
                ->orWhere('id_2', $user1Id);
        })
            ->where('statut', 'ami')
            ->get()
            ->map(function ($friendship) use ($user1Id) {
                return ($friendship->id_1 == $user1Id) ? $friendship->id_2 : $friendship->id_1;
            })
            ->toArray();

        $user2Friends = Amitie::where(function ($query) use ($user2Id) {
            $query->where('id_1', $user2Id)
                ->orWhere('id_2', $user2Id);
        })
            ->where('statut', 'ami')
            ->get()
            ->map(function ($friendship) use ($user2Id) {
                return ($friendship->id_1 == $user2Id) ? $friendship->id_2 : $friendship->id_1;
            })
            ->toArray();

        $mutualFriends = array_intersect($user1Friends, $user2Friends);
        return count($mutualFriends);
    }
}
```

---

## 4. Backend: `back/routes/api.php`

**Issue:** Missing profile like and follow routes.

```php
<?php
// back/routes/api.php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\AmitieController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileLikeController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\ThrottleLogin;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login'])->middleware(ThrottleLogin::class);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/send-verification', [VerificationController::class, 'sendVerificationCode']);
Route::post('/verify-code', [VerificationController::class, 'verifyCode']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Posts routes
    Route::get('/posts/feed', [PostController::class, 'getFeedPosts']);
    Route::post('/posts', [PostController::class, 'createPost']);
    Route::delete('/posts/{post}', [PostController::class, 'deletePost']);
    Route::post('/posts/{post}/like', [PostController::class, 'toggleLike']);
    Route::get('/posts/{post}/comments', [PostController::class, 'getComments']);
    Route::post('/posts/{post}/comments', [PostController::class, 'addComment']);

    // Friends routes
    Route::prefix('friends')->group(function () {
        Route::get('/', [AmitieController::class, 'getFriends']);
        Route::get('/suggestions', [AmitieController::class, 'getSuggestions']);
        Route::get('/pending', [AmitieController::class, 'getPendingRequests']);
        Route::get('/search', [AmitieController::class, 'search']);
        Route::post('/request', [AmitieController::class, 'sendRequest']);
        Route::post('/accept', [AmitieController::class, 'acceptRequest']);
        Route::post('/remove', [AmitieController::class, 'removeFriend']);
    });

    // Profile routes
    Route::get('/profile/{userId?}', [ProfileController::class, 'getProfile']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);
    Route::post('/profile/banner', [ProfileController::class, 'uploadBanner']);
    Route::get('/profile/{userId}/posts', [ProfileController::class, 'getUserPosts']);

    // Profile Like routes
    Route::post('/profile/{userId}/like', [ProfileLikeController::class, 'toggleLike']);

    // Follow routes
    Route::post('/profile/{userId}/follow', [FollowController::class, 'follow']);
    Route::delete('/profile/{userId}/follow', [FollowController::class, 'unfollow']);
    Route::get('/profile/{userId}/followers', [FollowController::class, 'getFollowers']);
    Route::get('/profile/{userId}/following', [FollowController::class, 'getFollowing']);

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::delete('/all', [NotificationController::class, 'deleteAll']);
    });
});
```

---

## 5. Frontend: `front/src/components/main/Profile.jsx`

**Issue:** Missing handler functions for like profile, follow, unfollow and updated stats grid.

```jsx
// front/src/components/main/Profile.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import api from '../../utils/api'
import Modal, { useModal } from '../Modal'
import { getImageUrl } from '../../utils/imageUrls'
import {
    Camera,
    MapPin,
    Link as LinkIcon,
    Calendar,
    Users,
    Heart,
    MessageCircle,
    FileText,
    Edit2,
    Save,
    X,
    UserPlus,
    UserCheck,
    UserX,
    Clock
} from 'lucide-react'
import Header from '../Header'
import SideMenuNav from '../SideMenuNav'

const Profile = () => {
    const { user: currentUser } = useAuth()
    const { userId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { modal, setModal, confirm } = useModal()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [posts, setPosts] = useState([])
    const [activeTab, setActiveTab] = useState('posts')
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({})
    const [uploadingImage, setUploadingImage] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [likingProfile, setLikingProfile] = useState(false)
    const [following, setFollowing] = useState(false)
    const fileInputRef = useRef(null)
    const bannerInputRef = useRef(null)

    useEffect(() => {
        console.log('Profile component mounted, userId:', userId)
        console.log('Current user:', currentUser)
        loadProfile()
    }, [userId])

    const loadProfile = async () => {
        try {
            console.log('Loading profile for userId:', userId || 'current user')
            setLoading(true)
            setError(null)
            const response = await api.get(`/profile/${userId || ''}`)
            console.log('Profile API response:', response.data)
            if (response.data.success) {
                setProfile(response.data.profile)
                setEditData({
                    nom: response.data.profile.nom,
                    prenom: response.data.profile.prenom,
                    bio: response.data.profile.bio || '',
                    location: response.data.profile.location || '',
                    website: response.data.profile.website || '',
                    sexe: response.data.profile.sexe || ''
                })
            } else {
                setError('Impossible de charger le profil')
                setModal({
                    show: true,
                    type: 'error',
                    title: 'Erreur',
                    message: response.data.message || 'Impossible de charger le profil'
                })
            }
        } catch (error) {
            console.error('Profile load error:', error)
            console.error('Error response:', error.response)
            console.error('Error status:', error.response?.status)
            console.error('Error data:', error.response?.data)
            const errorMessage =
                error.response?.data?.message || error.message || 'Erreur de connexion'
            setError(errorMessage)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: errorMessage
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (profile && activeTab === 'posts') {
            loadPosts()
        }
    }, [activeTab, profile])

    const loadPosts = async () => {
        try {
            console.log('Loading posts for user:', profile.id)
            const response = await api.get(`/profile/${profile.id}/posts`)
            console.log('Posts API response:', response.data)
            if (response.data.success) {
                setPosts(response.data.posts)
            }
        } catch (error) {
            console.error('Error loading posts:', error)
        }
    }

    const handleImageUpload = async e => {
        const file = e.target.files[0]
        if (!file) return
        if (!file.type.startsWith('image/')) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Fichier invalide'
            })
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Image trop volumineuse (max 5MB)'
            })
            return
        }
        try {
            setUploadingImage(true)
            const formData = new FormData()
            formData.append('image', file)
            const response = await api.post('/profile/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (response.data.success) {
                setProfile(prev => ({ ...prev, image: response.data.image_url }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Photo mise à jour'
                })
            }
        } catch (error) {
            console.error('Image upload error:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Échec du téléchargement'
            })
        } finally {
            setUploadingImage(false)
        }
    }

    const handleBannerUpload = async e => {
        const file = e.target.files[0]
        if (!file) return
        try {
            setUploadingBanner(true)
            const formData = new FormData()
            formData.append('banner', file)
            const response = await api.post('/profile/banner', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            if (response.data.success) {
                setProfile(prev => ({ ...prev, banner: response.data.banner_url }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Bannière mise à jour'
                })
            }
        } catch (error) {
            console.error('Banner upload error:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Échec du téléchargement'
            })
        } finally {
            setUploadingBanner(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            const submitData = { ...editData }
            if (submitData.website && !submitData.website.startsWith('http')) {
                submitData.website = 'https://' + submitData.website
            }
            const response = await api.put('/profile', submitData)
            if (response.data.success) {
                setProfile(prev => ({ ...prev, ...response.data.user }))
                setIsEditing(false)
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Profil mis à jour'
                })
                loadProfile()
            }
        } catch (error) {
            console.error('Profile update error:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Échec de la mise à jour'
            })
        }
    }

    const handleSendRequest = async () => {
        try {
            const response = await api.post('/friends/request', {
                user_id: profile.id
            })
            if (response.data.success) {
                setProfile(prev => ({ ...prev, has_pending_request: true }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Demande envoyée'
                })
            }
        } catch (error) {
            console.error('Send request error:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Échec'
            })
        }
    }

    const handleAcceptRequest = async () => {
        try {
            const response = await api.post('/friends/accept', {
                user_id: profile.id
            })
            if (response.data.success) {
                setProfile(prev => ({
                    ...prev,
                    is_friend: true,
                    has_pending_request: false
                }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Ami ajouté'
                })
            }
        } catch (error) {
            console.error('Accept request error:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Échec'
            })
        }
    }

    const handleRemoveFriend = async () => {
        const confirmed = await confirm('Supprimer cet ami ?', 'Confirmer')
        if (!confirmed) return
        try {
            const response = await api.post('/friends/remove', {
                user_id: profile.id
            })
            if (response.data.success) {
                setProfile(prev => ({ ...prev, is_friend: false }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Ami supprimé'
                })
            }
        } catch (error) {
            console.error('Remove friend error:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Échec'
            })
        }
    }

    const handleLikeProfile = async () => {
        try {
            setLikingProfile(true)
            const response = await api.post(`/profile/${profile.id}/like`)
            if (response.data.success) {
                setProfile(prev => ({
                    ...prev,
                    has_liked_profile: response.data.liked,
                    stats: {
                        ...prev.stats,
                        likes_received: response.data.likes_count
                    }
                }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: response.data.liked ? 'Profil liké avec succès!' : 'Like retiré'
                })
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors du like'
            })
        } finally {
            setLikingProfile(false)
        }
    }

    const handleFollow = async () => {
        try {
            setFollowing(true)
            const response = await api.post(`/profile/${profile.id}/follow`)
            if (response.data.success) {
                setProfile(prev => ({
                    ...prev,
                    is_following: true,
                    stats: {
                        ...prev.stats,
                        followers: prev.stats.followers + 1
                    }
                }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Utilisateur suivi avec succès!'
                })
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors du follow'
            })
        } finally {
            setFollowing(false)
        }
    }

    const handleUnfollow = async () => {
        const confirmed = await confirm('Voulez-vous vraiment vous désabonner ?', 'Confirmer')
        if (!confirmed) return
        try {
            setFollowing(true)
            const response = await api.delete(`/profile/${profile.id}/follow`)
            if (response.data.success) {
                setProfile(prev => ({
                    ...prev,
                    is_following: false,
                    stats: {
                        ...prev.stats,
                        followers: Math.max(0, prev.stats.followers - 1)
                    }
                }))
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Utilisateur non suivi'
                })
            }
        } catch (error) {
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: error.response?.data?.message || 'Erreur lors du unfollow'
            })
        } finally {
            setFollowing(false)
        }
    }

    const formatDate = dateString => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getInitials = user => {
        return `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase()
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const closeSidebar = () => {
        setSidebarOpen(false)
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='text-white text-lg'>Chargement du profil...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='text-white text-lg text-center'>
                    <p className='mb-4'>{error}</p>
                    <button
                        onClick={loadProfile}
                        className='px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200'
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='text-white text-lg'>Profil non trouvé</div>
            </div>
        )
    }

    const isOwner = profile.is_owner

    return (
        <div className='profile-page min-h-screen bg-[#0a0a0a]'>
            <SideMenuNav isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className='home-main'>
                <Header
                    sidebarOpen={sidebarOpen}
                    onSidebarToggle={toggleSidebar}
                    activeSection='profile'
                    searchQuery=''
                    onSearchChange={() => { }}
                />
                <main className='home-main-content'>
                    {/* Banner Section */}
                    <div className='relative h-64 md:h-80 lg:h-96 overflow-hidden'>
                        <div
                            className='w-full h-full bg-cover bg-center'
                            style={{
                                backgroundImage: profile.banner
                                    ? `url(${getImageUrl(profile.banner)})`
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                        >
                            <div className='absolute inset-0 bg-black/30'></div>
                        </div>
                        {isOwner && (
                            <button
                                onClick={() => bannerInputRef.current?.click()}
                                disabled={uploadingBanner}
                                className='absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all'
                            >
                                {uploadingBanner ? (
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                ) : (
                                    <Camera size={18} />
                                )}
                                <span className='hidden md:inline'>Changer la bannière</span>
                            </button>
                        )}
                        <input
                            ref={bannerInputRef}
                            type='file'
                            accept='image/*'
                            onChange={handleBannerUpload}
                            className='hidden'
                        />
                    </div>

                    {/* Profile Info Section */}
                    <div className='max-w-6xl mx-auto px-4 -mt-20 md:-mt-24 relative z-10'>
                        <div className='bg-[#141414] border border-[#262626] rounded-2xl p-6 md:p-8'>
                            <div className='flex flex-col md:flex-row items-center md:items-end gap-6'>
                                {/* Avatar */}
                                <div className='relative group'>
                                    <div className='w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#141414] shadow-2xl'>
                                        {profile.image ? (
                                            <img
                                                src={getImageUrl(profile.image)}
                                                alt={`${profile.prenom} ${profile.nom}`}
                                                className='w-full h-full object-cover'
                                                onError={e => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextElementSibling.style.display = 'flex'
                                                }}
                                            />
                                        ) : null}
                                        <div
                                            className={`w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl md:text-4xl font-bold ${profile.image ? 'hidden' : 'flex'
                                                }`}
                                        >
                                            {getInitials(profile)}
                                        </div>
                                    </div>
                                    {isOwner && (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className='absolute bottom-2 right-2 bg-white text-black p-2 rounded-full shadow-lg hover:scale-110 transition-transform'
                                        >
                                            {uploadingImage ? (
                                                <div className='w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin'></div>
                                            ) : (
                                                <Camera size={18} />
                                            )}
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type='file'
                                        accept='image/*'
                                        onChange={handleImageUpload}
                                        className='hidden'
                                    />
                                </div>

                                {/* Name & Basic Info */}
                                <div className='flex-1 text-center md:text-left'>
                                    <div className='flex flex-col md:flex-row md:items-center gap-3 mb-2'>
                                        <h1 className='text-2xl md:text-3xl font-bold text-white'>
                                            {profile.prenom} {profile.nom}
                                        </h1>
                                        {profile.role && (
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium w-fit mx-auto md:mx-0 ${profile.role === 'admin'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : profile.role === 'mod'
                                                            ? 'bg-blue-500/20 text-blue-400'
                                                            : 'bg-gray-500/20 text-gray-400'
                                                    }`}
                                            >
                                                {profile.role === 'admin'
                                                    ? '★ Administrateur'
                                                    : profile.role === 'mod'
                                                        ? '★ Modérateur'
                                                        : 'Utilisateur'}
                                            </span>
                                        )}
                                    </div>
                                    {!isEditing ? (
                                        <>
                                            {profile.bio && (
                                                <p className='text-gray-400 mb-3 max-w-2xl'>
                                                    {profile.bio}
                                                </p>
                                            )}
                                            <div className='flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500'>
                                                {profile.location && (
                                                    <div className='flex items-center gap-1'>
                                                        <MapPin size={14} />
                                                        <span>{profile.location}</span>
                                                    </div>
                                                )}
                                                {profile.website && (
                                                    <a
                                                        href={
                                                            profile.website.startsWith('http')
                                                                ? profile.website
                                                                : `https://${profile.website}`
                                                        }
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='flex items-center gap-1 hover:text-white transition-colors'
                                                    >
                                                        <LinkIcon size={14} />
                                                        <span>
                                                            {profile.website.replace(/^https?:\/\//, '')}
                                                        </span>
                                                    </a>
                                                )}
                                                <div className='flex items-center gap-1'>
                                                    <Calendar size={14} />
                                                    <span>
                                                        Membre depuis {formatDate(profile.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='space-y-3 max-w-2xl mx-auto md:mx-0'>
                                            <input
                                                type='text'
                                                value={editData.bio || ''}
                                                onChange={e =>
                                                    setEditData(prev => ({
                                                        ...prev,
                                                        bio: e.target.value
                                                    }))
                                                }
                                                placeholder='Votre bio...'
                                                className='w-full px-3 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500'
                                            />
                                            <div className='flex gap-3'>
                                                <input
                                                    type='text'
                                                    value={editData.location || ''}
                                                    onChange={e =>
                                                        setEditData(prev => ({
                                                            ...prev,
                                                            location: e.target.value
                                                        }))
                                                    }
                                                    placeholder='Localisation'
                                                    className='flex-1 px-3 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500'
                                                />
                                                <input
                                                    type='text'
                                                    value={editData.website || ''}
                                                    onChange={e =>
                                                        setEditData(prev => ({
                                                            ...prev,
                                                            website: e.target.value
                                                        }))
                                                    }
                                                    placeholder='Site web'
                                                    className='flex-1 px-3 py-2 bg-[#262626] border border-[#262626] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-500'
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className='flex gap-3 flex-wrap'>
                                    {isOwner ? (
                                        !isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                                            >
                                                <Edit2 size={18} />
                                                Modifier
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setIsEditing(false)
                                                        setEditData({
                                                            nom: profile.nom,
                                                            prenom: profile.prenom,
                                                            bio: profile.bio || '',
                                                            location: profile.location || '',
                                                            website: profile.website || '',
                                                            sexe: profile.sexe || ''
                                                        })
                                                    }}
                                                    className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-[#363636] transition-all flex items-center gap-2'
                                                >
                                                    <X size={18} />
                                                    Annuler
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                                                >
                                                    <Save size={18} />
                                                    Enregistrer
                                                </button>
                                            </>
                                        )
                                    ) : (
                                        <>
                                            {/* Like Profile */}
                                            <button
                                                onClick={handleLikeProfile}
                                                disabled={likingProfile}
                                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${profile.has_liked_profile
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        : 'bg-[#262626] text-gray-400 hover:text-white'
                                                    }`}
                                            >
                                                <Heart size={18} fill={profile.has_liked_profile ? 'currentColor' : 'none'} />
                                                <span>{profile.stats.likes_received}</span>
                                            </button>

                                            {/* Follow/Unfollow */}
                                            <button
                                                onClick={profile.is_following ? handleUnfollow : handleFollow}
                                                disabled={following}
                                                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${profile.is_following
                                                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                        : 'bg-white text-black hover:bg-gray-200'
                                                    }`}
                                            >
                                                <UserCheck size={18} />
                                                {profile.is_following ? 'Abonné' : 'S\'abonner'}
                                            </button>

                                            {/* Friend Actions */}
                                            {profile.is_friend ? (
                                                <button
                                                    onClick={handleRemoveFriend}
                                                    className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center gap-2'
                                                >
                                                    <UserX size={18} />
                                                    Retirer
                                                </button>
                                            ) : profile.has_pending_request ? (
                                                <>
                                                    <button
                                                        onClick={handleAcceptRequest}
                                                        className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                                                    >
                                                        <UserCheck size={18} />
                                                        Accepter
                                                    </button>
                                                    <button
                                                        onClick={handleRemoveFriend}
                                                        className='px-6 py-2 bg-[#262626] text-white rounded-lg font-medium hover:bg-[#363636] transition-all flex items-center gap-2'
                                                    >
                                                        <X size={18} />
                                                        Refuser
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={handleSendRequest}
                                                    className='px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center gap-2'
                                                >
                                                    <UserPlus size={18} />
                                                    Ajouter
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-8 pt-8 border-t border-[#262626]'>
                                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                                        <FileText size={20} />
                                        <span className='text-sm'>Publications</span>
                                    </div>
                                    <div className='text-2xl md:text-3xl font-bold text-white'>
                                        {profile.stats.posts}
                                    </div>
                                </div>
                                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                                        <Users size={20} />
                                        <span className='text-sm'>Amis</span>
                                    </div>
                                    <div className='text-2xl md:text-3xl font-bold text-white'>
                                        {profile.stats.friends}
                                    </div>
                                </div>
                                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                                        <Heart size={20} />
                                        <span className='text-sm'>Likes profil</span>
                                    </div>
                                    <div className='text-2xl md:text-3xl font-bold text-white'>
                                        {profile.stats.likes_received}
                                    </div>
                                </div>
                                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                                        <UserCheck size={20} />
                                        <span className='text-sm'>Followers</span>
                                    </div>
                                    <div className='text-2xl md:text-3xl font-bold text-white'>
                                        {profile.stats.followers}
                                    </div>
                                </div>
                                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                                        <Users size={20} />
                                        <span className='text-sm'>Following</span>
                                    </div>
                                    <div className='text-2xl md:text-3xl font-bold text-white'>
                                        {profile.stats.following}
                                    </div>
                                </div>
                                <div className='text-center p-4 bg-[#1f1f1f] rounded-xl'>
                                    <div className='flex items-center justify-center gap-2 text-gray-400 mb-2'>
                                        <MessageCircle size={20} />
                                        <span className='text-sm'>Commentaires</span>
                                    </div>
                                    <div className='text-2xl md:text-3xl font-bold text-white'>
                                        {profile.stats.comments_received}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className='mt-6'>
                            <div className='flex gap-2 mb-6 overflow-x-auto'>
                                {[
                                    { id: 'posts', label: 'Publications', icon: FileText },
                                    {
                                        id: 'friends',
                                        label: 'Amis',
                                        icon: Users,
                                        count: profile.recent_friends?.length
                                    },
                                    { id: 'about', label: 'À propos', icon: MapPin }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id
                                                ? 'bg-white text-black'
                                                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
                                            }`}
                                    >
                                        <tab.icon size={18} />
                                        <span>{tab.label}</span>
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className='bg-[#262626] px-2 py-0.5 rounded-full text-xs'>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className='bg-[#141414] border border-[#262626] rounded-2xl p-6 min-h-96'>
                                {activeTab === 'posts' && (
                                    <div className='space-y-4'>
                                        {posts.length === 0 ? (
                                            <div className='text-center py-12 text-gray-400'>
                                                <FileText
                                                    size={48}
                                                    className='mx-auto mb-4 opacity-50'
                                                />
                                                <p>Aucune publication pour le moment</p>
                                            </div>
                                        ) : (
                                            posts.map(post => (
                                                <div
                                                    key={post.id}
                                                    className='bg-[#1f1f1f] rounded-xl p-4'
                                                >
                                                    <p className='text-white mb-3'>{post.description}</p>
                                                    {post.image && (
                                                        <img
                                                            src={getImageUrl(post.image)}
                                                            alt='Post'
                                                            className='w-full max-h-96 object-cover rounded-lg mb-3'
                                                        />
                                                    )}
                                                    <div className='flex gap-4 text-sm text-gray-400'>
                                                        <span className='flex items-center gap-1'>
                                                            <Heart size={14} /> {post.likes_count}
                                                        </span>
                                                        <span className='flex items-center gap-1'>
                                                            <MessageCircle size={14} /> {post.comments_count}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                                {activeTab === 'friends' && (
                                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                                        {profile.recent_friends?.length > 0 ? (
                                            profile.recent_friends.map(friend => (
                                                <div
                                                    key={friend.id}
                                                    className='bg-[#1f1f1f] rounded-xl p-4 text-center hover:bg-[#262626] transition-all cursor-pointer'
                                                >
                                                    <div className='w-16 h-16 mx-auto rounded-full overflow-hidden mb-3'>
                                                        {friend.image ? (
                                                            <img
                                                                src={getImageUrl(friend.image)}
                                                                alt={`${friend.prenom} ${friend.nom}`}
                                                                className='w-full h-full object-cover'
                                                            />
                                                        ) : (
                                                            <div className='w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold'>
                                                                {getInitials(friend)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className='text-white font-medium text-sm truncate'>
                                                        {friend.prenom} {friend.nom}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='col-span-full text-center py-12 text-gray-400'>
                                                <Users size={48} className='mx-auto mb-4 opacity-50' />
                                                <p>Aucun ami à afficher</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'about' && (
                                    <div className='space-y-6'>
                                        <div>
                                            <h3 className='text-lg font-semibold text-white mb-3'>
                                                Informations
                                            </h3>
                                            <div className='grid md:grid-cols-2 gap-4'>
                                                <div className='bg-[#1f1f1f] rounded-xl p-4'>
                                                    <div className='text-gray-400 text-sm mb-1'>
                                                        Nom complet
                                                    </div>
                                                    <div className='text-white'>
                                                        {profile.prenom} {profile.nom}
                                                    </div>
                                                </div>
                                                <div className='bg-[#1f1f1f] rounded-xl p-4'>
                                                    <div className='text-gray-400 text-sm mb-1'>
                                                        Email
                                                    </div>
                                                    <div className='text-white'>{profile.email}</div>
                                                </div>
                                                {profile.location && (
                                                    <div className='bg-[#1f1f1f] rounded-xl p-4'>
                                                        <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                                                            <MapPin size={14} /> Localisation
                                                        </div>
                                                        <div className='text-white'>{profile.location}</div>
                                                    </div>
                                                )}
                                                {profile.website && (
                                                    <div className='bg-[#1f1f1f] rounded-xl p-4'>
                                                        <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                                                            <LinkIcon size={14} /> Site web
                                                        </div>
                                                        <a
                                                            href={
                                                                profile.website.startsWith('http')
                                                                    ? profile.website
                                                                    : `https://${profile.website}`
                                                            }
                                                            target='_blank'
                                                            rel='noopener noreferrer'
                                                            className='text-white hover:underline'
                                                        >
                                                            {profile.website}
                                                        </a>
                                                    </div>
                                                )}
                                                <div className='bg-[#1f1f1f] rounded-xl p-4'>
                                                    <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                                                        <Calendar size={14} /> Membre depuis
                                                    </div>
                                                    <div className='text-white'>
                                                        {formatDate(profile.created_at)}
                                                    </div>
                                                </div>
                                                {profile.mutual_friends_count > 0 && (
                                                    <div className='bg-[#1f1f1f] rounded-xl p-4'>
                                                        <div className='text-gray-400 text-sm mb-1 flex items-center gap-2'>
                                                            <Users size={14} /> Amis mutuels
                                                        </div>
                                                        <div className='text-white'>
                                                            {profile.mutual_friends_count}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Modal modal={modal} setModal={setModal} />
        </div>
    )
}

export default Profile
```

---

## 6. Frontend: `front/src/components/main/Notifications.jsx`

**Issue:** Missing icon/color handling for `profile_like` and `follow` types.

```jsx
// front/src/components/main/Notifications.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../utils/api'
import Modal, { useModal } from '.././Modal'
import { getImageUrl } from '../../utils/imageUrls'
import {
    Bell,
    Check,
    CheckCheck,
    Trash2,
    Clock,
    Heart,
    MessageCircle,
    UserPlus,
    UserCheck,
    AtSign,
    Gift,
    Settings,
    X
} from 'lucide-react'

const Notifications = ({ searchQuery, onSearchFocus, onSearchBlur }) => {
    const { user } = useAuth()
    const { modal, setModal, confirm } = useModal()
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        loadNotifications()
        loadUnreadCount()
    }, [filter])

    const loadNotifications = async () => {
        try {
            setLoading(true)
            const response = await api.get(
                `/notifications?unread_only=${filter === 'unread'}`
            )
            if (response.data.success) {
                setNotifications(response.data.notifications)
            }
        } catch (error) {
            console.error('Error loading notifications:', error)
            setModal({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'Impossible de charger les notifications'
            })
        } finally {
            setLoading(false)
        }
    }

    const loadUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread-count')
            if (response.data.success) {
                setUnreadCount(response.data.count)
            }
        } catch (error) {
            console.error('Error loading unread count:', error)
        }
    }

    const markAsRead = async notificationId => {
        try {
            await api.post(`/notifications/${notificationId}/read`)
            setNotifications(
                notifications.map(n =>
                    n.id === notificationId ? { ...n, is_read: true } : n
                )
            )
            loadUnreadCount()
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    const markAllAsRead = async () => {
        const confirmed = await confirm(
            'Marquer toutes les notifications comme lues ?',
            'Confirmer'
        )
        if (confirmed) {
            try {
                await api.post('/notifications/read-all')
                setNotifications(notifications.map(n => ({ ...n, is_read: true })))
                setUnreadCount(0)
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Toutes les notifications ont été marquées comme lues'
                })
            } catch (error) {
                console.error('Error marking all as read:', error)
            }
        }
    }

    const deleteNotification = async notificationId => {
        const confirmed = await confirm(
            'Supprimer cette notification ?',
            'Confirmer'
        )
        if (confirmed) {
            try {
                await api.delete(`/notifications/${notificationId}`)
                setNotifications(notifications.filter(n => n.id !== notificationId))
                loadUnreadCount()
            } catch (error) {
                console.error('Error deleting notification:', error)
            }
        }
    }

    const deleteAllNotifications = async () => {
        const confirmed = await confirm(
            'Supprimer toutes les notifications ? Cette action est irréversible.',
            'Confirmer la suppression'
        )
        if (confirmed) {
            try {
                await api.delete('/notifications/all')
                setNotifications([])
                setUnreadCount(0)
                setModal({
                    show: true,
                    type: 'success',
                    title: 'Succès',
                    message: 'Toutes les notifications ont été supprimées'
                })
            } catch (error) {
                console.error('Error deleting all notifications:', error)
            }
        }
    }

    const getNotificationIcon = type => {
        const icons = {
            like: <Heart className='text-red-500' size={20} />,
            comment: <MessageCircle className='text-blue-500' size={20} />,
            friend_request: <UserPlus className='text-purple-500' size={20} />,
            friend_accepted: <UserCheck className='text-green-500' size={20} />,
            mention: <AtSign className='text-yellow-500' size={20} />,
            welcome: <Gift className='text-pink-500' size={20} />,
            system: <Settings className='text-gray-500' size={20} />,
            profile_like: <Heart className='text-red-500' size={20} />,
            follow: <UserCheck className='text-purple-500' size={20} />
        }
        return icons[type] || <Bell className='text-gray-500' size={20} />
    }

    const getNotificationColor = type => {
        const colors = {
            like: 'bg-red-500/10 border-red-500/20',
            comment: 'bg-blue-500/10 border-blue-500/20',
            friend_request: 'bg-purple-500/10 border-purple-500/20',
            friend_accepted: 'bg-green-500/10 border-green-500/20',
            mention: 'bg-yellow-500/10 border-yellow-500/20',
            welcome: 'bg-pink-500/10 border-pink-500/20',
            system: 'bg-gray-500/10 border-gray-500/20',
            profile_like: 'bg-red-500/10 border-red-500/20',
            follow: 'bg-purple-500/10 border-purple-500/20'
        }
        return colors[type] || 'bg-gray-500/10 border-gray-500/20'
    }

    const getUserAvatar = userData => {
        if (userData?.image) {
            return (
                <img
                    src={getImageUrl(userData.image)}
                    alt={userData.prenom}
                    className='w-full h-full rounded-full object-cover'
                />
            )
        }
        return (
            <div className='w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm'>
                {userData?.prenom?.[0]}
                {userData?.nom?.[0]}
            </div>
        )
    }

    return (
        <div className='section-content active'>
            <div className='notifications-container max-w-4xl mx-auto'>
                {/* Header */}
                <div className='section-header mb-6'>
                    <div className='flex items-center gap-3'>
                        <Bell size={28} className='text-white' />
                        <h2>Notifications</h2>
                        {unreadCount > 0 && (
                            <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <div className='flex gap-2'>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className='btn-text flex items-center gap-2'
                            >
                                <CheckCheck size={16} />
                                Tout lire
                            </button>
                        )}
                        {notifications.length > 0 && (
                            <button
                                onClick={deleteAllNotifications}
                                className='btn-text flex items-center gap-2 text-red-400 hover:text-red-300'
                            >
                                <Trash2 size={16} />
                                Tout supprimer
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className='flex gap-2 mb-6'>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                ? 'bg-white text-black'
                                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
                            }`}
                    >
                        Toutes
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'unread'
                                ? 'bg-white text-black'
                                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
                            }`}
                    >
                        Non lues
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'read'
                                ? 'bg-white text-black'
                                : 'bg-[#141414] text-gray-400 hover:text-white border border-[#262626]'
                            }`}
                    >
                        Lues
                    </button>
                </div>

                {/* Notifications List */}
                <div className='space-y-3'>
                    {loading ? (
                        <div className='text-center py-12 text-gray-400'>
                            <Clock
                                size={48}
                                className='mx-auto mb-4 opacity-50 animate-pulse'
                            />
                            <p>Chargement des notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className='text-center py-12 bg-[#141414] border border-[#262626] rounded-xl'>
                            <Bell
                                size={48}
                                className='mx-auto mb-4 text-gray-400 opacity-50'
                            />
                            <h3 className='text-lg font-semibold text-white mb-2'>
                                Aucune notification
                            </h3>
                            <p className='text-gray-400'>
                                {filter === 'unread'
                                    ? "Vous n'avez aucune notification non lue"
                                    : "Vous n'avez aucune notification pour le moment"}
                            </p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-xl border transition-all ${notification.is_read
                                        ? 'bg-[#141414] border-[#262626]'
                                        : `${getNotificationColor(
                                            notification.type
                                        )} border-opacity-50`
                                    }`}
                            >
                                <div className='flex items-start gap-4'>
                                    {/* Icon */}
                                    <div className='flex-shrink-0 w-10 h-10 rounded-full bg-[#1f1f1f] flex items-center justify-center'>
                                        {getNotificationIcon(notification.type)}
                                    </div>
                                    {/* Content */}
                                    <div className='flex-1 min-w-0'>
                                        <div className='flex items-start justify-between gap-2'>
                                            <div>
                                                <h4 className='text-white font-medium'>
                                                    {notification.title}
                                                </h4>
                                                <p className='text-gray-400 text-sm mt-1'>
                                                    {notification.message}
                                                </p>
                                                <p className='text-gray-500 text-xs mt-2'>
                                                    {notification.created_at}
                                                </p>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className='p-2 text-gray-400 hover:text-green-500 transition-colors'
                                                        title='Marquer comme lu'
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className='p-2 text-gray-400 hover:text-red-500 transition-colors'
                                                    title='Supprimer'
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        {/* Sender Info */}
                                        {notification.sender && (
                                            <div className='flex items-center gap-3 mt-3 pt-3 border-t border-[#262626]'>
                                                <div className='w-8 h-8 rounded-full overflow-hidden flex-shrink-0'>
                                                    {getUserAvatar(notification.sender)}
                                                </div>
                                                <span className='text-sm text-gray-300'>
                                                    {notification.sender.prenom} {notification.sender.nom}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <Modal modal={modal} setModal={setModal} />
        </div>
    )
}

export default Notifications
```

---

## 7. Frontend: `front/src/components/Header.jsx`

**Issue:** Missing search form submission handler.

```jsx
// front/src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
    Search,
    Bell,
    User,
    LogOut,
    Menu,
    MessageCircle,
    Users,
    LayoutDashboard,
    Settings,
    X
} from 'lucide-react'
import Modal, { useModal } from './Modal'
import { getImageUrl } from '../utils/imageUrls'

const Header = ({
    sidebarOpen,
    onSidebarToggle,
    activeSection = 'feed',
    searchQuery,
    onSearchChange
}) => {
    const { user, logout } = useAuth()
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '')
    const navigate = useNavigate()
    const location = useLocation()
    const profileDropdownRef = useRef(null)
    const searchInputRef = useRef(null)
    const { modal, setModal, confirm } = useModal()

    useEffect(() => {
        setLocalSearchQuery(searchQuery || '')
    }, [searchQuery])

    const getUserAvatar = () => {
        if (user?.image) {
            const imageUrl = getImageUrl(user.image)
            return (
                <img
                    src={imageUrl}
                    alt='Profile'
                    className='w-full h-full rounded-full object-cover'
                    onError={e => {
                        console.error('Image failed to load:', e.target.src)
                        e.target.style.display = 'none'
                    }}
                />
            )
        }
        return (
            <div className='w-full h-full rounded-full bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-black text-sm font-bold'>
                {user?.prenom?.[0]}
                {user?.nom?.[0]}
            </div>
        )
    }

    const getSearchPlaceholder = () => {
        if (activeSection === 'messages') {
            return 'Rechercher des messages...'
        } else if (activeSection === 'friends') {
            return 'Rechercher des amis...'
        } else {
            return 'Rechercher des posts...'
        }
    }

    const handleSearchChange = e => {
        const value = e.target.value
        setLocalSearchQuery(value)
        if (onSearchChange) {
            onSearchChange(value)
        }
    }

    const handleSearchFocus = () => {
        if (activeSection === 'friends' && onSearchChange) {
            onSearchChange(localSearchQuery)
        }
    }

    const handleSearchBlur = () => {
        if (localSearchQuery.trim() === '') {
            setLocalSearchQuery('')
            if (onSearchChange) {
                onSearchChange('')
            }
        }
    }

    const clearSearch = () => {
        setLocalSearchQuery('')
        if (onSearchChange) {
            onSearchChange('')
        }
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }

    // NEW: Handle search form submission - navigate to search results page
    const handleSearchSubmit = e => {
        e.preventDefault()
        if (localSearchQuery.trim().length >= 2) {
            navigate(`/search?q=${encodeURIComponent(localSearchQuery)}`)
        }
    }

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen)
    }

    const handleProfileAction = async action => {
        setIsProfileDropdownOpen(false)
        switch (action) {
            case 'profile':
                navigate('/profile')
                break
            case 'settings':
                navigate('/settings')
                break
            case 'logout':
                const shouldLogout = await confirm(
                    'Êtes-vous sûr de vouloir vous déconnecter?',
                    'Confirmer la déconnexion'
                )
                if (shouldLogout) {
                    await logout()
                    navigate('/login')
                }
                break
            default:
                break
        }
    }

    const handleNavigation = section => {
        if (section !== activeSection) {
            setLocalSearchQuery('')
            if (onSearchChange) {
                onSearchChange('')
            }
        }
        navigate(`/${section}`)
    }

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                isProfileDropdownOpen &&
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isProfileDropdownOpen])

    useEffect(() => {
        const handleEscape = event => {
            if (event.key === 'Escape' && isProfileDropdownOpen) {
                setIsProfileDropdownOpen(false)
            } else if (event.key === 'Escape' && localSearchQuery) {
                clearSearch()
            }
        }
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isProfileDropdownOpen, localSearchQuery])

    const navItems = [
        { id: 'feed', icon: LayoutDashboard, label: 'Fil', badge: null },
        { id: 'friends', icon: Users, label: 'Amis', badge: null },
        { id: 'messages', icon: MessageCircle, label: 'Messages', badge: 0 },
        { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
        { id: 'profile', icon: User, label: 'Profil', badge: null },
        ...(user?.role === 'admin' || user?.role === 'mod'
            ? [
                {
                    id: 'dashboard',
                    icon: Settings,
                    label: 'Tableau de bord',
                    badge: null
                }
            ]
            : [])
    ]

    return (
        <>
            <header className='home-header'>
                <div className='header-content'>
                    {/* Side Menu Toggle */}
                    <button className='menu-toggle' onClick={onSidebarToggle}>
                        <Menu size={24} />
                    </button>
                    {/* Desktop Navigation */}
                    <nav className='desktop-nav hidden lg:flex'>
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-btn ${activeSection === item.id ? 'active' : ''
                                    }`}
                                onClick={() => handleNavigation(item.id)}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                                {item.badge !== null && item.badge > 0 && (
                                    <span className='notification-badge'>{item.badge}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                    {/* Search Bar - UPDATED with form submission */}
                    <div className='header-search'>
                        <form onSubmit={handleSearchSubmit} className='w-full'>
                            <input
                                ref={searchInputRef}
                                type='text'
                                placeholder={getSearchPlaceholder()}
                                value={localSearchQuery}
                                onChange={handleSearchChange}
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                            />
                        </form>
                        {localSearchQuery ? (
                            <button
                                onClick={clearSearch}
                                className='absolute right-8 text-gray-400 hover:text-white transition-colors'
                            >
                                <X size={18} />
                            </button>
                        ) : (
                            <Search size={18} className='absolute right-3' />
                        )}
                    </div>
                    {/* User Profile */}
                    <div className='header-profile' ref={profileDropdownRef}>
                        <div
                            className='profile-pic cursor-pointer'
                            onClick={toggleProfileDropdown}
                        >
                            <div className='w-8 h-8 rounded-full overflow-hidden'>
                                {getUserAvatar()}
                            </div>
                        </div>
                        {/* Profile Dropdown Menu */}
                        {isProfileDropdownOpen && (
                            <div className='profile-dropdown-menu'>
                                <div className='profile-dropdown-header'>
                                    <div className='user-avatar'>
                                        <div className='w-12 h-12 rounded-full overflow-hidden'>
                                            {getUserAvatar()}
                                        </div>
                                    </div>
                                    <div className='user-info'>
                                        <div className='user-name'>
                                            {user?.prenom} {user?.nom}
                                        </div>
                                        <div className='user-role'>
                                            {user?.role === 'admin'
                                                ? 'Administrateur'
                                                : user?.role === 'mod'
                                                    ? 'Modérateur'
                                                    : 'Utilisateur'}
                                        </div>
                                    </div>
                                </div>
                                <div className='profile-dropdown-divider'></div>
                                <button
                                    className='profile-dropdown-item'
                                    onClick={() => handleProfileAction('profile')}
                                >
                                    <User size={18} />
                                    <span>Mon Profil</span>
                                </button>
                                <button
                                    className='profile-dropdown-item'
                                    onClick={() => handleProfileAction('settings')}
                                >
                                    <Settings size={18} />
                                    <span>Paramètres</span>
                                </button>
                                <button
                                    className='profile-dropdown-item logout-item'
                                    onClick={() => handleProfileAction('logout')}
                                >
                                    <LogOut size={18} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <Modal modal={modal} setModal={setModal} />
        </>
    )
}

export default Header
```

---

## 8. Frontend: `front/src/App.jsx`

**Issue:** Verify search route exists (already exists in your codebase but confirming).

```jsx
// front/src/App.jsx
import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/main/Home'
import Profile from './components/main/Profile'
import SearchResults from './components/main/SearchResults'
import './style/app.css'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='text-white'>Chargement...</div>
            </div>
        )
    }
    return user ? children : <Navigate to='/login' />
}

// Public Route Component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return (
            <div className='min-h-screen bg-black flex items-center justify-center'>
                <div className='text-white'>Chargement...</div>
            </div>
        )
    }
    return !user ? children : <Navigate to='/home' />
}

function AppRoutes() {
    return (
        <div className='min-h-screen bg-black text-white'>
            <Routes>
                <Route
                    path='/login'
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path='/signup'
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />
                {/* Search Route - MUST come before /home/* to avoid conflicts */}
                <Route
                    path='/search'
                    element={
                        <ProtectedRoute>
                            <SearchResults />
                        </ProtectedRoute>
                    }
                />
                {/* Profile route - MUST come before /home/* to avoid conflicts */}
                <Route
                    path='/profile/:userId?'
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                {/* Home route with nested sections */}
                <Route
                    path='/home/*'
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                {/* Individual section routes */}
                <Route
                    path='/feed'
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/friends'
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/messages'
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/notifications'
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/dashboard'
                    element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }
                />
                <Route path='/' element={<Navigate to='/home' />} />
            </Routes>
        </div>
    )
}

export default function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    )
}
```

---

## Summary of Fixed Files

| File | Issue Fixed |
|------|-------------|
| `back/app/Models/Notification.php` | Added `TYPE_PROFILE_LIKE`, `TYPE_FOLLOW` constants and icon/color mappings |
| `back/app/Http/Controllers/ProfileController.php` | Complete `getProfile` method with all relationship checks and stats |
| `back/app/Http/Controllers/AmitieController.php` | Search method with `is_following`, `followers_count`, `posts_count`, `bio`, `location` |
| `back/routes/api.php` | Added profile like and follow routes |
| `front/src/components/main/Profile.jsx` | Added handler functions for like profile, follow, unfollow and updated stats grid |
| `front/src/components/main/Notifications.jsx` | Added icon/color handling for `profile_like` and `follow` types |
| `front/src/components/Header.jsx` | Added search form submission handler |
| `front/src/App.jsx` | Confirmed search route exists |

**After applying these fixes, run:**
```bash
cd back
php artisan migrate
php artisan config:clear
php artisan cache:clear
```