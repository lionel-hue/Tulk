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
        $type = $request->get('type', null);
        $priority = $request->get('priority', null);

        $notifications = $this->notificationService->getUserNotifications(
            $user->id,
            $limit,
            $unreadOnly,
            $type,
            $priority
        );

        $unreadCount = $this->notificationService->getUnreadCount($user->id);

        return response()->json([
            'success' => true,
            'notifications' => $notifications->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'subtype' => $notification->subtype,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'is_read' => $notification->is_read,
                    'email_sent' => $notification->email_sent,
                    'priority' => $notification->priority,
                    'channel' => $notification->channel,
                    'created_at' => $notification->created_at->diffForHumans(),
                    'created_at_full' => $notification->created_at->toDateTimeString(),
                    'icon' => $notification->icon,
                    'color' => $notification->color,
                    'badge_color' => $notification->badge_color,
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
        $success = $this->notificationService->markAsRead($user->id, $id);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

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
        $success = $this->notificationService->deleteNotification($user->id, $id);

        if (!$success) {
            return response()->json([
                'success' => false,
                'message' => 'Notification non trouvée'
            ], 404);
        }

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

        // Clear cache
        \Illuminate\Support\Facades\Cache::forget('notification_count_' . $user->id);

        return response()->json([
            'success' => true,
            'message' => "{$count} notifications supprimées",
            'count' => $count,
        ]);
    }

    /**
     * Get notification statistics
     */
    public function stats()
    {
        $user = Auth::user();
        $days = request()->get('days', 30);
        $stats = $this->notificationService->getNotificationStats($user->id, $days);

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }
}
