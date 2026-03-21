<?php
// back/app/Http/Controllers/NotificationController.php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all notifications for authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $limit = $request->get('limit', 20);
        $unreadOnly = $request->get('unread_only', false);

        $notifications = $this->notificationService->getUserNotifications(
            $user->id,
            $limit,
            $unreadOnly
        );

        $unreadCount = $this->notificationService->getUnreadCount($user->id);

        return response()->json([
            'success' => true,
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'is_read' => $notification->is_read,
                    'email_sent' => $notification->email_sent,
                    'created_at' => $notification->created_at->diffForHumans(),
                    'created_at_full' => $notification->created_at->toDateTimeString(),
                    'icon' => $notification->icon,
                    'color' => $notification->color,
                    'sender' => $notification->utilisateurFrom ? [
                        'id' => $notification->utilisateurFrom->id,
                        'nom' => $notification->utilisateurFrom->nom,
                        'prenom' => $notification->utilisateurFrom->prenom,
                        'image' => $notification->utilisateurFrom->image,
                    ] : null,
                    'related_id' => $notification->related_id,
                    'related_type' => $notification->related_type,
                    'data' => $notification->data,
                ];
            }),
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Get unread count
     */
    public function unreadCount()
    {
        $user = Auth::user();
        $count = $this->notificationService->getUnreadCount($user->id);

        return response()->json([
            'success' => true,
            'count' => $count,
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = Notification::where('id', $id)
            ->where('id_uti', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'message' => 'Notification marquée comme lue',
        ]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        $count = $this->notificationService->markAllAsRead($user->id);

        return response()->json([
            'success' => true,
            'message' => "{$count} notifications marquées comme lues",
            'count' => $count,
        ]);
    }

    /**
     * Delete a notification
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $notification = Notification::where('id', $id)
            ->where('id_uti', $user->id)
            ->first();

        if (!$notification) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification supprimée',
        ]);
    }

    /**
     * Delete all notifications
     */
    public function deleteAll()
    {
        $user = Auth::user();
        $count = Notification::where('id_uti', $user->id)->delete();

        return response()->json([
            'success' => true,
            'message' => "{$count} notifications supprimées",
            'count' => $count,
        ]);
    }

    /**
     * Delete old notifications
     */
    public function deleteOld(Request $request)
    {
        $user = Auth::user();
        $days = $request->get('days', 30);
        $count = $this->notificationService->deleteOldNotifications($user->id, $days);

        return response()->json([
            'success' => true,
            'message' => "{$count} anciennes notifications supprimées",
            'count' => $count,
        ]);
    }
}
