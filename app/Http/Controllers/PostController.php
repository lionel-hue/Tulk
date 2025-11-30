<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Amitie;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    // Get posts for feed (user's posts + friends' posts)
    public function getFeedPosts()
    {
        try {
            $user = Auth::user();
            
            // Get user's friend IDs
            $friendIds = $this->getFriendIds($user->id);
            
            // Include user's own ID to see their posts too
            $userIds = array_merge([$user->id], $friendIds);
            
            // Get posts with user information
            $posts = Article::with('utilisateur')
                ->whereIn('id_uti', $userIds)
                ->orderBy('date', 'desc')
                ->get()
                ->map(function ($post) {
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
                        'likes_count' => 0, // Temporary fix until Liker table is populated
                        'comments_count' => 0, // Temporary fix until Commentaire table is populated
                    ];
                });
            
            return response()->json([
                'success' => true,
                'posts' => $posts
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error loading posts: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des posts: ' . $e->getMessage()
            ], 500);
        }
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
                $image = $request->file('image');
                $imageName = \Illuminate\Support\Str::random(20) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('images', $imageName, 'public');
            }

            $post = Article::create([
                'description' => $request->description,
                'image' => $imagePath,
                'id_uti' => $user->id,
                'date' => now(),
            ]);

            // Load user relationship for the response
            $post->load('utilisateur');

            return response()->json([
                'success' => true,
                'message' => 'Post créé avec succès',
                'post' => [
                    'id' => $post->id,
                    'description' => $post->description,
                    'image' => $post->image ? \Illuminate\Support\Facades\Storage::url($post->image) : null,
                    'date' => $post->date,
                    'user' => [
                        'id' => $post->utilisateur->id,
                        'nom' => $post->utilisateur->nom,
                        'prenom' => $post->utilisateur->prenom,
                        'image' => $post->utilisateur->image ? \Illuminate\Support\Facades\Storage::url($post->utilisateur->image) : null,
                    ],
                    'likes_count' => 0,
                    'comments_count' => 0,
                ]
            ]);

        } catch (\Exception $e) {
            \Log::error('Error creating post: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du post: ' . $e->getMessage()
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