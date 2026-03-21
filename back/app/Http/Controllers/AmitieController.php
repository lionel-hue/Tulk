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
