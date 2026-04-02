<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\GroupeMembre;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GroupController extends Controller
{
    /**
     * Get all groups for the authenticated user.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $groups = $user->groupes()
                ->with(['messages' => function($q) {
                    $q->latest()->limit(1);
                }])
                ->withCount('membres')
                ->get()
                ->map(function($group) {
                    $lastMessage = $group->messages->first();
                    return [
                        'id' => $group->id,
                        'nom' => $group->nom,
                        'description' => $group->description,
                        'image' => $group->image ? Storage::url($group->image) : null,
                        'member_count' => $group->membres_count,
                        'is_locked' => $group->is_locked,
                        'last_message' => $lastMessage ? [
                            'texte' => $lastMessage->texte,
                            'sender' => $lastMessage->utilisateur->prenom ?? 'Système',
                            'date' => $lastMessage->created_at->diffForHumans()
                        ] : null,
                        'role' => $group->pivot->role ?? 'member'
                    ];
                });

            return response()->json([
                'success' => true,
                'groups' => $groups
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching groups: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors du chargement des groupes'], 500);
        }
    }

    /**
     * Create a new group.
     */
    public function store(Request $request)
    {
        $rules = [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ];

        if ($request->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif|max:5120';
        }

        $request->validate($rules);

        try {
            DB::beginTransaction();

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('groups', 'public');
            }

            $group = Groupe::create([
                'nom' => $request->nom,
                'description' => $request->description,
                'image' => $imagePath,
                'id_createur' => Auth::id()
            ]);

            // Add creator as owner
            GroupeMembre::create([
                'groupe_id' => $group->id,
                'utilisateur_id' => Auth::id(),
                'role' => 'owner'
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Groupe créé avec succès',
                'group' => $group
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating group: ' . $e->getMessage());
            return response()->json([
                'success' => false, 
                'message' => 'Erreur lors de la création du groupe: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Show group details and members.
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            $group = Groupe::with(['membres.utilisateur'])->findOrFail($id);

            // Check if user is member
            $membership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$membership) {
                return response()->json(['success' => false, 'message' => 'Accès non autorisé'], 403);
            }

            return response()->json([
                'success' => true,
                'group' => [
                    'id' => $group->id,
                    'nom' => $group->nom,
                    'description' => $group->description,
                    'image' => $group->image ? Storage::url($group->image) : null,
                    'is_locked' => $group->is_locked,
                    'allow_member_invite' => $group->allow_member_invite,
                    'role' => $membership->role,
                    'members' => $group->membres->map(function($m) {
                        return [
                            'id' => $m->utilisateur->id,
                            'nom' => $m->utilisateur->nom,
                            'prenom' => $m->utilisateur->prenom,
                            'image' => $m->utilisateur->image ? Storage::url($m->utilisateur->image) : null,
                            'role' => $m->role,
                            'joined_at' => $m->joined_at
                        ];
                    })
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error showing group: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Groupe non trouvé'], 404);
        }
    }

    /**
     * Invite or add members to the group.
     */
    public function invite(Request $request, $id)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:Utilisateur,id'
        ]);

        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($id);

            // Check if user is member
            $membership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$membership) {
                return response()->json(['success' => false, 'message' => 'Non autorisé'], 403);
            }

            // Check if user can invite (Admin/Owner OR any member if allowed)
            if ($membership->role === 'member' && !$group->allow_member_invite) {
                return response()->json(['success' => false, 'message' => 'Seuls les admins peuvent inviter'], 403);
            }

            $addedCount = 0;
            foreach ($request->user_ids as $targetId) {
                // Check if already member
                if (!$group->membres()->where('utilisateur_id', $targetId)->exists()) {
                    GroupeMembre::create([
                        'groupe_id' => $group->id,
                        'utilisateur_id' => $targetId,
                        'role' => 'member'
                    ]);
                    $addedCount++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "$addedCount membres ajoutés au groupe"
            ]);
        } catch (\Exception $e) {
            Log::error('Error inviting to group: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de l\'invitation'], 500);
        }
    }

    /**
     * Kick a member from the group.
     */
    public function removeMember($id, $userId)
    {
        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($id);

            $adminMembership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$adminMembership || $adminMembership->role === 'member') {
                return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
            }

            $targetMembership = $group->membres()->where('utilisateur_id', $userId)->first();
            if (!$targetMembership) {
                return response()->json(['success' => false, 'message' => 'Utilisateur non trouvé dans le groupe'], 404);
            }

            // Owner can remove anyone. Admin can remove members and other admins BUT NOT owner.
            if ($targetMembership->role === 'owner') {
                return response()->json(['success' => false, 'message' => 'Impossible de retirer le propriétaire'], 403);
            }

            if ($adminMembership->role === 'admin' && $targetMembership->role === 'admin') {
                // Admin can update other admins role/remove? user said "they can remove one another nd others... but not on the owner"
                // So yes, admins can remove each other.
            }

            $targetMembership->delete();

            return response()->json([
                'success' => true,
                'message' => 'Membre retiré du groupe'
            ]);
        } catch (\Exception $e) {
            Log::error('Error removing member: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors du retrait du membre'], 500);
        }
    }

    /**
     * Update member role.
     */
    public function updateRole(Request $request, $id, $userId)
    {
        $request->validate(['role' => 'required|in:admin,member']);

        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($id);

            $adminMembership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$adminMembership || !in_array($adminMembership->role, ['owner', 'admin'])) {
                return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
            }

            $targetMembership = $group->membres()->where('utilisateur_id', $userId)->first();
            if (!$targetMembership || $targetMembership->role === 'owner') {
                return response()->json(['success' => false, 'message' => 'Impossible de modifier ce rôle'], 403);
            }

            $targetMembership->update(['role' => $request->role]);

            return response()->json([
                'success' => true,
                'message' => 'Rôle mis à jour'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating role: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour du rôle'], 500);
        }
    }

    /**
     * Leave the group.
     */
    public function leave($id)
    {
        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($id);
            $membership = $group->membres()->where('utilisateur_id', $user->id)->first();

            if (!$membership) {
                return response()->json(['success' => false, 'message' => 'Vous n\'êtes pas membre de ce groupe'], 404);
            }

            if ($membership->role === 'owner') {
                // If owner leaves, promote someone else
                $nextOwner = $group->membres()
                    ->where('utilisateur_id', '!=', $user->id)
                    ->orderByRaw("FIELD(role, 'admin', 'member')") // Admins first
                    ->orderBy('joined_at', 'asc') // Oldest first
                    ->first();

                if ($nextOwner) {
                    $nextOwner->update(['role' => 'owner']);
                    // Also update group creator_id? Better for consistency
                    $group->update(['id_createur' => $nextOwner->utilisateur_id]);
                } else {
                    // Group is empty? Maybe delete it?
                    $group->delete();
                    return response()->json(['success' => true, 'message' => 'Groupe supprimé car vous étiez le dernier membre']);
                }
            }

            $membership->delete();

            return response()->json([
                'success' => true,
                'message' => 'Vous avez quitté le groupe'
            ]);
        } catch (\Exception $e) {
            Log::error('Error leaving group: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la sortie du groupe'], 500);
        }
    }

    /**
     * Toggle group settings.
     */
    public function toggleSettings(Request $request, $id)
    {
        $request->validate([
            'is_locked' => 'sometimes|boolean',
            'allow_member_invite' => 'sometimes|boolean'
        ]);

        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($id);

            $membership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$membership || !in_array($membership->role, ['owner', 'admin'])) {
                return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
            }

            $update = [];
            if ($request->has('is_locked')) $update['is_locked'] = $request->is_locked;
            if ($request->has('allow_member_invite')) $update['allow_member_invite'] = $request->allow_member_invite;

            $group->update($update);

            return response()->json([
                'success' => true,
                'message' => 'Paramètres mis à jour'
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating settings: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour des paramètres'], 500);
        }
    }
}
