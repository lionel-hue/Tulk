<?php
// back/app/Http/Controllers/AmitieController.php
namespace App\Http\Controllers;

use App\Models\Amitie;
use App\Models\Utilisateur;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

        if ($user->id === (int)$targetUserId) {
            return response()->json([
                'success' => false,
                'message' => 'Vous ne pouvez pas vous ajouter vous-même en ami'
            ], 400);
        }

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
            'friendship' => [
                'id_1' => $user->id,
                'id_2' => $targetUserId,
                'statut' => 'en attente'
            ]
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
    
        // Find the pending request (could be in either direction, though typically requester is id_1)
        $friendship = Amitie::where(function($q) use ($requesterId, $user) {
            $q->where('id_1', $requesterId)->where('id_2', $user->id);
        })->orWhere(function($q) use ($requesterId, $user) {
            $q->where('id_1', $user->id)->where('id_2', $requesterId);
        })->where('statut', 'en attente')->first();
    
        if (!$friendship) {
            return response()->json([
                'success' => false,
                'message' => 'Demande d\'amitié non trouvée'
            ], 404);
        }
    
        // Update to ami
        Amitie::where('id_1', $friendship->id_1)
            ->where('id_2', $friendship->id_2)
            ->update(['statut' => 'ami']);
        
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
            'friendship' => [
                'id_1' => $friendship->id_1,
                'id_2' => $friendship->id_2,
                'statut' => 'ami'
            ]
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

        // Use query builder for deletion to handle composite keys correctly
        Amitie::where('id_1', $friendship->id_1)
            ->where('id_2', $friendship->id_2)
            ->delete();

        return response()->json([
            'success' => true,
            'message' => 'Relation d\'amitié supprimée'
        ]);
    }

    public function getFriends(Request $request)
    {
        $user = Auth::user();
        $targetUserId = $request->query('user_id', $user->id);
        $targetUser = Utilisateur::find($targetUserId);

        if (!$targetUser) {
            return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé'], 404);
        }

        $perPage = 12;
        $page = max(1, (int) $request->query('page', 1));

        $friendships = Amitie::where(function ($query) use ($targetUser) {
            $query->where('id_1', $targetUser->id)
                ->orWhere('id_2', $targetUser->id);
        })
        ->where('statut', 'ami')
        ->with([
            'utilisateur1' => function($q) { $q->withCount(['followers', 'articles']); },
            'utilisateur2' => function($q) { $q->withCount(['followers', 'articles']); }
        ])
        ->get();

        $allFriends = [];
        $seenIds = [];
        
        foreach ($friendships as $friendship) {
            $friend = ($friendship->id_1 == $targetUser->id) ? $friendship->utilisateur2 : $friendship->utilisateur1;
            
            if (!$friend || in_array($friend->id, $seenIds)) continue;
            $seenIds[] = $friend->id;

            $allFriends[] = [
                'id'              => $friend->id,
                'nom'             => $friend->nom,
                'prenom'          => $friend->prenom,
                'email'           => $friend->email,
                'image'           => $friend->image ? Storage::url($friend->image) : null,
                'role'            => $friend->role,
                'bio'             => $friend->bio ? mb_substr($friend->bio, 0, 100) : null,
                'location'        => $friend->location,
                'followers_count' => $friend->followers_count,
                'posts_count'     => $friend->articles_count,
                'friendship_id'   => $friendship->id_1 . '_' . $friendship->id_2,
                'friendship_date' => $friendship->created_at ?? null
            ];
        }

        $total    = count($allFriends);
        $offset   = ($page - 1) * $perPage;
        $slice    = array_slice($allFriends, $offset, $perPage);
        $hasMore  = ($offset + $perPage) < $total;

        return response()->json([
            'success'  => true,
            'friends'  => $slice,
            'total'    => $total,
            'page'     => $page,
            'has_more' => $hasMore
        ]);
    }

    public function getSuggestions(Request $request)
    {
        $user = Auth::user();
        $perPage = 12;
        $page = max(1, (int) $request->query('page', 1));

        // Get my friend IDs to count mutual friends
        $myFriendIds = Amitie::where(function ($query) use ($user) {
                $query->where('id_1', $user->id)->orWhere('id_2', $user->id);
            })
            ->where('statut', 'ami')
            ->get()
            ->map(function ($f) use ($user) {
                return ($f->id_1 == $user->id) ? $f->id_2 : $f->id_1;
            })
            ->toArray();

        // Get currently related user IDs to exclude
        $relatedIds = Amitie::where(function ($q) use ($user) {
            $q->where('id_1', $user->id)->orWhere('id_2', $user->id);
        })->get()->map(function ($a) use ($user) {
            return ($a->id_1 == $user->id) ? $a->id_2 : $a->id_1;
        })->unique()->toArray();

        $excludeIds = array_merge($relatedIds, [$user->id]);

        if (empty($myFriendIds)) {
            $suggestedUsers = Utilisateur::whereNotIn('id', $excludeIds)
                ->withCount(['followers', 'articles'])
                ->limit($perPage * 2) // Fetch a bit more to ensure variety
                ->get();
        } else {
            // Find users who are friends with my friends but NOT friends with me
            $fofIds = Amitie::where(function($q) use ($myFriendIds) {
                    $q->whereIn('id_1', $myFriendIds)->orWhereIn('id_2', $myFriendIds);
                })
                ->where('statut', 'ami')
                ->get()
                ->map(function($f) use ($myFriendIds) {
                    return in_array($f->id_1, $myFriendIds) ? $f->id_2 : $f->id_1;
                })
                ->filter(function($id) use ($excludeIds) {
                    return !in_array($id, $excludeIds);
                })
                ->countBy()
                ->sortByDesc(function($count) { return $count; })
                ->keys()
                ->take(30)
                ->toArray();

            $suggestedUsers = Utilisateur::whereIn('id', $fofIds)
                ->withCount(['followers', 'articles'])
                ->get();
        }

        $suggestions = [];
        foreach ($suggestedUsers as $userData) {
            $suggestions[] = [
                'id'              => $userData->id,
                'nom'             => $userData->nom,
                'prenom'          => $userData->prenom,
                'email'           => $userData->email,
                'image'           => $userData->image ? Storage::url($userData->image) : null,
                'role'            => $userData->role,
                'bio'             => $userData->bio ? mb_substr($userData->bio, 0, 100) : null,
                'location'        => $userData->location,
                'followers_count' => $userData->followers_count,
                'posts_count'     => $userData->articles_count,
                'mutual_friends'  => $this->countMutualFriendsWithList($myFriendIds, $userData->id),
                'is_received_request' => Amitie::where('id_1', $userData->id)
                    ->where('id_2', $user->id)
                    ->where('statut', 'en attente')
                    ->exists(),
            ];
        }

        usort($suggestions, function ($a, $b) {
            return $b['mutual_friends'] <=> $a['mutual_friends'];
        });

        $total   = count($suggestions);
        $offset  = ($page - 1) * $perPage;
        $slice   = array_slice($suggestions, $offset, $perPage);
        $hasMore = ($offset + $perPage) < $total;

        return response()->json([
            'success'     => true,
            'suggestions' => $slice,
            'total'       => $total,
            'page'        => $page,
            'has_more'    => $hasMore
        ]);
    }

    public function getPendingRequests(Request $request)
    {
        $user = Auth::user();
        $perPage = 12;
        $page = max(1, (int) $request->query('page', 1));

        $allPending = [];
        $seenIds = [];
        $friendships = Amitie::where('id_2', $user->id)
            ->where('statut', 'en attente')
            ->with(['utilisateur1' => function($q) { $q->withCount(['followers', 'articles']); }])
            ->get();

        foreach ($friendships as $amitie) {
            $u = $amitie->utilisateur1;
            if (!$u || in_array($u->id, $seenIds)) continue;
            $seenIds[] = $u->id;

            $allPending[] = [
                'id'              => $u->id,
                'nom'             => $u->nom,
                'prenom'          => $u->prenom,
                'email'           => $u->email,
                'image'           => $u->image ? Storage::url($u->image) : null,
                'role'            => $u->role,
                'bio'             => $u->bio ? mb_substr($u->bio, 0, 100) : null,
                'location'        => $u->location,
                'followers_count' => $u->followers_count,
                'posts_count'     => $u->articles_count,
                'request_date'    => $amitie->created_at ?? null
            ];
        }

        $total   = count($allPending);
        $offset  = ($page - 1) * $perPage;
        $slice   = array_slice($allPending, $offset, $perPage);
        $hasMore = ($offset + $perPage) < $total;

        return response()->json([
            'success'          => true,
            'pending_requests' => $slice,
            'total'            => $total,
            'page'             => $page,
            'has_more'         => $hasMore
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
            'page'  => 'nullable|integer'
        ]);

        $user = Auth::user();
        $query = $request->input('query');
        $perPage = 12;
        $page = max(1, (int) $request->query('page', 1));

        $allUsers = Utilisateur::where(function ($q) use ($query) {
                $q->where('nom', 'REGEXP', $query)
                    ->orWhere('prenom', 'REGEXP', $query)
                    ->orWhere('email', 'REGEXP', $query);
            })
            ->withCount(['followers', 'articles'])
            ->select('id', 'nom', 'prenom', 'email', 'image', 'role', 'bio', 'location')
            ->get();

        // Pre-fetch my friends for mutual friends count
        $myFriendIds = Amitie::where(function ($q) use ($user) {
                $q->where('id_1', $user->id)->orWhere('id_2', $user->id);
            })
            ->where('statut', 'ami')
            ->get()
            ->map(function ($f) use ($user) {
                return ($f->id_1 == $user->id) ? $f->id_2 : $f->id_1;
            })
            ->toArray();

        $results = collect();
        $seenIds = [];
        foreach ($allUsers as $userData) {
            if (in_array($userData->id, $seenIds)) continue;
            $seenIds[] = $userData->id;

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

            $hasLikedProfile = \App\Models\ProfileLike::where('id_uti', $user->id)
                ->where('id_uti_profile', $userData->id)
                ->exists();

            $results->push([
                'id'                  => $userData->id,
                'nom'                 => $userData->nom,
                'prenom'              => $userData->prenom,
                'email'               => $userData->email,
                'image'               => $userData->image ? Storage::url($userData->image) : null,
                'role'                => $userData->role,
                'bio'                 => $userData->bio ? mb_substr($userData->bio, 0, 100) : null,
                'location'            => $userData->location,
                'friendship_status'   => $friendship ? $friendship->statut : null,
                'is_friend'           => $friendship && $friendship->statut == 'ami',
                'has_pending_request' => $friendship && $friendship->statut == 'en attente',
                'is_following'        => $isFollowing,
                'has_liked_profile'   => $hasLikedProfile,
                'followers_count'     => $userData->followers_count,
                'posts_count'         => $userData->articles_count,
                'mutual_friends'      => $this->countMutualFriendsWithList($myFriendIds, $userData->id),
                'is_received_request' => $friendship && $friendship->statut == 'en attente' && $friendship->id_2 == $user->id
            ]);
        }

        $total   = $results->count();
        $offset  = ($page - 1) * $perPage;
        $slice   = $results->slice($offset, $perPage)->values();
        $hasMore = ($offset + $perPage) < $total;

        return response()->json([
            'success'  => true,
            'users'    => $slice,
            'total'    => $total,
            'page'     => $page,
            'has_more' => $hasMore
        ]);
    }

    private function countMutualFriendsWithList($myFriendIds, $otherUserId)
    {
        if (empty($myFriendIds)) return 0;

        $otherFriendIds = Amitie::where(function ($query) use ($otherUserId) {
            $query->where('id_1', $otherUserId)
                ->orWhere('id_2', $otherUserId);
        })
            ->where('statut', 'ami')
            ->get()
            ->map(function ($friendship) use ($otherUserId) {
                return ($friendship->id_1 == $otherUserId) ? $friendship->id_2 : $friendship->id_1;
            })
            ->toArray();

        $mutualFriends = array_intersect($myFriendIds, $otherFriendIds);
        return count($mutualFriends);
    }

    public function pendingCount()
    {
        $user = Auth::user();
        $count = Amitie::where('id_2', $user->id)
            ->where('statut', 'en attente')
            ->count();

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }
}
