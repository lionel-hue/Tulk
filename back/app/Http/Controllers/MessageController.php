<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Utilisateur;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MessageController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get list of conversations for the authenticated user.
     */
    public function getConversations(Request $request)
    {
        try {
            $user = Auth::user();
            $perPage = 20;

            // Get all unique users the current user has chatted with, ordered by last message
            $subquery = Message::where('id_uti_1', $user->id)
                ->orWhere('id_uti_2', $user->id)
                ->select(DB::raw('CASE WHEN id_uti_1 = ' . $user->id . ' THEN id_uti_2 ELSE id_uti_1 END as other_user_id'), DB::raw('MAX(date) as last_message_date'))
                ->groupBy('other_user_id')
                ->orderBy('last_message_date', 'desc');

            $paginatedUserIds = DB::table(DB::raw("({$subquery->toSql()}) as sub"))
                ->mergeBindings($subquery->getQuery())
                ->paginate($perPage);

            $conversations = [];
            foreach ($paginatedUserIds->items() as $row) {
                $otherUserId = $row->other_user_id;
                $otherUser = Utilisateur::select('id', 'nom', 'prenom', 'image', 'email')
                    ->find($otherUserId);

                if (!$otherUser) continue;

                // Get last message in this conversation
                $lastMessage = Message::where(function ($q) use ($user, $otherUserId) {
                    $q->where('id_uti_1', $user->id)->where('id_uti_2', $otherUserId);
                })->orWhere(function ($q) use ($user, $otherUserId) {
                    $q->where('id_uti_1', $otherUserId)->where('id_uti_2', $user->id);
                })->orderBy('date', 'desc')->first();

                // Get unread count for this specific conversation
                $unreadCount = Message::where('id_uti_1', $otherUserId)
                    ->where('id_uti_2', $user->id)
                    ->where('is_read', false)
                    ->count();

                if ($otherUser && $otherUser->image) {
                    $otherUser->image = Storage::url($otherUser->image);
                }

                $conversations[] = [
                    'user' => $otherUser,
                    'last_message' => $lastMessage,
                    'unread_count' => $unreadCount
                ];
            }

            return response()->json([
                'success' => true,
                'conversations' => $conversations,
                'pagination' => [
                    'current_page' => $paginatedUserIds->currentPage(),
                    'last_page' => $paginatedUserIds->lastPage(),
                    'has_more' => $paginatedUserIds->hasMorePages()
                ],
                'unread_total' => Message::where('id_uti_2', $user->id)->where('is_read', false)->count()
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching conversations: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des conversations'
            ], 500);
        }
    }

    /**
     * Get message history between auth user and another user.
     */
    public function getMessages($otherUserId)
    {
        try {
            $user = Auth::user();
            
            $messages = Message::where(function ($q) use ($user, $otherUserId) {
                $q->where('id_uti_1', $user->id)->where('id_uti_2', $otherUserId);
            })->orWhere(function ($q) use ($user, $otherUserId) {
                $q->where('id_uti_1', $otherUserId)->where('id_uti_2', $user->id);
            })->orderBy('date', 'desc')->paginate(30);

            // Mark as read
            Message::where('id_uti_1', $otherUserId)
                ->where('id_uti_2', $user->id)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'messages' => $messages
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching messages: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des messages'
            ], 500);
        }
    }

    /**
     * Send a new message.
     */
    public function sendMessage(Request $request)
    {
        try {
            $request->validate([
                'receiver_id' => 'required|exists:Utilisateur,id',
                'texte' => 'required_without:image|string',
                'image' => 'nullable|image|max:5120' // 5MB max
            ]);

            $user = Auth::user();
            $receiverId = $request->input('receiver_id');
            $messageText = $request->input('texte', '');
            
            $imagePath = null;
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('storage/images/messages'), $filename);
                $imagePath = 'images/messages/' . $filename;
            }

            $message = Message::create([
                'date' => now(),
                'texte' => $messageText,
                'image' => $imagePath,
                'id_uti_1' => $user->id,
                'id_uti_2' => $receiverId
            ]);

            // Send notification
            $receiver = Utilisateur::find($receiverId);
            if ($receiver) {
                $this->notificationService->sendMessageNotification($receiver, $user, $messageText);
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            Log::error('Error sending message: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'envoi du message'
            ], 500);
        }
    }
    /**
     * Get unread messages count for the authenticated user.
     */
    public function unreadCount()
    {
        try {
            $user = Auth::user();
            $count = Message::where('id_uti_2', $user->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'count' => $count
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du comptage des messages'
            ], 500);
        }
    }
}
