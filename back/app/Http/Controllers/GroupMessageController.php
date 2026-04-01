<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\GroupeMessage;
use App\Models\GroupeMembre;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class GroupMessageController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get paginated messages for a group.
     */
    public function index($groupId)
    {
        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($groupId);

            // Check membership
            if (!$group->membres()->where('utilisateur_id', $user->id)->exists()) {
                return response()->json(['success' => false, 'message' => 'Non membre'], 403);
            }

            $perPage = 20;
            $messages = $group->messages()
                ->with('utilisateur')
                ->latest()
                ->paginate($perPage);

            return response()->json([
                'success' => true,
                'messages' => [
                    'data' => $messages->items(),
                    'current_page' => $messages->currentPage(),
                    'has_more' => $messages->hasMorePages(),
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching group messages: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors du chargement des messages'], 500);
        }
    }

    /**
     * Send a message to the group.
     */
    public function store(Request $request, $groupId)
    {
        $request->validate([
            'texte' => 'nullable|string|max:2000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if (!$request->texte && !$request->hasFile('image')) {
            return response()->json(['success' => false, 'message' => 'Le message ne peut pas être vide'], 400);
        }

        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($groupId);

            $membership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$membership) {
                return response()->json(['success' => false, 'message' => 'Non membre'], 403);
            }

            // Check if group is locked (only admins can send)
            if ($group->is_locked && $membership->role === 'member') {
                return response()->json(['success' => false, 'message' => 'Le groupe est temporairement fermé par un administrateur'], 403);
            }

            $imagePath = null;
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('group_messages', 'public');
            }

            $message = GroupeMessage::create([
                'groupe_id' => $group->id,
                'utilisateur_id' => $user->id,
                'texte' => $request->texte,
                'image' => $imagePath
            ]);

            // Return with sender info
            $message->load('utilisateur');

            // Notify members
            $members = $group->members()->get();
            foreach ($members as $member) {
                if ($member->id !== $user->id) {
                    $this->notificationService->sendGroupMessageNotification($member, $user, $group, $request->texte ?? '');
                }
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending group message: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de l\'envoi du message'], 500);
        }
    }

    /**
     * Delete a message.
     */
    public function destroy($groupId, $messageId)
    {
        try {
            $user = Auth::user();
            $group = Groupe::findOrFail($groupId);
            $message = GroupeMessage::findOrFail($messageId);

            if ($message->groupe_id != $group->id) {
                return response()->json(['success' => false, 'message' => 'Message non trouvé dans ce groupe'], 404);
            }

            $membership = $group->membres()->where('utilisateur_id', $user->id)->first();
            if (!$membership) {
                return response()->json(['success' => false, 'message' => 'Non membre'], 403);
            }

            // Check permission: Sender OR Admin/Owner
            if ($message->utilisateur_id != $user->id && !in_array($membership->role, ['owner', 'admin'])) {
                return response()->json(['success' => false, 'message' => 'Action non autorisée'], 403);
            }

            if ($message->image) {
                Storage::disk('public')->delete($message->image);
            }

            $message->delete();

            return response()->json([
                'success' => true,
                'message' => 'Message supprimé'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting group message: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la suppression'], 500);
        }
    }
}
