<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SocialSeeder  —  Full social graph for Tulk
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  USER MAP
 *  --------
 *  ID  1  → Lionel Sisso          (YOU — sissolionel@gmail.com / sisso2026)
 *  ID  2  → Kemi Adeyemi          (Lagos)
 *  ID  3  → Chidi Okonkwo         (Abuja)
 *  ID  4  → Amara Diallo          (Dakar)
 *  ID  5  → Fatou Ndiaye          (Dakar)
 *  ID  6  → Kwame Mensah          (Accra)
 *  ID  7  → Ngozi Eze             (Enugu)
 *  ID  8  → Bayo Ogundimu         (Lagos)
 *  ID  9  → Aisha Bello           (Kano)
 *  ID 10  → Tunde Adebayo         (Ibadan)
 *  ID 11  → Emeka Nwosu           (Port Harcourt)
 *  ID 12  → Zainab Usman          (Abuja)    ← friend of Chidi+Aisha, NOT yours
 *  ID 13  → Sola Adesanya         (Lagos)    ← friend of Kemi+Bayo,  NOT yours
 *  ID 14  → Ifeanyi Obi           (Enugu)    ← friend of Ngozi+Emeka, NOT yours
 *
 *  FRIENDSHIP GRAPH  (ami = confirmed both directions stored)
 *  ----------------------------------------------------------
 *  Lionel ↔ 2,3,4,5,6,7,8,9,10,11
 *  Kemi(2) ↔ Bayo(8), Tunde(10), Sola(13)
 *  Chidi(3) ↔ Emeka(11), Aisha(9), Zainab(12)
 *  Amara(4) ↔ Fatou(5)
 *  Kwame(6) ↔ Ngozi(7)
 *  Bayo(8) ↔ Tunde(10), Sola(13)
 *  Ngozi(7) ↔ Emeka(11), Ifeanyi(14)
 *  Aisha(9) ↔ Zainab(12)
 *  Emeka(11) ↔ Ifeanyi(14)
 *
 *  "en attente" (pending, one-way):
 *  Fatou(5)→Kwame(6),  Tunde(10)→Amara(4),  Ifeanyi(14)→Bayo(8)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
