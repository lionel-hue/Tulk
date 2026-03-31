<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MessageController extends Controller
{
    /**
     * Get list of conversations for the authenticated user.
     */
    public function getConversations()
    {
        try {
            $user = Auth::user();

            // Get all unique users the current user has chatted with
            $userIds = Message::where('id_uti_1', $user->id)
                ->orWhere('id_uti_2', $user->id)
                ->get()
                ->map(function ($message) use ($user) {
                    return $message->id_uti_1 == $user->id ? $message->id_uti_2 : $message->id_uti_1;
                })
                ->unique()
                ->values();

            $conversations = [];
            foreach ($userIds as $otherUserId) {
                $otherUser = Utilisateur::select('id', 'nom', 'prenom', 'image', 'email')
                    ->find($otherUserId);

                if (!$otherUser) continue;

                // Get last message in this conversation
                $lastMessage = Message::where(function ($q) use ($user, $otherUserId) {
                    $q->where('id_uti_1', $user->id)->where('id_uti_2', $otherUserId);
                })->orWhere(function ($q) use ($user, $otherUserId) {
                    $q->where('id_uti_1', $otherUserId)->where('id_uti_2', $user->id);
                })->orderBy('date', 'desc')->first();

                $conversations[] = [
                    'user' => $otherUser,
                    'last_message' => $lastMessage,
                    'unread_count' => 0 // Placeholder as we don't have is_read yet
                ];
            }

            // Sort conversations by last message date
            usort($conversations, function ($a, $b) {
                return ($b['last_message']->date ?? '') <=> ($a['last_message']->date ?? '');
            });

            return response()->json([
                'success' => true,
                'conversations' => $conversations,
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
            })->orderBy('date', 'asc')->get();

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
