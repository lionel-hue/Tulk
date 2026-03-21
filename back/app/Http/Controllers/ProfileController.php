<?php
// back/app/Http/Controllers/PostController.php
namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Liker;
use App\Models\Commentaire;
use App\Models\Amitie;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Services\NotificationService;
use Illuminate\Support\Str;

class PostController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    // Create a new post
    public function createPost(Request $request)
    {
        try {
            $request->validate([
                'description' => 'required|string|max:1000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);

            $user = Auth::user();
            $imagePath = null;

            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    $path = $image->store('images', 'public');
                    $imagePath = $path;

                    if (!Storage::disk('public')->exists($imagePath)) {
                        throw new \Exception('Image was not saved to disk');
                    }
                } catch (\Exception $e) {
                    Log::error('❌ Image upload failed: ' . $e->getMessage());
                    return response()->json([
                        'success' => false,
                        'message' => 'Erreur lors du téléchargement de l\'image: ' . $e->getMessage()
                    ], 500);
                }
            }

            $post = Article::create([
                'description' => $request->description,
                'image' => $imagePath,
                'id_uti' => $user->id,
                'date' => now(),
            ]);

            $post->load('utilisateur');

            // Check if this is user's first post and send celebration notification
            $postCount = Article::where('id_uti', $user->id)->count();
            if ($postCount === 1) {
                $this->notificationService->sendFirstPostNotification($user, $post, false);
            }

            // Check for mentions in post description and notify mentioned users
            $this->handlePostMentions($post, $user);

            return response()->json([
                'success' => true,
                'message' => 'Post créé avec succès',
                'post' => [
                    'id' => $post->id,
                    'description' => $post->description,
                    'image' => $post->image ? Storage::url($post->image) : null,
                    'date' => $post->date,
                    'user' => [
                        'id' => $post->utilisateur->id,
                        'nom' => $post->utilisateur->nom,
                        'prenom' => $post->utilisateur->prenom,
                        'image' => $post->utilisateur->image ? Storage::url($post->utilisateur->image) : null,
                    ],
                    'likes_count' => 0,
                    'comments_count' => 0,
                    'is_liked' => false,
                    'is_owner' => true,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error creating post: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du post: ' . $e->getMessage()
            ], 500);
        }
    }

    // Like/unlike a post
    public function toggleLike($postId)
    {
        try {
            $user = Auth::user();
            $post = Article::findOrFail($postId);
            $postOwner = Utilisateur::find($post->id_uti);

            // Check if user already liked the post
            $existingLike = Liker::where('id_uti', $user->id)
                ->where('id_arti', $postId)
                ->first();

            if ($existingLike) {
                // Unlike the post
                $existingLike->delete();
                $liked = false;
            } else {
                // Like the post
                Liker::create([
                    'id_uti' => $user->id,
                    'id_arti' => $postId,
                ]);
                $liked = true;

                // Send notification to post owner
                if ($postOwner && $postOwner->id !== $user->id) {
                    $this->notificationService->sendLikeNotification(
                        $postOwner,
                        $user,
                        $post,
                        false // Don't send email for every like
                    );
                }
            }

            // Get updated like count
            $likesCount = $post->likes()->count();

            return response()->json([
                'success' => true,
                'liked' => $liked,
                'likes_count' => $likesCount
            ]);
        } catch (\Exception $e) {
            Log::error('Error toggling like: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du like: ' . $e->getMessage()
            ], 500);
        }
    }

    // Add a comment to a post
    public function addComment(Request $request, $postId)
    {
        try {
            $request->validate([
                'texte' => 'required|string|max:500',
                'parent_comment_id' => 'nullable|integer|exists:Commentaire,id'
            ]);

            $user = Auth::user();
            $post = Article::findOrFail($postId);
            $postOwner = Utilisateur::find($post->id_uti);

            $comment = Commentaire::create([
                'texte' => $request->texte,
                'date' => now(),
                'id_arti' => $postId,
                'id_uti' => $user->id,
            ]);

            $comment->load('utilisateur');

            // Get updated comments count
            $commentsCount = $post->commentaires()->count();

            // Send notification to post owner
            if ($postOwner && $postOwner->id !== $user->id) {
                $this->notificationService->sendCommentNotification(
                    $postOwner,
                    $user,
                    $post,
                    $comment,
                    true // Send email for comments
                );
            }

            // If this is a reply to another comment, notify the original commenter
            if ($request->parent_comment_id) {
                $parentComment = Commentaire::find($request->parent_comment_id);
                if ($parentComment && $parentComment->id_uti !== $user->id) {
                    $originalCommenter = Utilisateur::find($parentComment->id_uti);
                    if ($originalCommenter) {
                        $this->notificationService->sendCommentReplyNotification(
                            $originalCommenter,
                            $user,
                            $post,
                            $comment,
                            $parentComment,
                            true
                        );
                    }
                }
            }

            // Check for mentions in comment and notify mentioned users
            $this->handleCommentMentions($comment, $post, $user);

            return response()->json([
                'success' => true,
                'message' => 'Commentaire ajouté avec succès',
                'comment' => [
                    'id' => $comment->id,
                    'texte' => $comment->texte,
                    'date' => $comment->date,
                    'user' => [
                        'id' => $comment->utilisateur->id,
                        'nom' => $comment->utilisateur->nom,
                        'prenom' => $comment->utilisateur->prenom,
                        'image' => $comment->utilisateur->image ? Storage::url($comment->utilisateur->image) : null,
                    ]
                ],
                'comments_count' => $commentsCount
            ]);
        } catch (\Exception $e) {
            Log::error('Error adding comment: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout du commentaire: ' . $e->getMessage()
            ], 500);
        }
    }

    // Handle mentions in post
    private function handlePostMentions(Article $post, Utilisateur $author)
    {
        $description = $post->description;

        // Find all @mentions in the post
        if (preg_match_all('/@(\w+)/', $description, $matches)) {
            $usernames = $matches[1];

            foreach ($usernames as $username) {
                // Try to find user by email or name (simplified - adjust based on your username system)
                $mentionedUser = Utilisateur::where('email', 'LIKE', $username . '%')
                    ->orWhere('prenom', 'LIKE', $username . '%')
                    ->first();

                if ($mentionedUser && $mentionedUser->id !== $author->id) {
                    $this->notificationService->sendMentionInPostNotification(
                        $mentionedUser,
                        $author,
                        $post,
                        $description
                    );
                }
            }
        }
    }

    // Handle mentions in comment
    private function handleCommentMentions(Commentaire $comment, Article $post, Utilisateur $author)
    {
        $texte = $comment->texte;

        // Find all @mentions in the comment
        if (preg_match_all('/@(\w+)/', $texte, $matches)) {
            $usernames = $matches[1];

            foreach ($usernames as $username) {
                $mentionedUser = Utilisateur::where('email', 'LIKE', $username . '%')
                    ->orWhere('prenom', 'LIKE', $username . '%')
                    ->first();

                if ($mentionedUser && $mentionedUser->id !== $author->id) {
                    $this->notificationService->sendMentionInCommentNotification(
                        $mentionedUser,
                        $author,
                        $post,
                        $comment,
                        $texte
                    );
                }
            }
        }
    }

    // Get posts for feed
    public function getFeedPosts()
    {
        try {
            $user = Auth::user();
            $friendIds = $this->getFriendIds($user->id);
            $userIds = array_merge([$user->id], $friendIds);

            $posts = Article::with(['utilisateur', 'likes', 'commentaires'])
                ->whereIn('id_uti', $userIds)
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($post) use ($user) {
                    return [
                        'id' => $post->id,
                        'description' => $post->description,
                        'image' => $post->image ? Storage::url($post->image) : null,
                        'date' => $post->date,
                        'user' => [
                            'id' => $post->utilisateur->id,
                            'nom' => $post->utilisateur->nom,
                            'prenom' => $post->utilisateur->prenom,
                            'image' => $post->utilisateur->image ? Storage::url($post->utilisateur->image) : null,
                        ],
                        'likes_count' => $post->likes()->count(),
                        'comments_count' => $post->commentaires()->count(),
                        'is_liked' => $post->likes()->where('id_uti', $user->id)->exists(),
                        'is_owner' => $post->id_uti == $user->id,
                    ];
                });

            return response()->json([
                'success' => true,
                'posts' => $posts
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading posts: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des posts: ' . $e->getMessage()
            ], 500);
        }
    }

    // Get comments for a post
    public function getComments($postId)
    {
        try {
            $post = Article::findOrFail($postId);
            $comments = $post->commentaires()
                ->with('utilisateur')
                ->orderBy('date', 'asc')
                ->get()
                ->map(function ($comment) {
                    return [
                        'id' => $comment->id,
                        'texte' => $comment->texte,
                        'date' => $comment->date,
                        'user' => [
                            'id' => $comment->utilisateur->id,
                            'nom' => $comment->utilisateur->nom,
                            'prenom' => $comment->utilisateur->prenom,
                            'image' => $comment->utilisateur->image ? Storage::url($comment->utilisateur->image) : null,
                        ]
                    ];
                });

            return response()->json([
                'success' => true,
                'comments' => $comments
            ]);
        } catch (\Exception $e) {
            Log::error('Error getting comments: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des commentaires: ' . $e->getMessage()
            ], 500);
        }
    }

    // Delete a post
    public function deletePost($postId)
    {
        try {
            $user = Auth::user();
            $post = Article::findOrFail($postId);

            if ($post->id_uti !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas la permission de supprimer ce post'
                ], 403);
            }

            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }

            $post->likes()->delete();
            $post->commentaires()->delete();
            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting post: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du post: ' . $e->getMessage()
            ], 500);
        }
    }

    // Helper function to get friend IDs
    private function getFriendIds($userId)
    {
        try {
            $friendships = Amitie::where(function ($query) use ($userId) {
                $query->where('id_1', $userId)
                    ->orWhere('id_2', $userId);
            })->where('statut', 'ami')->get();

            $friendIds = [];
            foreach ($friendships as $friendship) {
                if ($friendship->id_1 == $userId) {
                    $friendIds[] = $friendship->id_2;
                } else {
                    $friendIds[] = $friendship->id_1;
                }
            }
            return $friendIds;
        } catch (\Exception $e) {
            return [];
        }
    }
}