class SocialSeeder extends Seeder
{
    public function run(): void
    {
        // ── 0. Wipe everything ────────────────────────────────────────────────
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('Follow')->truncate();
        DB::table('ProfileLike')->truncate();
        DB::table('Notification')->truncate();
        DB::table('Liker')->truncate();
        DB::table('Commentaire')->truncate();
        DB::table('Article')->truncate();
        DB::table('Amitie')->truncate();
        DB::table('Message')->truncate();
        DB::table('personal_access_tokens')->truncate();
        DB::table('Utilisateur')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // ── 1. Users ──────────────────────────────────────────────────────────
        $now = Carbon::now();

        $users = [
            // ── Main account ──────────────────────────────────────────────────
            [
                'id'         => 1,
                'nom'        => 'Sisso',
                'prenom'     => 'Lionel',
                'role'       => 'user',
                'image'      => 'images/avatars/lionel.jpg',
                'bio'        => 'Software dev 🚀 | Building Tulk from Lagos | Coffee addict ☕',
                'location'   => 'Lagos, Nigeria',
                'website'    => 'https://github.com/lionelsisso',
                'banner'     => 'images/banners/lionel_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('sisso2026'),
                'email'      => 'sissolionel@gmail.com',
                'created_at' => $now->copy()->subMonths(6),
            ],
            // ── 10 direct friends ─────────────────────────────────────────────
            [
                'id'         => 2,
                'nom'        => 'Adeyemi',
                'prenom'     => 'Kemi',
                'role'       => 'user',
                'image'      => 'images/avatars/kemi.jpg',
                'bio'        => 'Fashion designer 👗 | Afrobeats lover | Lagos Island girl 💛',
                'location'   => 'Lagos, Nigeria',
                'website'    => 'https://kemistyle.ng',
                'banner'     => 'images/banners/kemi_banner.jpg',
                'sexe'       => 'F',
                'mdp'        => Hash::make('password123'),
                'email'      => 'kemi.adeyemi@gmail.com',
                'created_at' => $now->copy()->subMonths(5),
            ],
            [
                'id'         => 3,
                'nom'        => 'Okonkwo',
                'prenom'     => 'Chidi',
                'role'       => 'user',
                'image'      => 'images/avatars/chidi.jpg',
                'bio'        => 'Tech bro in Abuja 💻 | Fintech | Chelsea FC 🔵',
                'location'   => 'Abuja, Nigeria',
                'website'    => null,
                'banner'     => 'images/banners/chidi_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'chidi.okonkwo@gmail.com',
                'created_at' => $now->copy()->subMonths(5),
            ],
            [
                'id'         => 4,
                'nom'        => 'Diallo',
                'prenom'     => 'Amara',
                'role'       => 'user',
                'image'      => 'images/avatars/amara.jpg',
                'bio'        => 'Artiste sénégalaise 🎨 | Dakar vibes | Proud African 🌍',
                'location'   => 'Dakar, Senegal',
                'website'    => 'https://amaradiallo.art',
                'banner'     => 'images/banners/amara_banner.jpg',
                'sexe'       => 'F',
                'mdp'        => Hash::make('password123'),
                'email'      => 'amara.diallo@gmail.com',
                'created_at' => $now->copy()->subMonths(4),
            ],
            [
                'id'         => 5,
                'nom'        => 'Ndiaye',
                'prenom'     => 'Fatou',
                'role'       => 'user',
                'image'      => 'images/avatars/fatou.jpg',
                'bio'        => 'Journaliste | Féministe | Dakar 🇸🇳 | Words matter ✍️',
                'location'   => 'Dakar, Senegal',
                'website'    => null,
                'banner'     => 'images/banners/fatou_banner.jpg',
                'sexe'       => 'F',
                'mdp'        => Hash::make('password123'),
                'email'      => 'fatou.ndiaye@gmail.com',
                'created_at' => $now->copy()->subMonths(4),
            ],
            [
                'id'         => 6,
                'nom'        => 'Mensah',
                'prenom'     => 'Kwame',
                'role'       => 'user',
                'image'      => 'images/avatars/kwame.jpg',
                'bio'        => 'Entrepreneur 🇬🇭 | Accra hustler | Pan-Africanist 🌍',
                'location'   => 'Accra, Ghana',
                'website'    => 'https://kwamemensah.com',
                'banner'     => 'images/banners/kwame_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'kwame.mensah@gmail.com',
                'created_at' => $now->copy()->subMonths(3),
            ],
            [
                'id'         => 7,
                'nom'        => 'Eze',
                'prenom'     => 'Ngozi',
                'role'       => 'user',
                'image'      => 'images/avatars/ngozi.jpg',
                'bio'        => 'Doctor 👩‍⚕️ | Health advocate | Enugu proud | God first 🙏',
                'location'   => 'Enugu, Nigeria',
                'website'    => null,
                'banner'     => 'images/banners/ngozi_banner.jpg',
                'sexe'       => 'F',
                'mdp'        => Hash::make('password123'),
                'email'      => 'ngozi.eze@gmail.com',
                'created_at' => $now->copy()->subMonths(3),
            ],
            [
                'id'         => 8,
                'nom'        => 'Ogundimu',
                'prenom'     => 'Bayo',
                'role'       => 'user',
                'image'      => 'images/avatars/bayo.jpg',
                'bio'        => 'DJ Bayo 🎧 | Lagos nightlife | Music producer | Afrobeats > everything',
                'location'   => 'Lagos, Nigeria',
                'website'    => 'https://djbayo.com',
                'banner'     => 'images/banners/bayo_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'bayo.ogundimu@gmail.com',
                'created_at' => $now->copy()->subMonths(2),
            ],
            [
                'id'         => 9,
                'nom'        => 'Bello',
                'prenom'     => 'Aisha',
                'role'       => 'user',
                'image'      => 'images/avatars/aisha.jpg',
                'bio'        => 'Lawyer ⚖️ | Human rights | Kano girl | Islam & progress ☪️',
                'location'   => 'Kano, Nigeria',
                'website'    => null,
                'banner'     => 'images/banners/aisha_banner.jpg',
                'sexe'       => 'F',
                'mdp'        => Hash::make('password123'),
                'email'      => 'aisha.bello@gmail.com',
                'created_at' => $now->copy()->subMonths(2),
            ],
            [
                'id'         => 10,
                'nom'        => 'Adebayo',
                'prenom'     => 'Tunde',
                'role'       => 'user',
                'image'      => 'images/avatars/tunde.jpg',
                'bio'        => 'Agritech founder 🌱 | Ibadan raised | Feeding Africa one startup at a time',
                'location'   => 'Ibadan, Nigeria',
                'website'    => 'https://agriventure.ng',
                'banner'     => 'images/banners/tunde_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'tunde.adebayo@gmail.com',
                'created_at' => $now->copy()->subMonths(1),
            ],
            [
                'id'         => 11,
                'nom'        => 'Nwosu',
                'prenom'     => 'Emeka',
                'role'       => 'user',
                'image'      => 'images/avatars/emeka.jpg',
                'bio'        => 'Petroleum engineer ⛽ | Port Harcourt | Arsenal 🔴 | Family man 👨‍👩‍👦',
                'location'   => 'Port Harcourt, Nigeria',
                'website'    => null,
                'banner'     => 'images/banners/emeka_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'emeka.nwosu@gmail.com',
                'created_at' => $now->copy()->subMonths(1),
            ],
            // ── 3 "People you may know" (friends-of-friends only) ─────────────
            [
                'id'         => 12,
                'nom'        => 'Usman',
                'prenom'     => 'Zainab',
                'role'       => 'user',
                'image'      => 'images/avatars/zainab.jpg',
                'bio'        => 'Architect 🏛️ | Abuja city planner | Sustainable design enthusiast 🌿',
                'location'   => 'Abuja, Nigeria',
                'website'    => 'https://zainabdesigns.com',
                'banner'     => 'images/banners/zainab_banner.jpg',
                'sexe'       => 'F',
                'mdp'        => Hash::make('password123'),
                'email'      => 'zainab.usman@gmail.com',
                'created_at' => $now->copy()->subWeeks(3),
            ],
            [
                'id'         => 13,
                'nom'        => 'Adesanya',
                'prenom'     => 'Sola',
                'role'       => 'user',
                'image'      => 'images/avatars/sola.jpg',
                'bio'        => 'Content creator 📱 | Lagos life | Brand deals 📩 sola@creator.ng',
                'location'   => 'Lagos, Nigeria',
                'website'    => 'https://solacreates.ng',
                'banner'     => 'images/banners/sola_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'sola.adesanya@gmail.com',
                'created_at' => $now->copy()->subWeeks(2),
            ],
            [
                'id'         => 14,
                'nom'        => 'Obi',
                'prenom'     => 'Ifeanyi',
                'role'       => 'user',
                'image'      => 'images/avatars/ifeanyi.jpg',
                'bio'        => 'Teacher 📚 | Enugu state | Lover of books and good jollof 🍛',
                'location'   => 'Enugu, Nigeria',
                'website'    => null,
                'banner'     => 'images/banners/ifeanyi_banner.jpg',
                'sexe'       => 'M',
                'mdp'        => Hash::make('password123'),
                'email'      => 'ifeanyi.obi@gmail.com',
                'created_at' => $now->copy()->subWeeks(1),
            ],
        ];

        DB::table('Utilisateur')->insert($users);

        // ── 2. Articles ───────────────────────────────────────────────────────
        // Build a flat list; we'll store the inserted IDs by user.
        $articles = [];

        // Helper: We'll manually track which article ID belongs to whom.
        // MySQL AUTO_INCREMENT will assign IDs 1,2,3,... in insertion order.
        // We define them explicitly so we can reference them later.
        $articleDefs = [
            // --- Lionel (1) ---
            [
                'id' => 1,
                'id_uti' => 1,
                'date' => $now->copy()->subDays(40),
                'image' => null,
                'description' => 'Just deployed the first version of Tulk. It\'s rough around the edges but it\'s LIVE. The grind continues 🚀 #buildinpublic #tulk'
            ],
            [
                'id' => 2,
                'id_uti' => 1,
                'date' => $now->copy()->subDays(30),
                'image' => null,
                'description' => 'Hot take: backend devs who don\'t care about UX are building half a product. The user experience is YOUR responsibility too. Fight me. 👊'
            ],
            [
                'id' => 3,
                'id_uti' => 1,
                'date' => $now->copy()->subDays(20),
                'image' => 'images/posts/lagos_sunset.jpg',
                'description' => 'Lagos sunset hits different after a 12-hour coding session. Nothing like this city 🌇 #Lagos'
            ],
            [
                'id' => 4,
                'id_uti' => 1,
                'date' => $now->copy()->subDays(10),
                'image' => null,
                'description' => 'Working on the notifications system for Tulk. Real-time stuff is satisfying to build 🔔 Also, who else codes better at night? 🌙'
            ],
            [
                'id' => 5,
                'id_uti' => 1,
                'date' => $now->copy()->subDays(2),
                'image' => null,
                'description' => 'New feature dropping soon 👀 Follow relationships + people you may know. It\'s all coming together. #Tulk'
            ],

            // --- Kemi (2) ---
            [
                'id' => 6,
                'id_uti' => 2,
                'date' => $now->copy()->subDays(38),
                'image' => 'images/posts/kemi_collection.jpg',
                'description' => 'Finally dropped my Harmattan 2026 collection 🔥🧣 This one was six months in the making. Swipe to see the full looks!'
            ],
            [
                'id' => 7,
                'id_uti' => 2,
                'date' => $now->copy()->subDays(25),
                'image' => null,
                'description' => 'Reminder: supporting African designers isn\'t just trendy — it\'s an economic decision. Every naira spent local creates local jobs. Shop wisely! 🛍️'
            ],
            [
                'id' => 8,
                'id_uti' => 2,
                'date' => $now->copy()->subDays(14),
                'image' => 'images/posts/kemi_lekki.jpg',
                'description' => 'Weekend market run at Lekki. The energy here is unmatched 🌀 Found the most beautiful ankara fabric too 😭❤️'
            ],
            [
                'id' => 9,
                'id_uti' => 2,
                'date' => $now->copy()->subDays(5),
                'image' => null,
                'description' => 'Can we normalize paying FULL price for quality African fashion? The undercutting culture is hurting creatives. We deserve to eat too 🍽️'
            ],

            // --- Chidi (3) ---
            [
                'id' => 10,
                'id_uti' => 3,
                'date' => $now->copy()->subDays(36),
                'image' => null,
                'description' => 'Fintech in Nigeria is exploding 📈 We processed more mobile transactions last month than any time in history. The unbanked era is ENDING.'
            ],
            [
                'id' => 11,
                'id_uti' => 3,
                'date' => $now->copy()->subDays(22),
                'image' => null,
                'description' => 'Chelsea are so annoying I swear. We buy £80m players and they play like Sunday league. SACK THE COACH. 😤 #CFC'
            ],
            [
                'id' => 12,
                'id_uti' => 3,
                'date' => $now->copy()->subDays(12),
                'image' => 'images/posts/abuja_tech.jpg',
                'description' => 'Attended the Abuja Tech Summit today. Great conversations about AI adoption in African markets. The future is here and it\'s African 🌍💡'
            ],
            [
                'id' => 13,
                'id_uti' => 3,
                'date' => $now->copy()->subDays(3),
                'image' => null,
                'description' => 'Unpopular opinion: most "AI startups" in Nigeria aren\'t building AI — they\'re building automation with a ChatGPT API key. Different things entirely.'
            ],

            // --- Amara (4) ---
            [
                'id' => 14,
                'id_uti' => 4,
                'date' => $now->copy()->subDays(35),
                'image' => 'images/posts/amara_mural.jpg',
                'description' => 'Six weeks of work and this mural on Corniche de Dakar is finally done 🎨✨ Every face tells a story of resistance and joy. Art is our loudest language.'
            ],
            [
                'id' => 15,
                'id_uti' => 4,
                'date' => $now->copy()->subDays(21),
                'image' => null,
                'description' => 'Baye Fall energy this morning 🟡🔴🟢 Dakar wakes up with a rhythm the whole world should feel. Grateful to be here.'
            ],
            [
                'id' => 16,
                'id_uti' => 4,
                'date' => $now->copy()->subDays(8),
                'image' => 'images/posts/amara_studio.jpg',
                'description' => 'New canvas series: "Migrations & Memory" — exploring how diaspora communities carry home with them. Open studio this Saturday in Dakar! 🖼️'
            ],

            // --- Fatou (5) ---
            [
                'id' => 17,
                'id_uti' => 5,
                'date' => $now->copy()->subDays(33),
                'image' => null,
                'description' => 'Just published my investigation on urban displacement in Dakar. Three years of reporting. Lives changed for "development." Who benefits? 📰 Link in bio.'
            ],
            [
                'id' => 18,
                'id_uti' => 5,
                'date' => $now->copy()->subDays(19),
                'image' => null,
                'description' => 'The press freedom index dropped for 4 African nations this year. Journalism is not a crime. Protect your journalists. ✊'
            ],
            [
                'id' => 19,
                'id_uti' => 5,
                'date' => $now->copy()->subDays(7),
                'image' => null,
                'description' => 'Interviewing young women in Dakar this week about political participation. The energy is electric. Gen Z is NOT going to be silent. 🔥'
            ],

            // --- Kwame (6) ---
            [
                'id' => 20,
                'id_uti' => 6,
                'date' => $now->copy()->subDays(32),
                'image' => null,
                'description' => 'Closed our seed round 🎉🇬🇭 Six months of pitching, 47 rejections, one yes that changed everything. Accra, we\'re building something big!'
            ],
            [
                'id' => 21,
                'id_uti' => 6,
                'date' => $now->copy()->subDays(18),
                'image' => 'images/posts/kwame_accra.jpg',
                'description' => 'Accra is becoming a serious startup hub. The infrastructure is improving, talent is staying home, and capital is trickling in. Watch this space 👀'
            ],
            [
                'id' => 22,
                'id_uti' => 6,
                'date' => $now->copy()->subDays(6),
                'image' => null,
                'description' => 'Building for Africa means building for context. Low bandwidth, feature phones, inconsistent power. If your product fails in those conditions, it\'s not ready. Period.'
            ],

            // --- Ngozi (7) ---
            [
                'id' => 23,
                'id_uti' => 7,
                'date' => $now->copy()->subDays(31),
                'image' => null,
                'description' => 'PSA: Malaria is still the #1 killer in sub-Saharan Africa. We have treatment. We have prevention tools. We lack distribution. This is a logistics problem disguised as a health crisis. 🏥'
            ],
            [
                'id' => 24,
                'id_uti' => 7,
                'date' => $now->copy()->subDays(17),
                'image' => 'images/posts/ngozi_hospital.jpg',
                'description' => '24-hour shift done ✅ Tired but fulfilled. The patient who came in critical yesterday is going home healthy today. This is why I do it. 🙏'
            ],
            [
                'id' => 25,
                'id_uti' => 7,
                'date' => $now->copy()->subDays(5),
                'image' => null,
                'description' => 'Mental health check: are you drinking water, sleeping enough, and talking to someone you trust? Do all three. Today. Non-negotiable. 💙'
            ],

            // --- Bayo (8) ---
            [
                'id' => 26,
                'id_uti' => 8,
                'date' => $now->copy()->subDays(29),
                'image' => 'images/posts/bayo_set.jpg',
                'description' => 'Last night\'s set at Quilox was INSANE 🎧🔊 The crowd was locked in from 11pm to 3am. Lagos, you never disappoint! Next show: April 5th 🔥'
            ],
            [
                'id' => 27,
                'id_uti' => 8,
                'date' => $now->copy()->subDays(16),
                'image' => null,
                'description' => 'Produced my first full EP with no samples 🎹 100% original sounds, recorded in my studio. Afrobeats meets Amapiano meets Lagos streets. Dropping soon 🎶'
            ],
            [
                'id' => 28,
                'id_uti' => 8,
                'date' => $now->copy()->subDays(4),
                'image' => null,
                'description' => 'Hot debate in the studio today: is Burna Boy the greatest African artist of this generation? I said yes. My guy said Wizkid. Room divided 😂'
            ],

            // --- Aisha (9) ---
            [
                'id' => 29,
                'id_uti' => 9,
                'date' => $now->copy()->subDays(28),
                'image' => null,
                'description' => 'Won the case today 🏆⚖️ Two years of fighting for a community displaced by industrial expansion. Justice isn\'t always fast but today it came. Thank you to everyone who stood with us.'
            ],
            [
                'id' => 30,
                'id_uti' => 9,
                'date' => $now->copy()->subDays(15),
                'image' => null,
                'description' => 'Reading through new constitutional amendments. There\'s good, there\'s bad, and there\'s very concerning. Thread coming tomorrow 🧵'
            ],
            [
                'id' => 31,
                'id_uti' => 9,
                'date' => $now->copy()->subDays(3),
                'image' => null,
                'description' => 'Hosting a free legal clinic in Kano this Saturday. Every Nigerian deserves to know their rights regardless of income. Spread the word 📢'
            ],

            // --- Tunde (10) ---
            [
                'id' => 32,
                'id_uti' => 10,
                'date' => $now->copy()->subDays(27),
                'image' => 'images/posts/tunde_farm.jpg',
                'description' => 'From 12 farmers to 847 in 18 months 🌱 AgriVenture is connecting smallholder farmers to premium markets. The numbers don\'t lie. This is working. 🙌'
            ],
            [
                'id' => 33,
                'id_uti' => 10,
                'date' => $now->copy()->subDays(13),
                'image' => null,
                'description' => 'Food security is a national security issue. Nigeria imports what we should be growing. The dependency has to end. #AgriTech #Nigeria'
            ],
            [
                'id' => 34,
                'id_uti' => 10,
                'date' => $now->copy()->subDays(2),
                'image' => null,
                'description' => 'Heading to a farmers cooperative in Oyo State tomorrow. Some of the most inspiring humans I\'ve met are smallholder farmers. Resilience personified. 🌾'
            ],

            // --- Emeka (11) ---
            [
                'id' => 35,
                'id_uti' => 11,
                'date' => $now->copy()->subDays(26),
                'image' => null,
                'description' => 'Offshore rig life: 28 days on, 14 days off. The isolation is real but so is the paycheck 😂 Port Harcourt, I\'m coming home soon 🛢️'
            ],
            [
                'id' => 36,
                'id_uti' => 11,
                'date' => $now->copy()->subDays(11),
                'image' => null,
                'description' => 'Nigeria\'s oil production is at its highest in years. But where is the prosperity reaching? We need a serious conversation about resource allocation. 🇳🇬'
            ],
            [
                'id' => 37,
                'id_uti' => 11,
                'date' => $now->copy()->subDays(1),
                'image' => 'images/posts/emeka_family.jpg',
                'description' => 'Home for the holidays 🏡❤️ Nothing beats this. Arsenal won yesterday, jollof is on the fire, and my kids won\'t let me rest for a second. Life is good.'
            ],

            // --- Zainab (12) — friend-of-friend ---
            [
                'id' => 38,
                'id_uti' => 12,
                'date' => $now->copy()->subDays(24),
                'image' => 'images/posts/zainab_building.jpg',
                'description' => 'Phase 1 of the Wuse residential complex is complete 🏗️ Sustainable materials, solar-ready roofing, rainwater harvesting. Architecture can heal communities. #AbujaDev'
            ],
            [
                'id' => 39,
                'id_uti' => 12,
                'date' => $now->copy()->subDays(9),
                'image' => null,
                'description' => 'Green architecture isn\'t a luxury for Africa — it\'s a necessity. We have the sun, the wind, the land. Let\'s use them intelligently. 🌞'
            ],

            // --- Sola (13) — friend-of-friend ---
            [
                'id' => 40,
                'id_uti' => 13,
                'date' => $now->copy()->subDays(23),
                'image' => 'images/posts/sola_vlog.jpg',
                'description' => 'New vlog is up!! 📹 "48 Hours in Lagos on a Budget" — I ate, I vibed, I explored and spent under ₦15k. Link in bio! 🔗'
            ],
            [
                'id' => 41,
                'id_uti' => 13,
                'date' => $now->copy()->subDays(6),
                'image' => null,
                'description' => 'To every creator who\'s been told they\'re "too local" for brand deals: your audience is the brand. Never downplay your culture for their comfort. 🔥'
            ],

            // --- Ifeanyi (14) — friend-of-friend ---
            [
                'id' => 42,
                'id_uti' => 14,
                'date' => $now->copy()->subDays(22),
                'image' => null,
                'description' => '"The function of education is to teach one to think intensively and to think critically." — MLK. Miss this being the entire point of schools. 📚'
            ],
            [
                'id' => 43,
                'id_uti' => 14,
                'date' => $now->copy()->subDays(8),
                'image' => null,
                'description' => 'My students surprised me with a "Thank You" card today. Written in three languages: Igbo, English, and French. Proudest moment of my year so far. 🥹❤️'
            ],
        ];

        DB::table('Article')->insert($articleDefs);

        // ── 3. Amitie (Friendships) ───────────────────────────────────────────
        // Confirmed friendships: insert BOTH directions (id_1,id_2) and (id_2,id_1)
        $confirmedPairs = [
            // Lionel ↔ 10 friends
            [1, 2],
            [1, 3],
            [1, 4],
            [1, 5],
            [1, 6],
            [1, 7],
            [1, 8],
            [1, 9],
            [1, 10],
            [1, 11],
            // Friends among themselves
            [2, 8],   // Kemi ↔ Bayo
            [2, 10],  // Kemi ↔ Tunde
            [3, 11],  // Chidi ↔ Emeka
            [3, 9],   // Chidi ↔ Aisha
            [4, 5],   // Amara ↔ Fatou
            [6, 7],   // Kwame ↔ Ngozi
            [8, 10],  // Bayo ↔ Tunde
            [7, 11],  // Ngozi ↔ Emeka
            // "People you may know" friendships (12,13,14 with your friends only)
            [3, 12],  // Chidi ↔ Zainab
            [9, 12],  // Aisha ↔ Zainab
            [2, 13],  // Kemi ↔ Sola
            [8, 13],  // Bayo ↔ Sola
            [7, 14],  // Ngozi ↔ Ifeanyi
            [11, 14], // Emeka ↔ Ifeanyi
        ];

        $amitieRows = [];
        foreach ($confirmedPairs as [$a, $b]) {
            $amitieRows[] = [
                'id_1' => $a,
                'id_2' => $b,
                'statut' => 'ami',
                'created_at' => $now->copy()->subDays(rand(20, 60)),
                'updated_at' => $now->copy()->subDays(rand(1, 19))
            ];
            $amitieRows[] = [
                'id_1' => $b,
                'id_2' => $a,
                'statut' => 'ami',
                'created_at' => $now->copy()->subDays(rand(20, 60)),
                'updated_at' => $now->copy()->subDays(rand(1, 19))
            ];
        }

        // Pending requests (one-directional)
        $pendingRows = [
            [
                'id_1' => 5,
                'id_2' => 6,
                'statut' => 'en attente',  // Fatou → Kwame
                'created_at' => $now->copy()->subDays(3),
                'updated_at' => $now->copy()->subDays(3)
            ],
            [
                'id_1' => 10,
                'id_2' => 4,
                'statut' => 'en attente',  // Tunde → Amara
                'created_at' => $now->copy()->subDays(2),
                'updated_at' => $now->copy()->subDays(2)
            ],
            [
                'id_1' => 14,
                'id_2' => 8,
                'statut' => 'en attente',  // Ifeanyi → Bayo
                'created_at' => $now->copy()->subDays(1),
                'updated_at' => $now->copy()->subDays(1)
            ],
            [
                'id_1' => 13,
                'id_2' => 1,
                'statut' => 'en attente',  // Sola → Lionel (Lionel hasn't accepted)
                'created_at' => $now->copy()->subDays(4),
                'updated_at' => $now->copy()->subDays(4)
            ],
            [
                'id_1' => 12,
                'id_2' => 6,
                'statut' => 'en attente',  // Zainab → Kwame
                'created_at' => $now->copy()->subDays(5),
                'updated_at' => $now->copy()->subDays(5)
            ],
        ];

        DB::table('Amitie')->insert(array_merge($amitieRows, $pendingRows));

        // ── 4. Commentaires ───────────────────────────────────────────────────
        // Friends commenting on each other's posts with specific named context
        $comments = [
            // On Lionel's posts (1–5)
            ['id_arti' => 1,  'id_uti' => 2,  'date' => $now->copy()->subDays(39), 'texte' => 'Let\'s GOOO Lionel!! I\'ve been waiting for this. You\'ve been talking about Tulk for months 😂🔥'],
            ['id_arti' => 1,  'id_uti' => 8,  'date' => $now->copy()->subDays(39), 'texte' => 'Broooo it\'s live?! Congrats man, this is a big deal 🙌'],
            ['id_arti' => 1,  'id_uti' => 3,  'date' => $now->copy()->subDays(38), 'texte' => 'Finally! Now fix the notification bug 😅 jk congrats bro'],
            ['id_arti' => 2,  'id_uti' => 10, 'date' => $now->copy()->subDays(29), 'texte' => 'This is FACTS. I\'ve been trying to tell my backend team the same thing for months. UX is everyone\'s job.'],
            ['id_arti' => 2,  'id_uti' => 6,  'date' => $now->copy()->subDays(29), 'texte' => 'Strong take. I partially agree — but good UX also needs dedicated UX people. Both/and, not either/or.'],
            ['id_arti' => 2,  'id_uti' => 11, 'date' => $now->copy()->subDays(28), 'texte' => 'The overlap between backend thinking and user empathy is where the best devs live. 💯'],
            ['id_arti' => 3,  'id_uti' => 2,  'date' => $now->copy()->subDays(19), 'texte' => 'Lagos sunset is genuinely one of the most underrated views on earth 😍'],
            ['id_arti' => 3,  'id_uti' => 7,  'date' => $now->copy()->subDays(19), 'texte' => 'This is beautiful! When was this taken?'],
            ['id_arti' => 4,  'id_uti' => 3,  'date' => $now->copy()->subDays(9),  'texte' => 'Night coding hits different with the right playlist. Bayo should make a "coding mode" mix 😂'],
            ['id_arti' => 4,  'id_uti' => 8,  'date' => $now->copy()->subDays(9),  'texte' => 'Chidi said it first but yeah... I can make that playlist 🎧 say less'],
            ['id_arti' => 5,  'id_uti' => 9,  'date' => $now->copy()->subDays(1),  'texte' => 'The "people you may know" feature is SO useful. Can\'t wait! 👀'],
            ['id_arti' => 5,  'id_uti' => 4,  'date' => $now->copy()->subDays(1),  'texte' => 'Every time I think Tulk is done you drop another feature 😭 keep building!'],

            // On Kemi's posts (6–9)
            ['id_arti' => 6,  'id_uti' => 1,  'date' => $now->copy()->subDays(37), 'texte' => 'Kemi this collection is FIRE 🔥 the indigo pieces especially are stunning'],
            ['id_arti' => 6,  'id_uti' => 8,  'date' => $now->copy()->subDays(37), 'texte' => 'My sister needs to see this asap 👀 dropping the link right now'],
            ['id_arti' => 6,  'id_uti' => 10, 'date' => $now->copy()->subDays(36), 'texte' => 'Six months of work and it shows. Quality is undeniable 🙌'],
            ['id_arti' => 7,  'id_uti' => 1,  'date' => $now->copy()->subDays(24), 'texte' => '100% this. Every time I buy local I feel good about it in multiple ways. Economic and cultural.'],
            ['id_arti' => 7,  'id_uti' => 5,  'date' => $now->copy()->subDays(24), 'texte' => 'The argument for buying local African products needs to be louder in media. Journalists, we need to push this.'],
            ['id_arti' => 9,  'id_uti' => 8,  'date' => $now->copy()->subDays(4),  'texte' => 'People out here bargaining ₦3000 for a hand-stitched piece that took 8 hours. Unacceptable.'],
            ['id_arti' => 9,  'id_uti' => 1,  'date' => $now->copy()->subDays(4),  'texte' => 'The devaluation of creative work is a whole topic. We need more conversations like this.'],

            // On Chidi's posts (10–13)
            ['id_arti' => 10, 'id_uti' => 1,  'date' => $now->copy()->subDays(35), 'texte' => 'The mobile money revolution in West Africa is real. The infrastructure story is finally catching up.'],
            ['id_arti' => 10, 'id_uti' => 6,  'date' => $now->copy()->subDays(35), 'texte' => 'Ghana is seeing the same trends. Africa is leapfrogging traditional banking entirely. Exciting times 🇬🇭'],
            ['id_arti' => 11, 'id_uti' => 1,  'date' => $now->copy()->subDays(21), 'texte' => 'Chelsea banter aside, the whole league has been chaotic this season 😂'],
            ['id_arti' => 11, 'id_uti' => 11, 'date' => $now->copy()->subDays(21), 'texte' => 'Arsenal fan here 🔴 this is your problem every season and yet you keep buying expensive midfielders 😭'],
            ['id_arti' => 12, 'id_uti' => 1,  'date' => $now->copy()->subDays(11), 'texte' => 'Wish I could\'ve attended! How was the panel on healthcare AI?'],
            ['id_arti' => 12, 'id_uti' => 7,  'date' => $now->copy()->subDays(11), 'texte' => 'The healthcare AI discussion was so needed. Did they address rural deployment challenges?'],
            ['id_arti' => 13, 'id_uti' => 6,  'date' => $now->copy()->subDays(2),  'texte' => 'The "AI wrapper" startup problem is global but feels especially pronounced here because the VC hype cycle arrived late. Good observation.'],
            ['id_arti' => 13, 'id_uti' => 10, 'date' => $now->copy()->subDays(2),  'texte' => 'Agritech space has this issue too. "AI-powered farming" when it\'s just an Excel sheet with a nice UI 😭'],

            // On Amara's posts (14–16)
            ['id_arti' => 14, 'id_uti' => 5,  'date' => $now->copy()->subDays(34), 'texte' => 'Amara I walked past this yesterday and stopped for 10 minutes. It\'s powerful. Dakar is lucky to have you. 🎨'],
            ['id_arti' => 14, 'id_uti' => 1,  'date' => $now->copy()->subDays(33), 'texte' => 'The detail in this is incredible from the photos alone. I need to see it in person someday.'],
            ['id_arti' => 16, 'id_uti' => 5,  'date' => $now->copy()->subDays(7),  'texte' => 'I\'ll be there Saturday! 🙌 Can\'t wait to see the new series in person'],
            ['id_arti' => 16, 'id_uti' => 4,  'date' => $now->copy()->subDays(7),  'texte' => 'Thanks Fatou! 💛 space is open 10am–6pm. Bring friends!'],

            // On Bayo's posts (26–28)
            ['id_arti' => 26, 'id_uti' => 1,  'date' => $now->copy()->subDays(28), 'texte' => 'The energy at Quilox is always different when you\'re on 🔥 I was there bro, crowd was fully locked'],
            ['id_arti' => 26, 'id_uti' => 2,  'date' => $now->copy()->subDays(28), 'texte' => 'I missed it but my friend sent me a video and I regretted staying home 😭 next one I\'m there!'],
            ['id_arti' => 27, 'id_uti' => 1,  'date' => $now->copy()->subDays(15), 'texte' => 'Original EP?? No samples?? Bayo you really said "I am the sample" 😭🔥'],
            ['id_arti' => 27, 'id_uti' => 2,  'date' => $now->copy()->subDays(15), 'texte' => 'This is the one we\'ve been waiting for!! Release date?? 👀'],
            ['id_arti' => 28, 'id_uti' => 1,  'date' => $now->copy()->subDays(3),  'texte' => 'Burna Boy is the answer and the argument is closed. Sorry Wizkid fans 😅'],
            ['id_arti' => 28, 'id_uti' => 10, 'date' => $now->copy()->subDays(3),  'texte' => 'You\'re both wrong, it\'s Fela and the conversation ended in 1980 💀'],

            // On Tunde's posts (32–34)
            ['id_arti' => 32, 'id_uti' => 1,  'date' => $now->copy()->subDays(26), 'texte' => '847 farmers!! Tunde this is the impact we need to see more of. Nigerian agriculture has always had the potential.'],
            ['id_arti' => 32, 'id_uti' => 6,  'date' => $now->copy()->subDays(26), 'texte' => 'These numbers are real proof of concept. Ghana is watching and would love a version of this 👀'],
            ['id_arti' => 33, 'id_uti' => 1,  'date' => $now->copy()->subDays(12), 'texte' => 'Import dependency is the silent killer of our industrial capacity. The conversation needs more volume.'],
            ['id_arti' => 34, 'id_uti' => 2,  'date' => $now->copy()->subDays(1),  'texte' => 'Oyo State farmers are incredible. Resilience is in the DNA 🌾'],

            // On Emeka's posts (35–37)
            ['id_arti' => 36, 'id_uti' => 1,  'date' => $now->copy()->subDays(10), 'texte' => 'Resource allocation is the conversation Nigeria needs to be having loudly. The numbers exist. Where do they go?'],
            ['id_arti' => 36, 'id_uti' => 3,  'date' => $now->copy()->subDays(10), 'texte' => 'Transparency in oil revenue was never a strong suit. Needs structural reform, not just good intentions.'],
            ['id_arti' => 37, 'id_uti' => 7,  'date' => $now->copy()->subDays(0),  'texte' => 'Family time is sacred. Enjoy every second Emeka! ❤️ Also Arsenal won? Barely 😂'],
            ['id_arti' => 37, 'id_uti' => 1,  'date' => $now->copy()->subDays(0),  'texte' => 'The image of you and the kids is everything 🥹 also jollof from Port Harcourt hits DIFFERENT'],

            // On Ngozi's posts (23–25)
            ['id_arti' => 23, 'id_uti' => 1,  'date' => $now->copy()->subDays(30), 'texte' => 'Logistics and last-mile distribution — the unsung crisis in African health. Thank you for framing it this way Dr Ngozi.'],
            ['id_arti' => 23, 'id_uti' => 11, 'date' => $now->copy()->subDays(30), 'texte' => 'In PH the situation is improving but slowly. The community health workers program is making a real difference though.'],
            ['id_arti' => 25, 'id_uti' => 1,  'date' => $now->copy()->subDays(4),  'texte' => 'Mental health check noted and completed ✅ Thank you Dr Ngozi, we need this reminder often.'],
            ['id_arti' => 25, 'id_uti' => 9,  'date' => $now->copy()->subDays(4),  'texte' => 'This. Especially the "talk to someone" part. People underestimate the power of just being heard.'],

            // On Aisha's posts (29–31)
            ['id_arti' => 29, 'id_uti' => 1,  'date' => $now->copy()->subDays(27), 'texte' => 'TWO YEARS! Aisha this is incredible persistence. So proud of you and this win. The community deserved justice. ✊'],
            ['id_arti' => 29, 'id_uti' => 3,  'date' => $now->copy()->subDays(27), 'texte' => 'This is the kind of legal work that actually matters. Congratulations Aisha, truly. 🏆'],
            ['id_arti' => 31, 'id_uti' => 1,  'date' => $now->copy()->subDays(2),  'texte' => 'Free legal clinic is so needed. Wish more lawyers did this. Sharing everywhere!'],
            ['id_arti' => 31, 'id_uti' => 7,  'date' => $now->copy()->subDays(2),  'texte' => 'Could we do a joint event? Legal rights + health rights? Kano could really benefit from this combo.'],

            // On Kwame's posts (20–22)
            ['id_arti' => 20, 'id_uti' => 1,  'date' => $now->copy()->subDays(31), 'texte' => 'KWAME!!! 47 rejections and you kept going. This is the entrepreneurship story that needs to be told. 🎉'],
            ['id_arti' => 20, 'id_uti' => 10, 'date' => $now->copy()->subDays(31), 'texte' => 'The rejection story is important. People only see the yes. Huge congratulations 🙌'],
            ['id_arti' => 22, 'id_uti' => 3,  'date' => $now->copy()->subDays(5),  'texte' => 'Low-bandwidth design is so underrated in product discussions. Building for Africa means building for real Africa, not demo conditions.'],
            ['id_arti' => 22, 'id_uti' => 1,  'date' => $now->copy()->subDays(5),  'texte' => 'This is my north star when building Tulk. Every feature tested on a 3G connection first.'],
        ];

        DB::table('Commentaire')->insert($comments);

        // ── 5. Liker (Post Likes) ─────────────────────────────────────────────
        // Friends liking each other's posts - a rich web of interactions
        $likes = [
            // Likes on Lionel's posts
            ['id_uti' => 2,  'id_arti' => 1,  'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 1,  'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 1,  'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 1,  'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 1,  'type' => 'like'],
            ['id_uti' => 4,  'id_arti' => 2,  'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 2,  'type' => 'like'],
            ['id_uti' => 11, 'id_arti' => 2,  'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 2,  'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 3,  'type' => 'like'],
            ['id_uti' => 5,  'id_arti' => 3,  'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 3,  'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 3,  'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 4,  'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 4,  'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 4,  'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 5,  'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 5,  'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 5,  'type' => 'like'],
            ['id_uti' => 11, 'id_arti' => 5,  'type' => 'like'],

            // Likes on Kemi's posts
            ['id_uti' => 1,  'id_arti' => 6,  'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 6,  'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 6,  'type' => 'like'],
            ['id_uti' => 5,  'id_arti' => 6,  'type' => 'love'],
            ['id_uti' => 7,  'id_arti' => 6,  'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 7,  'type' => 'like'],
            ['id_uti' => 5,  'id_arti' => 7,  'type' => 'like'],
            ['id_uti' => 4,  'id_arti' => 7,  'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 8,  'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 8,  'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 9,  'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 9,  'type' => 'like'],
            ['id_uti' => 4,  'id_arti' => 9,  'type' => 'like'],

            // Likes on Chidi's posts
            ['id_uti' => 1,  'id_arti' => 10, 'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 10, 'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 10, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 11, 'type' => 'haha'],
            ['id_uti' => 11, 'id_arti' => 11, 'type' => 'haha'],
            ['id_uti' => 1,  'id_arti' => 12, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 12, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 12, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 13, 'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 13, 'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 13, 'type' => 'like'],

            // Likes on Amara's posts
            ['id_uti' => 5,  'id_arti' => 14, 'type' => 'love'],
            ['id_uti' => 1,  'id_arti' => 14, 'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 14, 'type' => 'love'],
            ['id_uti' => 7,  'id_arti' => 14, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 15, 'type' => 'like'],
            ['id_uti' => 5,  'id_arti' => 15, 'type' => 'like'],
            ['id_uti' => 5,  'id_arti' => 16, 'type' => 'love'],
            ['id_uti' => 1,  'id_arti' => 16, 'type' => 'like'],
            ['id_uti' => 4,  'id_arti' => 16, 'type' => 'like'],

            // Likes on Fatou's posts
            ['id_uti' => 4,  'id_arti' => 17, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 17, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 17, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 17, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 18, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 18, 'type' => 'like'],
            ['id_uti' => 4,  'id_arti' => 19, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 19, 'type' => 'like'],

            // Likes on Kwame's posts
            ['id_uti' => 1,  'id_arti' => 20, 'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 20, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 20, 'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 20, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 21, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 21, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 22, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 22, 'type' => 'like'],

            // Likes on Ngozi's posts
            ['id_uti' => 1,  'id_arti' => 23, 'type' => 'like'],
            ['id_uti' => 11, 'id_arti' => 23, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 23, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 23, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 24, 'type' => 'love'],
            ['id_uti' => 7,  'id_arti' => 24, 'type' => 'love'],
            ['id_uti' => 11, 'id_arti' => 24, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 25, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 25, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 25, 'type' => 'like'],
            ['id_uti' => 4,  'id_arti' => 25, 'type' => 'like'],

            // Likes on Bayo's posts
            ['id_uti' => 1,  'id_arti' => 26, 'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 26, 'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 26, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 26, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 27, 'type' => 'love'],
            ['id_uti' => 2,  'id_arti' => 27, 'type' => 'love'],
            ['id_uti' => 10, 'id_arti' => 27, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 28, 'type' => 'haha'],
            ['id_uti' => 10, 'id_arti' => 28, 'type' => 'haha'],

            // Likes on Aisha's posts
            ['id_uti' => 1,  'id_arti' => 29, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 29, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 29, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 29, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 30, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 30, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 31, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 31, 'type' => 'like'],

            // Likes on Tunde's posts
            ['id_uti' => 1,  'id_arti' => 32, 'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 32, 'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 32, 'type' => 'like'],
            ['id_uti' => 10, 'id_arti' => 32, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 33, 'type' => 'like'],
            ['id_uti' => 6,  'id_arti' => 33, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 34, 'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 34, 'type' => 'like'],

            // Likes on Emeka's posts
            ['id_uti' => 1,  'id_arti' => 35, 'type' => 'haha'],
            ['id_uti' => 3,  'id_arti' => 35, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 35, 'type' => 'haha'],
            ['id_uti' => 1,  'id_arti' => 36, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 36, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 36, 'type' => 'like'],
            ['id_uti' => 1,  'id_arti' => 37, 'type' => 'love'],
            ['id_uti' => 7,  'id_arti' => 37, 'type' => 'love'],
            ['id_uti' => 3,  'id_arti' => 37, 'type' => 'like'],

            // Likes on friend-of-friend posts (by their friends only, NOT Lionel)
            ['id_uti' => 3,  'id_arti' => 38, 'type' => 'like'],
            ['id_uti' => 9,  'id_arti' => 38, 'type' => 'like'],
            ['id_uti' => 3,  'id_arti' => 39, 'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 40, 'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 40, 'type' => 'like'],
            ['id_uti' => 2,  'id_arti' => 41, 'type' => 'like'],
            ['id_uti' => 8,  'id_arti' => 41, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 42, 'type' => 'like'],
            ['id_uti' => 11, 'id_arti' => 42, 'type' => 'like'],
            ['id_uti' => 7,  'id_arti' => 43, 'type' => 'love'],
            ['id_uti' => 11, 'id_arti' => 43, 'type' => 'love'],
        ];

        DB::table('Liker')->insert($likes);

        // ── 6. Follow relationships ───────────────────────────────────────────
        // Mix of mutual and one-directional follows
        $follows = [
            // Lionel follows all friends + public figures
            ['follower_id' => 1, 'following_id' => 2,  'created_at' => $now->copy()->subDays(50)],
            ['follower_id' => 1, 'following_id' => 3,  'created_at' => $now->copy()->subDays(48)],
            ['follower_id' => 1, 'following_id' => 4,  'created_at' => $now->copy()->subDays(45)],
            ['follower_id' => 1, 'following_id' => 5,  'created_at' => $now->copy()->subDays(44)],
            ['follower_id' => 1, 'following_id' => 6,  'created_at' => $now->copy()->subDays(40)],
            ['follower_id' => 1, 'following_id' => 7,  'created_at' => $now->copy()->subDays(38)],
            ['follower_id' => 1, 'following_id' => 8,  'created_at' => $now->copy()->subDays(35)],
            ['follower_id' => 1, 'following_id' => 9,  'created_at' => $now->copy()->subDays(30)],
            ['follower_id' => 1, 'following_id' => 10, 'created_at' => $now->copy()->subDays(25)],
            ['follower_id' => 1, 'following_id' => 11, 'created_at' => $now->copy()->subDays(20)],

            // All friends follow Lionel back (mutual)
            ['follower_id' => 2,  'following_id' => 1, 'created_at' => $now->copy()->subDays(49)],
            ['follower_id' => 3,  'following_id' => 1, 'created_at' => $now->copy()->subDays(47)],
            ['follower_id' => 4,  'following_id' => 1, 'created_at' => $now->copy()->subDays(44)],
            ['follower_id' => 5,  'following_id' => 1, 'created_at' => $now->copy()->subDays(43)],
            ['follower_id' => 6,  'following_id' => 1, 'created_at' => $now->copy()->subDays(39)],
            ['follower_id' => 7,  'following_id' => 1, 'created_at' => $now->copy()->subDays(37)],
            ['follower_id' => 8,  'following_id' => 1, 'created_at' => $now->copy()->subDays(34)],
            ['follower_id' => 9,  'following_id' => 1, 'created_at' => $now->copy()->subDays(29)],
            ['follower_id' => 10, 'following_id' => 1, 'created_at' => $now->copy()->subDays(24)],
            ['follower_id' => 11, 'following_id' => 1, 'created_at' => $now->copy()->subDays(19)],

            // Friends follow each other (mix of mutual & one-way)
            ['follower_id' => 2,  'following_id' => 8,  'created_at' => $now->copy()->subDays(30)],
            ['follower_id' => 8,  'following_id' => 2,  'created_at' => $now->copy()->subDays(29)],  // mutual
            ['follower_id' => 2,  'following_id' => 10, 'created_at' => $now->copy()->subDays(25)],
            ['follower_id' => 10, 'following_id' => 2,  'created_at' => $now->copy()->subDays(24)],  // mutual
            ['follower_id' => 3,  'following_id' => 11, 'created_at' => $now->copy()->subDays(22)],
            ['follower_id' => 11, 'following_id' => 3,  'created_at' => $now->copy()->subDays(21)],  // mutual
            ['follower_id' => 4,  'following_id' => 5,  'created_at' => $now->copy()->subDays(20)],
            ['follower_id' => 5,  'following_id' => 4,  'created_at' => $now->copy()->subDays(20)],  // mutual
            ['follower_id' => 6,  'following_id' => 7,  'created_at' => $now->copy()->subDays(18)],
            // Ngozi does NOT follow Kwame back (one-way)
            ['follower_id' => 7,  'following_id' => 11, 'created_at' => $now->copy()->subDays(15)],
            ['follower_id' => 11, 'following_id' => 7,  'created_at' => $now->copy()->subDays(14)],  // mutual
            ['follower_id' => 8,  'following_id' => 10, 'created_at' => $now->copy()->subDays(10)],
            ['follower_id' => 10, 'following_id' => 8,  'created_at' => $now->copy()->subDays(9)],   // mutual

            // Friend-of-friend users following some of Lionel's friends (one-way only)
            ['follower_id' => 12, 'following_id' => 3,  'created_at' => $now->copy()->subDays(12)],
            ['follower_id' => 3,  'following_id' => 12, 'created_at' => $now->copy()->subDays(11)],  // Chidi follows Zainab back
            ['follower_id' => 12, 'following_id' => 9,  'created_at' => $now->copy()->subDays(10)],
            ['follower_id' => 9,  'following_id' => 12, 'created_at' => $now->copy()->subDays(10)],  // Aisha follows Zainab
            ['follower_id' => 13, 'following_id' => 2,  'created_at' => $now->copy()->subDays(8)],
            ['follower_id' => 2,  'following_id' => 13, 'created_at' => $now->copy()->subDays(7)],   // Kemi follows Sola
            ['follower_id' => 13, 'following_id' => 8,  'created_at' => $now->copy()->subDays(6)],
            ['follower_id' => 8,  'following_id' => 13, 'created_at' => $now->copy()->subDays(6)],   // Bayo follows Sola
            ['follower_id' => 14, 'following_id' => 7,  'created_at' => $now->copy()->subDays(5)],
            ['follower_id' => 7,  'following_id' => 14, 'created_at' => $now->copy()->subDays(5)],   // Ngozi follows Ifeanyi
            ['follower_id' => 14, 'following_id' => 11, 'created_at' => $now->copy()->subDays(4)],
            ['follower_id' => 11, 'following_id' => 14, 'created_at' => $now->copy()->subDays(3)],   // Emeka follows Ifeanyi
        ];

        DB::table('Follow')->insert($follows);

        // ── 7. ProfileLikes ───────────────────────────────────────────────────
        $profileLikes = [
            // Lionel's profile liked by friends
            ['id_uti' => 2,  'id_uti_profile' => 1, 'date' => $now->copy()->subDays(30)],
            ['id_uti' => 3,  'id_uti_profile' => 1, 'date' => $now->copy()->subDays(28)],
            ['id_uti' => 8,  'id_uti_profile' => 1, 'date' => $now->copy()->subDays(25)],
            ['id_uti' => 10, 'id_uti_profile' => 1, 'date' => $now->copy()->subDays(20)],
            ['id_uti' => 6,  'id_uti_profile' => 1, 'date' => $now->copy()->subDays(15)],
            ['id_uti' => 7,  'id_uti_profile' => 1, 'date' => $now->copy()->subDays(10)],

            // Lionel likes his friends' profiles
            ['id_uti' => 1,  'id_uti_profile' => 2,  'date' => $now->copy()->subDays(29)],
            ['id_uti' => 1,  'id_uti_profile' => 4,  'date' => $now->copy()->subDays(22)],
            ['id_uti' => 1,  'id_uti_profile' => 7,  'date' => $now->copy()->subDays(18)],
            ['id_uti' => 1,  'id_uti_profile' => 9,  'date' => $now->copy()->subDays(12)],
            ['id_uti' => 1,  'id_uti_profile' => 6,  'date' => $now->copy()->subDays(8)],

            // Friends liking each other's profiles
            ['id_uti' => 8,  'id_uti_profile' => 2,  'date' => $now->copy()->subDays(20)],
            ['id_uti' => 2,  'id_uti_profile' => 8,  'date' => $now->copy()->subDays(18)],
            ['id_uti' => 10, 'id_uti_profile' => 2,  'date' => $now->copy()->subDays(15)],
            ['id_uti' => 4,  'id_uti_profile' => 5,  'date' => $now->copy()->subDays(14)],
            ['id_uti' => 5,  'id_uti_profile' => 4,  'date' => $now->copy()->subDays(13)],
            ['id_uti' => 11, 'id_uti_profile' => 3,  'date' => $now->copy()->subDays(12)],
            ['id_uti' => 3,  'id_uti_profile' => 11, 'date' => $now->copy()->subDays(11)],
            ['id_uti' => 7,  'id_uti_profile' => 6,  'date' => $now->copy()->subDays(10)],
            ['id_uti' => 9,  'id_uti_profile' => 3,  'date' => $now->copy()->subDays(9)],
            ['id_uti' => 10, 'id_uti_profile' => 8,  'date' => $now->copy()->subDays(7)],

            // Friend-of-friend profile likes (within their own circles)
            ['id_uti' => 12, 'id_uti_profile' => 3,  'date' => $now->copy()->subDays(5)],
            ['id_uti' => 3,  'id_uti_profile' => 12, 'date' => $now->copy()->subDays(4)],
            ['id_uti' => 13, 'id_uti_profile' => 2,  'date' => $now->copy()->subDays(3)],
            ['id_uti' => 14, 'id_uti_profile' => 7,  'date' => $now->copy()->subDays(2)],
            ['id_uti' => 7,  'id_uti_profile' => 14, 'date' => $now->copy()->subDays(1)],
        ];

        DB::table('ProfileLike')->insert($profileLikes);

        // ── 8. Notifications ──────────────────────────────────────────────────
        // Seeding realistic notifications for Lionel so the bell has content
        $notifications = [
            [
                'id_uti' => 1,
                'id_uti_from' => 2,
                'type' => 'like',
                'subtype' => 'post_like',
                'title' => 'Kemi liked your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Kemi Adeyemi liked your post: "Just deployed the first version of Tulk..."',
                'related_id' => 1,
                'related_type' => 'Article',
                'is_read' => 1,
                'read_at' => $now->copy()->subDays(38),
                'created_at' => $now->copy()->subDays(39),
                'updated_at' => $now->copy()->subDays(38),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 8,
                'type' => 'comment',
                'subtype' => 'post_comment',
                'title' => 'Bayo commented on your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Bayo Ogundimu: "Broooo it\'s live?! Congrats man, this is a big deal 🙌"',
                'related_id' => 1,
                'related_type' => 'Article',
                'is_read' => 1,
                'read_at' => $now->copy()->subDays(38),
                'created_at' => $now->copy()->subDays(39),
                'updated_at' => $now->copy()->subDays(38),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 10,
                'type' => 'like',
                'subtype' => 'post_like',
                'title' => 'Tunde liked your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Tunde Adebayo liked your post: "Hot take: backend devs who don\'t care about UX..."',
                'related_id' => 2,
                'related_type' => 'Article',
                'is_read' => 1,
                'read_at' => $now->copy()->subDays(28),
                'created_at' => $now->copy()->subDays(29),
                'updated_at' => $now->copy()->subDays(28),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 7,
                'type' => 'comment',
                'subtype' => 'post_comment',
                'title' => 'Ngozi commented on your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Ngozi Eze: "This is beautiful! When was this taken?"',
                'related_id' => 3,
                'related_type' => 'Article',
                'is_read' => 1,
                'read_at' => $now->copy()->subDays(18),
                'created_at' => $now->copy()->subDays(19),
                'updated_at' => $now->copy()->subDays(18),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 9,
                'type' => 'like',
                'subtype' => 'post_like',
                'title' => 'Aisha liked your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Aisha Bello liked your post: "Working on the notifications system for Tulk..."',
                'related_id' => 4,
                'related_type' => 'Article',
                'is_read' => 0,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(9),
                'updated_at' => $now->copy()->subDays(9),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 4,
                'type' => 'comment',
                'subtype' => 'post_comment',
                'title' => 'Amara commented on your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Amara Diallo: "Every time I think Tulk is done you drop another feature 😭 keep building!"',
                'related_id' => 5,
                'related_type' => 'Article',
                'is_read' => 0,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(1),
                'updated_at' => $now->copy()->subDays(1),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 6,
                'type' => 'profile_like',
                'subtype' => null,
                'title' => 'Kwame liked your profile',
                'priority' => 'low',
                'channel' => 'in_app',
                'message' => 'Kwame Mensah liked your profile.',
                'related_id' => 1,
                'related_type' => 'Utilisateur',
                'is_read' => 0,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(15),
                'updated_at' => $now->copy()->subDays(15),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 11,
                'type' => 'follow',
                'subtype' => null,
                'title' => 'Emeka started following you',
                'priority' => 'low',
                'channel' => 'in_app',
                'message' => 'Emeka Nwosu started following you.',
                'related_id' => 1,
                'related_type' => 'Utilisateur',
                'is_read' => 0,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(19),
                'updated_at' => $now->copy()->subDays(19),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 13,
                'type' => 'friend_request',
                'subtype' => 'incoming',
                'title' => 'Sola sent you a friend request',
                'priority' => 'high',
                'channel' => 'both',
                'message' => 'Sola Adesanya sent you a friend request. You may know them through Kemi or Bayo.',
                'related_id' => 13,
                'related_type' => 'Utilisateur',
                'is_read' => 0,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(4),
                'updated_at' => $now->copy()->subDays(4),
            ],
            [
                'id_uti' => 1,
                'id_uti_from' => 3,
                'type' => 'like',
                'subtype' => 'post_like',
                'title' => 'Chidi liked your post',
                'priority' => 'normal',
                'channel' => 'both',
                'message' => 'Chidi Okonkwo liked your post: "New feature dropping soon 👀..."',
                'related_id' => 5,
                'related_type' => 'Article',
                'is_read' => 0,
                'read_at' => null,
                'created_at' => $now->copy()->subDays(2),
                'updated_at' => $now->copy()->subDays(2),
            ],
        ];

        DB::table('Notification')->insert($notifications);

        // ── 9. Messages ───────────────────────────────────────────────────────
        $messages = [
            ['id_uti_1' => 1, 'id_uti_2' => 2, 'date' => $now->copy()->subDays(15)->toDateString(), 'image' => '', 'texte' => 'Kemi! Did you see the new Tulk feature? Let me know what you think 👀'],
            ['id_uti_1' => 2, 'id_uti_2' => 1, 'date' => $now->copy()->subDays(15)->toDateString(), 'image' => '', 'texte' => 'Yes!! I literally just saw it. The profile section is clean 🔥 loving the banner'],
            ['id_uti_1' => 1, 'id_uti_2' => 3, 'date' => $now->copy()->subDays(10)->toDateString(), 'image' => '', 'texte' => 'Chidi you were right about the API caching issue. Fixed it this morning.'],
            ['id_uti_1' => 3, 'id_uti_2' => 1, 'date' => $now->copy()->subDays(10)->toDateString(), 'image' => '', 'texte' => 'Knew it!! Redis + stale TTL is always the culprit. How\'s the rest of it going?'],
            ['id_uti_1' => 1, 'id_uti_2' => 8, 'date' => $now->copy()->subDays(3)->toDateString(),  'image' => '', 'texte' => 'Bro when is the EP dropping?? The whole squad is waiting'],
            ['id_uti_1' => 8, 'id_uti_2' => 1, 'date' => $now->copy()->subDays(3)->toDateString(),  'image' => '', 'texte' => 'End of April 🔥 Will you design the cover art or nah? 😂'],
            ['id_uti_1' => 1, 'id_uti_2' => 6, 'date' => $now->copy()->subDays(5)->toDateString(),  'image' => '', 'texte' => 'Congrats on the seed round again man. Seriously. 47 rejections 🤯'],
            ['id_uti_1' => 6, 'id_uti_2' => 1, 'date' => $now->copy()->subDays(5)->toDateString(),  'image' => '', 'texte' => 'Man it was rough. But here we are 💪 You\'re next. Tulk is going to get there.'],
        ];

        DB::table('Message')->insert($messages);

        // ── 10. Print credentials ─────────────────────────────────────────────
        $this->command->info('');
        $this->command->info('╔══════════════════════════════════════════════════╗');
        $this->command->info('║          ✅  DATABASE SEEDED SUCCESSFULLY         ║');
        $this->command->info('╠══════════════════════════════════════════════════╣');
        $this->command->info('║  YOUR ACCOUNT CREDENTIALS                        ║');
        $this->command->info('║  ──────────────────────────────────────────────  ║');
        $this->command->info('║  Name     :  Lionel Sisso                        ║');
        $this->command->info('║  Email    :  sissolionel@gmail.com                ║');
        $this->command->info('║  Password :  sisso2026                            ║');
        $this->command->info('╠══════════════════════════════════════════════════╣');
        $this->command->info('║  SOCIAL GRAPH SUMMARY                             ║');
        $this->command->info('║  ──────────────────────────────────────────────  ║');
        $this->command->info('║  Total users            : 14                     ║');
        $this->command->info('║  Your direct friends    : 10                     ║');
        $this->command->info('║  People you may know    :  3 (Zainab, Sola,      ║');
        $this->command->info('║                              Ifeanyi)             ║');
        $this->command->info('║  Pending requests to you:  1 (from Sola)         ║');
        $this->command->info('║  Total posts            : 43                     ║');
        $this->command->info('║  Total comments         : 50+                    ║');
        $this->command->info('║  Total likes            : 80+                    ║');
        $this->command->info('║  Total follows          : 40+                    ║');
        $this->command->info('║  Notifications (unread) :  5                     ║');
        $this->command->info('╚══════════════════════════════════════════════════╝');
        $this->command->info('');
        $this->command->info('  All other accounts use password: password123');
        $this->command->info('');
    }
}
