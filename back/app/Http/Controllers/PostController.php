<?php
// app/Http/Controllers/PostController.php
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
use Illuminate\Support\Str;

class PostController extends Controller
{
    // Create a new post - SIMPLE AND WORKING VERSION
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
                    
                    // Generate a unique filename
                    $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                    
                    // Store the image in storage/app/public/images
                    // Using store() with 'public' disk
                    $path = $image->store('images', 'public');
                    
                    // $path will be something like 'images/filename.jpg'
                    $imagePath = $path;
                    
                    Log::info('✅ Image saved successfully to: ' . $imagePath);
                    Log::info('📁 Full storage path: ' . storage_path('app/public/' . $imagePath));
                    Log::info('🌐 Public URL: ' . Storage::url($imagePath));
                    
                    // Verify the file was saved
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
                'image' => $imagePath, // This will be 'images/filename.jpg' or null
                'id_uti' => $user->id,
                'date' => now(),
            ]);

            $post->load('utilisateur');

            return response()->json([
                'success' => true,
                'message' => 'Post créé avec succès',
                'post' => [
                    'id' => $post->id,
                    'description' => $post->description,
                    'image' => $post->image,
                    'date' => $post->date,
                    'user' => [
                        'id' => $post->utilisateur->id,
                        'nom' => $post->utilisateur->nom,
                        'prenom' => $post->utilisateur->prenom,
                        'image' => $post->utilisateur->image,
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

    // Get posts for feed
    public function getFeedPosts()
    {
        try {
            $user = Auth::user();
            
            // Get user's friend IDs
            $friendIds = $this->getFriendIds($user->id);
            
            // Include user's own ID to see their posts too
            $userIds = array_merge([$user->id], $friendIds);
            
            // Get posts with user information, likes count, and comments count
            $posts = Article::with(['utilisateur', 'likes', 'commentaires'])
                ->whereIn('id_uti', $userIds)
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($post) use ($user) {
                    return [
                        'id' => $post->id,
                        'description' => $post->description,
                        'image' => $post->image,
                        'date' => $post->date,
                        'user' => [
                            'id' => $post->utilisateur->id,
                            'nom' => $post->utilisateur->nom,
                            'prenom' => $post->utilisateur->prenom,
                            'image' => $post->utilisateur->image,
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

    // Like/unlike a post
    public function toggleLike($postId)
    {
        try {
            $user = Auth::user();
            $post = Article::findOrFail($postId);

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
                            'image' => $comment->utilisateur->image,
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

    // Add a comment to a post
    public function addComment(Request $request, $postId)
    {
        try {
            $request->validate([
                'texte' => 'required|string|max:500',
            ]);

            $user = Auth::user();
            $post = Article::findOrFail($postId);

            $comment = Commentaire::create([
                'texte' => $request->texte,
                'date' => now(),
                'id_arti' => $postId,
                'id_uti' => $user->id,
            ]);

            // Load user relationship
            $comment->load('utilisateur');

            // Get updated comments count
            $commentsCount = $post->commentaires()->count();

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
                        'image' => $comment->utilisateur->image,
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

    // Delete a post (only if owner)
    public function deletePost($postId)
    {
        try {
            $user = Auth::user();
            $post = Article::findOrFail($postId);

            // Check if user is the owner of the post
            if ($post->id_uti !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vous n\'avez pas la permission de supprimer ce post'
                ], 403);
            }

            // Delete post image if exists
            if ($post->image && Storage::disk('public')->exists($post->image)) {
                Storage::disk('public')->delete($post->image);
            }

            // Delete associated likes and comments
            $post->likes()->delete();
            $post->commentaires()->delete();

            // Delete the post
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
            // If Amitie table doesn't exist or has issues, return empty array
            return [];
        }
    }
}