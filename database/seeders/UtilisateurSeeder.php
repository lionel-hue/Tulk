<?php

namespace Database\Seeders;

use App\Models\Utilisateur;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UtilisateurSeeder extends Seeder
{
    public function run(): void
    {
        Utilisateur::create([
            'nom' => 'Dupont',
            'prenom' => 'Jean',
            'email' => 'jean@tulk.com',
            'mdp' => Hash::make('password123'),
            'role' => 'user',
            'sexe' => 'M'
        ]);

        Utilisateur::create([
            'nom' => 'Admin',
            'prenom' => 'System',
            'email' => 'admin@tulk.com', 
            'mdp' => Hash::make('admin123'),
            'role' => 'admin',
            'sexe' => 'M'
        ]);
    }
}