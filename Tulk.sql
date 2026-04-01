-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: Tulk
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Amitie`
--

DROP TABLE IF EXISTS `Amitie`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Amitie` (
  `id_1` int NOT NULL,
  `id_2` int NOT NULL,
  `statut` enum('en attente','ami') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_1`,`id_2`),
  KEY `amitie_id_2_foreign` (`id_2`),
  CONSTRAINT `amitie_id_1_foreign` FOREIGN KEY (`id_1`) REFERENCES `Utilisateur` (`id`),
  CONSTRAINT `amitie_id_2_foreign` FOREIGN KEY (`id_2`) REFERENCES `Utilisateur` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Amitie`
--

LOCK TABLES `Amitie` WRITE;
/*!40000 ALTER TABLE `Amitie` DISABLE KEYS */;
INSERT INTO `Amitie` VALUES (1,1,'en attente','2026-03-31 00:48:14','2026-03-31 00:48:14'),(1,3,'ami','2026-02-24 20:47:07','2026-03-18 20:47:07'),(1,4,'ami','2026-03-10 20:47:07','2026-03-25 20:47:07'),(1,5,'ami','2026-02-14 20:47:07','2026-03-17 20:47:07'),(1,6,'ami','2026-02-20 20:47:07','2026-03-23 20:47:07'),(1,8,'ami','2026-01-29 20:47:07','2026-03-22 20:47:07'),(1,9,'ami','2026-02-20 20:47:07','2026-03-28 20:47:07'),(1,10,'ami','2026-01-31 20:47:07','2026-03-19 20:47:07'),(1,11,'ami','2026-02-19 20:47:07','2026-03-14 20:47:07'),(2,8,'ami','2026-03-08 20:47:07','2026-03-12 20:47:07'),(2,10,'ami','2026-02-23 20:47:07','2026-03-22 20:47:07'),(2,13,'ami','2026-02-03 20:47:07','2026-03-16 20:47:07'),(3,1,'ami','2026-02-27 20:47:07','2026-03-25 20:47:07'),(3,9,'ami','2026-02-27 20:47:07','2026-03-11 20:47:07'),(3,11,'ami','2026-03-02 20:47:07','2026-03-14 20:47:07'),(3,12,'ami','2026-03-07 20:47:07','2026-03-18 20:47:07'),(4,1,'ami','2026-03-08 20:47:07','2026-03-15 20:47:07'),(4,5,'ami','2026-02-12 20:47:07','2026-03-21 20:47:07'),(5,1,'ami','2026-02-09 20:47:07','2026-03-29 20:47:07'),(5,4,'ami','2026-02-26 20:47:07','2026-03-23 20:47:07'),(5,6,'en attente','2026-03-27 20:47:07','2026-03-27 20:47:07'),(6,1,'ami','2026-02-17 20:47:07','2026-03-19 20:47:07'),(6,7,'ami','2026-03-03 20:47:07','2026-03-19 20:47:07'),(7,1,'ami','2026-02-20 20:47:07','2026-03-28 20:47:07'),(7,6,'ami','2026-02-01 20:47:07','2026-03-13 20:47:07'),(7,11,'ami','2026-02-26 20:47:07','2026-03-22 20:47:07'),(7,14,'ami','2026-02-05 20:47:07','2026-03-25 20:47:07'),(8,1,'ami','2026-02-24 20:47:07','2026-03-13 20:47:07'),(8,2,'ami','2026-02-02 20:47:07','2026-03-28 20:47:07'),(8,10,'ami','2026-01-29 20:47:07','2026-03-19 20:47:07'),(8,13,'ami','2026-03-02 20:47:07','2026-03-23 20:47:07'),(9,1,'ami','2026-02-26 20:47:07','2026-03-19 20:47:07'),(9,3,'ami','2026-02-05 20:47:07','2026-03-28 20:47:07'),(9,12,'ami','2026-02-28 20:47:07','2026-03-19 20:47:07'),(10,1,'ami','2026-02-09 20:47:07','2026-03-23 20:47:07'),(10,2,'ami','2026-02-16 20:47:07','2026-03-12 20:47:07'),(10,4,'en attente','2026-03-28 20:47:07','2026-03-28 20:47:07'),(10,8,'ami','2026-02-22 20:47:07','2026-03-11 20:47:07'),(11,1,'ami','2026-02-24 20:47:07','2026-03-22 20:47:07'),(11,3,'ami','2026-01-30 20:47:07','2026-03-17 20:47:07'),(11,7,'ami','2026-02-08 20:47:07','2026-03-25 20:47:07'),(11,14,'ami','2026-02-23 20:47:07','2026-03-15 20:47:07'),(12,3,'ami','2026-03-03 20:47:07','2026-03-12 20:47:07'),(12,6,'en attente','2026-03-25 20:47:07','2026-03-25 20:47:07'),(12,9,'ami','2026-02-14 20:47:07','2026-03-19 20:47:07'),(13,1,'en attente','2026-03-26 20:47:07','2026-03-26 20:47:07'),(13,2,'ami','2026-02-14 20:47:07','2026-03-22 20:47:07'),(13,8,'ami','2026-02-09 20:47:07','2026-03-28 20:47:07'),(14,7,'ami','2026-02-18 20:47:07','2026-03-27 20:47:07'),(14,8,'en attente','2026-03-29 20:47:07','2026-03-29 20:47:07'),(14,11,'ami','2026-03-05 20:47:07','2026-03-11 20:47:07');
/*!40000 ALTER TABLE `Amitie` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Article`
--

DROP TABLE IF EXISTS `Article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Article` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_uti` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `article_id_uti_foreign` (`id_uti`),
  CONSTRAINT `article_id_uti_foreign` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Article`
--

LOCK TABLES `Article` WRITE;
/*!40000 ALTER TABLE `Article` DISABLE KEYS */;
INSERT INTO `Article` VALUES (1,NULL,'Just deployed the first version of Tulk. It\'s rough around the edges but it\'s LIVE. The grind continues 🚀 #buildinpublic #tulk','2026-02-18 20:47:07',1),(2,NULL,'Hot take: backend devs who don\'t care about UX are building half a product. The user experience is YOUR responsibility too. Fight me. 👊','2026-02-28 20:47:07',1),(3,'images/posts/lagos_sunset.jpg','Lagos sunset hits different after a 12-hour coding session. Nothing like this city 🌇 #Lagos','2026-03-10 20:47:07',1),(4,NULL,'Working on the notifications system for Tulk. Real-time stuff is satisfying to build 🔔 Also, who else codes better at night? 🌙','2026-03-20 20:47:07',1),(5,NULL,'New feature dropping soon 👀 Follow relationships + people you may know. It\'s all coming together. #Tulk','2026-03-28 20:47:07',1),(6,'images/posts/kemi_collection.jpg','Finally dropped my Harmattan 2026 collection 🔥🧣 This one was six months in the making. Swipe to see the full looks!','2026-02-20 20:47:07',2),(7,NULL,'Reminder: supporting African designers isn\'t just trendy — it\'s an economic decision. Every naira spent local creates local jobs. Shop wisely! 🛍️','2026-03-05 20:47:07',2),(8,'images/posts/kemi_lekki.jpg','Weekend market run at Lekki. The energy here is unmatched 🌀 Found the most beautiful ankara fabric too 😭❤️','2026-03-16 20:47:07',2),(9,NULL,'Can we normalize paying FULL price for quality African fashion? The undercutting culture is hurting creatives. We deserve to eat too 🍽️','2026-03-25 20:47:07',2),(10,NULL,'Fintech in Nigeria is exploding 📈 We processed more mobile transactions last month than any time in history. The unbanked era is ENDING.','2026-02-22 20:47:07',3),(11,NULL,'Chelsea are so annoying I swear. We buy £80m players and they play like Sunday league. SACK THE COACH. 😤 #CFC','2026-03-08 20:47:07',3),(12,'images/posts/abuja_tech.jpg','Attended the Abuja Tech Summit today. Great conversations about AI adoption in African markets. The future is here and it\'s African 🌍💡','2026-03-18 20:47:07',3),(13,NULL,'Unpopular opinion: most \"AI startups\" in Nigeria aren\'t building AI — they\'re building automation with a ChatGPT API key. Different things entirely.','2026-03-27 20:47:07',3),(14,'images/posts/amara_mural.jpg','Six weeks of work and this mural on Corniche de Dakar is finally done 🎨✨ Every face tells a story of resistance and joy. Art is our loudest language.','2026-02-23 20:47:07',4),(15,NULL,'Baye Fall energy this morning 🟡🔴🟢 Dakar wakes up with a rhythm the whole world should feel. Grateful to be here.','2026-03-09 20:47:07',4),(16,'images/posts/amara_studio.jpg','New canvas series: \"Migrations & Memory\" — exploring how diaspora communities carry home with them. Open studio this Saturday in Dakar! 🖼️','2026-03-22 20:47:07',4),(17,NULL,'Just published my investigation on urban displacement in Dakar. Three years of reporting. Lives changed for \"development.\" Who benefits? 📰 Link in bio.','2026-02-25 20:47:07',5),(18,NULL,'The press freedom index dropped for 4 African nations this year. Journalism is not a crime. Protect your journalists. ✊','2026-03-11 20:47:07',5),(19,NULL,'Interviewing young women in Dakar this week about political participation. The energy is electric. Gen Z is NOT going to be silent. 🔥','2026-03-23 20:47:07',5),(20,NULL,'Closed our seed round 🎉🇬🇭 Six months of pitching, 47 rejections, one yes that changed everything. Accra, we\'re building something big!','2026-02-26 20:47:07',6),(21,'images/posts/kwame_accra.jpg','Accra is becoming a serious startup hub. The infrastructure is improving, talent is staying home, and capital is trickling in. Watch this space 👀','2026-03-12 20:47:07',6),(22,NULL,'Building for Africa means building for context. Low bandwidth, feature phones, inconsistent power. If your product fails in those conditions, it\'s not ready. Period.','2026-03-24 20:47:07',6),(23,NULL,'PSA: Malaria is still the #1 killer in sub-Saharan Africa. We have treatment. We have prevention tools. We lack distribution. This is a logistics problem disguised as a health crisis. 🏥','2026-02-27 20:47:07',7),(24,'images/posts/ngozi_hospital.jpg','24-hour shift done ✅ Tired but fulfilled. The patient who came in critical yesterday is going home healthy today. This is why I do it. 🙏','2026-03-13 20:47:07',7),(25,NULL,'Mental health check: are you drinking water, sleeping enough, and talking to someone you trust? Do all three. Today. Non-negotiable. 💙','2026-03-25 20:47:07',7),(26,'images/posts/bayo_set.jpg','Last night\'s set at Quilox was INSANE 🎧🔊 The crowd was locked in from 11pm to 3am. Lagos, you never disappoint! Next show: April 5th 🔥','2026-03-01 20:47:07',8),(27,NULL,'Produced my first full EP with no samples 🎹 100% original sounds, recorded in my studio. Afrobeats meets Amapiano meets Lagos streets. Dropping soon 🎶','2026-03-14 20:47:07',8),(28,NULL,'Hot debate in the studio today: is Burna Boy the greatest African artist of this generation? I said yes. My guy said Wizkid. Room divided 😂','2026-03-26 20:47:07',8),(29,NULL,'Won the case today 🏆⚖️ Two years of fighting for a community displaced by industrial expansion. Justice isn\'t always fast but today it came. Thank you to everyone who stood with us.','2026-03-02 20:47:07',9),(30,NULL,'Reading through new constitutional amendments. There\'s good, there\'s bad, and there\'s very concerning. Thread coming tomorrow 🧵','2026-03-15 20:47:07',9),(31,NULL,'Hosting a free legal clinic in Kano this Saturday. Every Nigerian deserves to know their rights regardless of income. Spread the word 📢','2026-03-27 20:47:07',9),(32,'images/posts/tunde_farm.jpg','From 12 farmers to 847 in 18 months 🌱 AgriVenture is connecting smallholder farmers to premium markets. The numbers don\'t lie. This is working. 🙌','2026-03-03 20:47:07',10),(33,NULL,'Food security is a national security issue. Nigeria imports what we should be growing. The dependency has to end. #AgriTech #Nigeria','2026-03-17 20:47:07',10),(34,NULL,'Heading to a farmers cooperative in Oyo State tomorrow. Some of the most inspiring humans I\'ve met are smallholder farmers. Resilience personified. 🌾','2026-03-28 20:47:07',10),(35,NULL,'Offshore rig life: 28 days on, 14 days off. The isolation is real but so is the paycheck 😂 Port Harcourt, I\'m coming home soon 🛢️','2026-03-04 20:47:07',11),(36,NULL,'Nigeria\'s oil production is at its highest in years. But where is the prosperity reaching? We need a serious conversation about resource allocation. 🇳🇬','2026-03-19 20:47:07',11),(37,'images/posts/emeka_family.jpg','Home for the holidays 🏡❤️ Nothing beats this. Arsenal won yesterday, jollof is on the fire, and my kids won\'t let me rest for a second. Life is good.','2026-03-29 20:47:07',11),(38,'images/posts/zainab_building.jpg','Phase 1 of the Wuse residential complex is complete 🏗️ Sustainable materials, solar-ready roofing, rainwater harvesting. Architecture can heal communities. #AbujaDev','2026-03-06 20:47:07',12),(39,NULL,'Green architecture isn\'t a luxury for Africa — it\'s a necessity. We have the sun, the wind, the land. Let\'s use them intelligently. 🌞','2026-03-21 20:47:07',12),(40,'images/posts/sola_vlog.jpg','New vlog is up!! 📹 \"48 Hours in Lagos on a Budget\" — I ate, I vibed, I explored and spent under ₦15k. Link in bio! 🔗','2026-03-07 20:47:07',13),(41,NULL,'To every creator who\'s been told they\'re \"too local\" for brand deals: your audience is the brand. Never downplay your culture for their comfort. 🔥','2026-03-24 20:47:07',13),(42,NULL,'\"The function of education is to teach one to think intensively and to think critically.\" — MLK. Miss this being the entire point of schools. 📚','2026-03-08 20:47:07',14),(43,NULL,'My students surprised me with a \"Thank You\" card today. Written in three languages: Igbo, English, and French. Proudest moment of my year so far. 🥹❤️','2026-03-22 20:47:07',14),(44,'images/JU7cPKTAdDY5HQ4gybOBXQ2SC3e6pKszGbR52rO8.jpg','hey oo','2026-03-31 22:58:10',1);
/*!40000 ALTER TABLE `Article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Commentaire`
--

DROP TABLE IF EXISTS `Commentaire`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Commentaire` (
  `id` int NOT NULL AUTO_INCREMENT,
  `texte` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_arti` int NOT NULL,
  `id_uti` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `commentaire_id_arti_foreign` (`id_arti`),
  KEY `commentaire_id_uti_foreign` (`id_uti`),
  CONSTRAINT `commentaire_id_arti_foreign` FOREIGN KEY (`id_arti`) REFERENCES `Article` (`id`),
  CONSTRAINT `commentaire_id_uti_foreign` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Commentaire`
--

LOCK TABLES `Commentaire` WRITE;
/*!40000 ALTER TABLE `Commentaire` DISABLE KEYS */;
INSERT INTO `Commentaire` VALUES (1,'Let\'s GOOO Lionel!! I\'ve been waiting for this. You\'ve been talking about Tulk for months 😂🔥','2026-02-19 20:47:07',1,2),(2,'Broooo it\'s live?! Congrats man, this is a big deal 🙌','2026-02-19 20:47:07',1,8),(3,'Finally! Now fix the notification bug 😅 jk congrats bro','2026-02-20 20:47:07',1,3),(4,'This is FACTS. I\'ve been trying to tell my backend team the same thing for months. UX is everyone\'s job.','2026-03-01 20:47:07',2,10),(5,'Strong take. I partially agree — but good UX also needs dedicated UX people. Both/and, not either/or.','2026-03-01 20:47:07',2,6),(6,'The overlap between backend thinking and user empathy is where the best devs live. 💯','2026-03-02 20:47:07',2,11),(7,'Lagos sunset is genuinely one of the most underrated views on earth 😍','2026-03-11 20:47:07',3,2),(8,'This is beautiful! When was this taken?','2026-03-11 20:47:07',3,7),(9,'Night coding hits different with the right playlist. Bayo should make a \"coding mode\" mix 😂','2026-03-21 20:47:07',4,3),(10,'Chidi said it first but yeah... I can make that playlist 🎧 say less','2026-03-21 20:47:07',4,8),(11,'The \"people you may know\" feature is SO useful. Can\'t wait! 👀','2026-03-29 20:47:07',5,9),(12,'Every time I think Tulk is done you drop another feature 😭 keep building!','2026-03-29 20:47:07',5,4),(13,'Kemi this collection is FIRE 🔥 the indigo pieces especially are stunning','2026-02-21 20:47:07',6,1),(14,'My sister needs to see this asap 👀 dropping the link right now','2026-02-21 20:47:07',6,8),(15,'Six months of work and it shows. Quality is undeniable 🙌','2026-02-22 20:47:07',6,10),(16,'100% this. Every time I buy local I feel good about it in multiple ways. Economic and cultural.','2026-03-06 20:47:07',7,1),(17,'The argument for buying local African products needs to be louder in media. Journalists, we need to push this.','2026-03-06 20:47:07',7,5),(18,'People out here bargaining ₦3000 for a hand-stitched piece that took 8 hours. Unacceptable.','2026-03-26 20:47:07',9,8),(19,'The devaluation of creative work is a whole topic. We need more conversations like this.','2026-03-26 20:47:07',9,1),(20,'The mobile money revolution in West Africa is real. The infrastructure story is finally catching up.','2026-02-23 20:47:07',10,1),(21,'Ghana is seeing the same trends. Africa is leapfrogging traditional banking entirely. Exciting times 🇬🇭','2026-02-23 20:47:07',10,6),(22,'Chelsea banter aside, the whole league has been chaotic this season 😂','2026-03-09 20:47:07',11,1),(23,'Arsenal fan here 🔴 this is your problem every season and yet you keep buying expensive midfielders 😭','2026-03-09 20:47:07',11,11),(24,'Wish I could\'ve attended! How was the panel on healthcare AI?','2026-03-19 20:47:07',12,1),(25,'The healthcare AI discussion was so needed. Did they address rural deployment challenges?','2026-03-19 20:47:07',12,7),(26,'The \"AI wrapper\" startup problem is global but feels especially pronounced here because the VC hype cycle arrived late. Good observation.','2026-03-28 20:47:07',13,6),(27,'Agritech space has this issue too. \"AI-powered farming\" when it\'s just an Excel sheet with a nice UI 😭','2026-03-28 20:47:07',13,10),(28,'Amara I walked past this yesterday and stopped for 10 minutes. It\'s powerful. Dakar is lucky to have you. 🎨','2026-02-24 20:47:07',14,5),(29,'The detail in this is incredible from the photos alone. I need to see it in person someday.','2026-02-25 20:47:07',14,1),(30,'I\'ll be there Saturday! 🙌 Can\'t wait to see the new series in person','2026-03-23 20:47:07',16,5),(31,'Thanks Fatou! 💛 space is open 10am–6pm. Bring friends!','2026-03-23 20:47:07',16,4),(32,'The energy at Quilox is always different when you\'re on 🔥 I was there bro, crowd was fully locked','2026-03-02 20:47:07',26,1),(33,'I missed it but my friend sent me a video and I regretted staying home 😭 next one I\'m there!','2026-03-02 20:47:07',26,2),(34,'Original EP?? No samples?? Bayo you really said \"I am the sample\" 😭🔥','2026-03-15 20:47:07',27,1),(35,'This is the one we\'ve been waiting for!! Release date?? 👀','2026-03-15 20:47:07',27,2),(36,'Burna Boy is the answer and the argument is closed. Sorry Wizkid fans 😅','2026-03-27 20:47:07',28,1),(37,'You\'re both wrong, it\'s Fela and the conversation ended in 1980 💀','2026-03-27 20:47:07',28,10),(38,'847 farmers!! Tunde this is the impact we need to see more of. Nigerian agriculture has always had the potential.','2026-03-04 20:47:07',32,1),(39,'These numbers are real proof of concept. Ghana is watching and would love a version of this 👀','2026-03-04 20:47:07',32,6),(40,'Import dependency is the silent killer of our industrial capacity. The conversation needs more volume.','2026-03-18 20:47:07',33,1),(41,'Oyo State farmers are incredible. Resilience is in the DNA 🌾','2026-03-29 20:47:07',34,2),(42,'Resource allocation is the conversation Nigeria needs to be having loudly. The numbers exist. Where do they go?','2026-03-20 20:47:07',36,1),(43,'Transparency in oil revenue was never a strong suit. Needs structural reform, not just good intentions.','2026-03-20 20:47:07',36,3),(44,'Family time is sacred. Enjoy every second Emeka! ❤️ Also Arsenal won? Barely 😂','2026-03-30 20:47:07',37,7),(45,'The image of you and the kids is everything 🥹 also jollof from Port Harcourt hits DIFFERENT','2026-03-30 20:47:07',37,1),(46,'Logistics and last-mile distribution — the unsung crisis in African health. Thank you for framing it this way Dr Ngozi.','2026-02-28 20:47:07',23,1),(47,'In PH the situation is improving but slowly. The community health workers program is making a real difference though.','2026-02-28 20:47:07',23,11),(48,'Mental health check noted and completed ✅ Thank you Dr Ngozi, we need this reminder often.','2026-03-26 20:47:07',25,1),(49,'This. Especially the \"talk to someone\" part. People underestimate the power of just being heard.','2026-03-26 20:47:07',25,9),(50,'TWO YEARS! Aisha this is incredible persistence. So proud of you and this win. The community deserved justice. ✊','2026-03-03 20:47:07',29,1),(51,'This is the kind of legal work that actually matters. Congratulations Aisha, truly. 🏆','2026-03-03 20:47:07',29,3),(52,'Free legal clinic is so needed. Wish more lawyers did this. Sharing everywhere!','2026-03-28 20:47:07',31,1),(53,'Could we do a joint event? Legal rights + health rights? Kano could really benefit from this combo.','2026-03-28 20:47:07',31,7),(54,'KWAME!!! 47 rejections and you kept going. This is the entrepreneurship story that needs to be told. 🎉','2026-02-27 20:47:07',20,1),(55,'The rejection story is important. People only see the yes. Huge congratulations 🙌','2026-02-27 20:47:07',20,10),(56,'Low-bandwidth design is so underrated in product discussions. Building for Africa means building for real Africa, not demo conditions.','2026-03-25 20:47:07',22,3),(57,'This is my north star when building Tulk. Every feature tested on a 3G connection first.','2026-03-25 20:47:07',22,1),(58,'i love my article !!','2026-03-31 22:58:30',44,1);
/*!40000 ALTER TABLE `Commentaire` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Follow`
--

DROP TABLE IF EXISTS `Follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Follow` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `follow_follower_id_following_id_unique` (`follower_id`,`following_id`),
  KEY `follow_following_id_foreign` (`following_id`),
  CONSTRAINT `follow_follower_id_foreign` FOREIGN KEY (`follower_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `follow_following_id_foreign` FOREIGN KEY (`following_id`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Follow`
--

LOCK TABLES `Follow` WRITE;
/*!40000 ALTER TABLE `Follow` DISABLE KEYS */;
INSERT INTO `Follow` VALUES (2,1,3,'2026-02-10 20:47:07'),(3,1,4,'2026-02-13 20:47:07'),(4,1,5,'2026-02-14 20:47:07'),(5,1,6,'2026-02-18 20:47:07'),(7,1,8,'2026-02-23 20:47:07'),(8,1,9,'2026-02-28 20:47:07'),(9,1,10,'2026-03-05 20:47:07'),(10,1,11,'2026-03-10 20:47:07'),(12,3,1,'2026-02-11 20:47:07'),(13,4,1,'2026-02-14 20:47:07'),(14,5,1,'2026-02-15 20:47:07'),(15,6,1,'2026-02-19 20:47:07'),(16,7,1,'2026-02-21 20:47:07'),(17,8,1,'2026-02-24 20:47:07'),(18,9,1,'2026-03-01 20:47:07'),(19,10,1,'2026-03-06 20:47:07'),(20,11,1,'2026-03-11 20:47:07'),(21,2,8,'2026-02-28 20:47:07'),(22,8,2,'2026-03-01 20:47:07'),(23,2,10,'2026-03-05 20:47:07'),(24,10,2,'2026-03-06 20:47:07'),(25,3,11,'2026-03-08 20:47:07'),(26,11,3,'2026-03-09 20:47:07'),(27,4,5,'2026-03-10 20:47:07'),(28,5,4,'2026-03-10 20:47:07'),(29,6,7,'2026-03-12 20:47:07'),(30,7,11,'2026-03-15 20:47:07'),(31,11,7,'2026-03-16 20:47:07'),(32,8,10,'2026-03-20 20:47:07'),(33,10,8,'2026-03-21 20:47:07'),(34,12,3,'2026-03-18 20:47:07'),(35,3,12,'2026-03-19 20:47:07'),(36,12,9,'2026-03-20 20:47:07'),(37,9,12,'2026-03-20 20:47:07'),(38,13,2,'2026-03-22 20:47:07'),(39,2,13,'2026-03-23 20:47:07'),(40,13,8,'2026-03-24 20:47:07'),(41,8,13,'2026-03-24 20:47:07'),(42,14,7,'2026-03-25 20:47:07'),(43,7,14,'2026-03-25 20:47:07'),(44,14,11,'2026-03-26 20:47:07'),(45,11,14,'2026-03-27 20:47:07'),(46,1,7,'2026-03-30 21:27:16');
/*!40000 ALTER TABLE `Follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Liker`
--

DROP TABLE IF EXISTS `Liker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Liker` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` text COLLATE utf8mb4_unicode_ci,
  `id_uti` int NOT NULL,
  `id_arti` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `liker_id_uti_foreign` (`id_uti`),
  KEY `liker_id_arti_foreign` (`id_arti`),
  CONSTRAINT `liker_id_arti_foreign` FOREIGN KEY (`id_arti`) REFERENCES `Article` (`id`),
  CONSTRAINT `liker_id_uti_foreign` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Liker`
--

LOCK TABLES `Liker` WRITE;
/*!40000 ALTER TABLE `Liker` DISABLE KEYS */;
INSERT INTO `Liker` VALUES (1,'like',2,1),(2,'like',3,1),(3,'like',8,1),(4,'like',10,1),(5,'like',7,1),(6,'like',4,2),(7,'like',6,2),(8,'like',11,2),(9,'like',9,2),(10,'like',2,3),(11,'like',5,3),(12,'like',7,3),(13,'like',8,3),(14,'like',3,4),(15,'like',8,4),(16,'like',10,4),(17,'like',6,5),(18,'like',9,5),(19,'like',2,5),(20,'like',11,5),(21,'like',1,6),(22,'like',8,6),(23,'like',10,6),(24,'love',5,6),(25,'like',7,6),(26,'like',1,7),(27,'like',5,7),(28,'like',4,7),(29,'like',1,8),(30,'like',8,8),(31,'like',1,9),(32,'like',8,9),(33,'like',4,9),(34,'like',1,10),(35,'like',6,10),(36,'like',10,10),(37,'haha',1,11),(38,'haha',11,11),(39,'like',1,12),(40,'like',7,12),(41,'like',9,12),(42,'like',1,13),(43,'like',6,13),(44,'like',10,13),(45,'love',5,14),(46,'like',1,14),(47,'love',2,14),(48,'like',7,14),(49,'like',1,15),(50,'like',5,15),(51,'love',5,16),(52,'like',1,16),(53,'like',4,16),(54,'like',4,17),(55,'like',1,17),(56,'like',9,17),(57,'like',7,17),(58,'like',1,18),(59,'like',9,18),(60,'like',4,19),(61,'like',1,19),(62,'like',1,20),(63,'like',10,20),(64,'like',3,20),(65,'like',6,20),(66,'like',1,21),(67,'like',3,21),(68,'like',1,22),(69,'like',3,22),(70,'like',1,23),(71,'like',11,23),(72,'like',9,23),(73,'like',3,23),(74,'love',1,24),(75,'love',7,24),(76,'like',11,24),(77,'like',1,25),(78,'like',9,25),(79,'like',3,25),(80,'like',4,25),(81,'like',1,26),(82,'like',2,26),(83,'like',10,26),(84,'like',3,26),(85,'love',1,27),(86,'love',2,27),(87,'like',10,27),(88,'haha',1,28),(89,'haha',10,28),(90,'like',1,29),(91,'like',3,29),(92,'like',7,29),(93,'like',9,29),(94,'like',1,30),(95,'like',3,30),(96,'like',1,31),(97,'like',7,31),(98,'like',1,32),(99,'like',6,32),(100,'like',2,32),(101,'like',10,32),(102,'like',1,33),(103,'like',6,33),(104,'like',1,34),(105,'like',2,34),(106,'haha',1,35),(107,'like',3,35),(108,'haha',7,35),(109,'like',1,36),(110,'like',3,36),(111,'like',9,36),(112,'love',1,37),(113,'love',7,37),(114,'like',3,37),(115,'like',3,38),(116,'like',9,38),(117,'like',3,39),(118,'like',2,40),(119,'like',8,40),(120,'like',2,41),(121,'like',8,41),(122,'like',7,42),(123,'like',11,42),(124,'love',7,43),(125,'love',11,43),(126,NULL,1,44);
/*!40000 ALTER TABLE `Liker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Message`
--

DROP TABLE IF EXISTS `Message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `texte` text COLLATE utf8mb4_unicode_ci,
  `id_uti_1` int NOT NULL,
  `id_uti_2` int NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `message_id_uti_1_foreign` (`id_uti_1`),
  KEY `message_id_uti_2_foreign` (`id_uti_2`),
  CONSTRAINT `message_id_uti_1_foreign` FOREIGN KEY (`id_uti_1`) REFERENCES `Utilisateur` (`id`),
  CONSTRAINT `message_id_uti_2_foreign` FOREIGN KEY (`id_uti_2`) REFERENCES `Utilisateur` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Message`
--

LOCK TABLES `Message` WRITE;
/*!40000 ALTER TABLE `Message` DISABLE KEYS */;
INSERT INTO `Message` VALUES (1,'2026-03-15','','Kemi! Did you see the new Tulk feature? Let me know what you think 👀',1,2,0),(2,'2026-03-15','','Yes!! I literally just saw it. The profile section is clean 🔥 loving the banner',2,1,0),(3,'2026-03-20','','Chidi you were right about the API caching issue. Fixed it this morning.',1,3,0),(4,'2026-03-20','','Knew it!! Redis + stale TTL is always the culprit. How\'s the rest of it going?',3,1,1),(5,'2026-03-27','','Bro when is the EP dropping?? The whole squad is waiting',1,8,0),(6,'2026-03-27','','End of April 🔥 Will you design the cover art or nah? 😂',8,1,1),(7,'2026-03-25','','Congrats on the seed round again man. Seriously. 47 rejections 🤯',1,6,0),(8,'2026-03-25','','Man it was rough. But here we are 💪 You\'re next. Tulk is going to get there.',6,1,0),(9,'2026-03-31','images/messages/1774921666_1654939002154.jpg','seeee',1,8,0),(10,'2026-03-31','images/messages/1774922147_20240209_144833.jpg','okkayyyy',1,8,0),(11,'2026-04-01',NULL,'wy',1,3,0),(12,'2026-04-01',NULL,'hywww\\',1,3,0);
/*!40000 ALTER TABLE `Message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notification`
--

DROP TABLE IF EXISTS `Notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notification` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_uti` int NOT NULL,
  `id_uti_from` int DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtype` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `related_id` int DEFAULT NULL,
  `related_type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` json DEFAULT NULL,
  `priority` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'normal',
  `channel` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'both',
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `email_sent` tinyint(1) NOT NULL DEFAULT '0',
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_id_uti_from_foreign` (`id_uti_from`),
  KEY `notification_id_uti_is_read_index` (`id_uti`,`is_read`),
  KEY `notification_type_created_at_index` (`type`,`created_at`),
  CONSTRAINT `notification_id_uti_foreign` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notification_id_uti_from_foreign` FOREIGN KEY (`id_uti_from`) REFERENCES `Utilisateur` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
INSERT INTO `Notification` VALUES (1,1,2,'like','post_like','Kemi liked your post','Kemi Adeyemi liked your post: \"Just deployed the first version of Tulk...\"',1,'Article',NULL,'normal','both',1,0,'2026-02-20 20:47:07','2026-02-19 20:47:07','2026-02-20 20:47:07'),(2,1,8,'comment','post_comment','Bayo commented on your post','Bayo Ogundimu: \"Broooo it\'s live?! Congrats man, this is a big deal 🙌\"',1,'Article',NULL,'normal','both',1,0,'2026-02-20 20:47:07','2026-02-19 20:47:07','2026-02-20 20:47:07'),(3,1,10,'like','post_like','Tunde liked your post','Tunde Adebayo liked your post: \"Hot take: backend devs who don\'t care about UX...\"',2,'Article',NULL,'normal','both',1,0,'2026-03-02 20:47:07','2026-03-01 20:47:07','2026-03-02 20:47:07'),(4,1,7,'comment','post_comment','Ngozi commented on your post','Ngozi Eze: \"This is beautiful! When was this taken?\"',3,'Article',NULL,'normal','both',1,0,'2026-03-12 20:47:07','2026-03-11 20:47:07','2026-03-12 20:47:07'),(5,1,9,'like','post_like','Aisha liked your post','Aisha Bello liked your post: \"Working on the notifications system for Tulk...\"',4,'Article',NULL,'normal','both',0,0,NULL,'2026-03-21 20:47:07','2026-03-21 20:47:07'),(6,1,4,'comment','post_comment','Amara commented on your post','Amara Diallo: \"Every time I think Tulk is done you drop another feature 😭 keep building!\"',5,'Article',NULL,'normal','both',0,0,NULL,'2026-03-29 20:47:07','2026-03-29 20:47:07'),(7,1,6,'profile_like',NULL,'Kwame liked your profile','Kwame Mensah liked your profile.',1,'Utilisateur',NULL,'low','in_app',0,0,NULL,'2026-03-15 20:47:07','2026-03-15 20:47:07'),(8,1,11,'follow',NULL,'Emeka started following you','Emeka Nwosu started following you.',1,'Utilisateur',NULL,'low','in_app',0,0,NULL,'2026-03-11 20:47:07','2026-03-11 20:47:07'),(9,1,13,'friend_request','incoming','Sola sent you a friend request','Sola Adesanya sent you a friend request. You may know them through Kemi or Bayo.',13,'Utilisateur',NULL,'high','both',0,0,NULL,'2026-03-26 20:47:07','2026-03-26 20:47:07'),(10,1,3,'like','post_like','Chidi liked your post','Chidi Okonkwo liked your post: \"New feature dropping soon 👀...\"',5,'Article',NULL,'normal','both',0,0,NULL,'2026-03-28 20:47:07','2026-03-28 20:47:07'),(11,7,1,'friend','friend_removed','Ami supprimé','Lionel Sisso n\'est plus dans votre liste d\'amis.',1,'App\\Models\\Utilisateur','{\"friend_id\": 1, \"friend_name\": \"Lionel Sisso\"}','low','in_app',0,0,NULL,'2026-03-30 21:02:29','2026-03-30 21:02:29'),(12,7,1,'friend','friend_removed','Ami supprimé','Lionel Sisso n\'est plus dans votre liste d\'amis.',1,'App\\Models\\Utilisateur','{\"friend_id\": 1, \"friend_name\": \"Lionel Sisso\"}','low','in_app',0,0,NULL,'2026-03-30 21:07:57','2026-03-30 21:07:57'),(13,7,1,'friend','friend_removed','Ami supprimé','Lionel Sisso n\'est plus dans votre liste d\'amis.',1,'App\\Models\\Utilisateur','{\"friend_id\": 1, \"friend_name\": \"Lionel Sisso\"}','low','in_app',0,0,NULL,'2026-03-30 21:22:26','2026-03-30 21:22:26'),(14,7,1,'follow','started_following','Nouveau follower! 👥','Lionel Sisso vous suit maintenant.',1,'App\\Models\\Utilisateur','{\"follower_id\": 1, \"follower_name\": \"Lionel Sisso\", \"follower_image\": \"images/59IOh1a7TXL4ZbJJwUeaOVDLAqvy8VekFejZIWXn.png\"}','normal','in_app',0,0,NULL,'2026-03-30 21:27:16','2026-03-30 21:27:16'),(15,7,1,'friend','friend_removed','Ami supprimé','Lionel Sisso n\'est plus dans votre liste d\'amis.',1,'App\\Models\\Utilisateur','{\"friend_id\": 1, \"friend_name\": \"Lionel Sisso\"}','low','in_app',0,0,NULL,'2026-03-30 21:27:20','2026-03-30 21:27:20'),(16,7,1,'profile_like','profile_liked','Nouveau like sur votre profil! ❤️','Lionel Sisso a aimé votre profil.',1,'App\\Models\\Utilisateur','{\"liker_id\": 1, \"liker_name\": \"Lionel Sisso\", \"liker_image\": \"images/59IOh1a7TXL4ZbJJwUeaOVDLAqvy8VekFejZIWXn.png\"}','normal','in_app',0,0,NULL,'2026-03-30 21:40:31','2026-03-30 21:40:31'),(17,15,NULL,'welcome','welcome','Bienvenue sur Tulk! 🎉','Nous sommes ravis de vous accueillir sur notre plateforme. Commencez à explorer et à connecter avec vos amis!',NULL,NULL,'{\"user_name\": \"sisso lionel\", \"onboarding_steps\": [\"Complétez votre profil\", \"Ajoutez une photo\", \"Trouvez des amis\", \"Créez votre premier post\"]}','critical','both',0,1,NULL,'2026-04-01 07:26:19','2026-04-01 07:26:25');
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ProfileLike`
--

DROP TABLE IF EXISTS `ProfileLike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ProfileLike` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_uti` int NOT NULL,
  `id_uti_profile` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profilelike_id_uti_id_uti_profile_unique` (`id_uti`,`id_uti_profile`),
  KEY `profilelike_id_uti_profile_foreign` (`id_uti_profile`),
  CONSTRAINT `profilelike_id_uti_foreign` FOREIGN KEY (`id_uti`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `profilelike_id_uti_profile_foreign` FOREIGN KEY (`id_uti_profile`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ProfileLike`
--

LOCK TABLES `ProfileLike` WRITE;
/*!40000 ALTER TABLE `ProfileLike` DISABLE KEYS */;
INSERT INTO `ProfileLike` VALUES (1,2,1,'2026-02-28 20:47:07'),(2,3,1,'2026-03-02 20:47:07'),(3,8,1,'2026-03-05 20:47:07'),(4,10,1,'2026-03-10 20:47:07'),(5,6,1,'2026-03-15 20:47:07'),(6,7,1,'2026-03-20 20:47:07'),(7,1,2,'2026-03-01 20:47:07'),(8,1,4,'2026-03-08 20:47:07'),(10,1,9,'2026-03-18 20:47:07'),(11,1,6,'2026-03-22 20:47:07'),(12,8,2,'2026-03-10 20:47:07'),(13,2,8,'2026-03-12 20:47:07'),(14,10,2,'2026-03-15 20:47:07'),(15,4,5,'2026-03-16 20:47:07'),(16,5,4,'2026-03-17 20:47:07'),(17,11,3,'2026-03-18 20:47:07'),(18,3,11,'2026-03-19 20:47:07'),(19,7,6,'2026-03-20 20:47:07'),(20,9,3,'2026-03-21 20:47:07'),(21,10,8,'2026-03-23 20:47:07'),(22,12,3,'2026-03-25 20:47:07'),(23,3,12,'2026-03-26 20:47:07'),(24,13,2,'2026-03-27 20:47:07'),(25,14,7,'2026-03-28 20:47:07'),(26,7,14,'2026-03-29 20:47:07'),(27,1,7,'2026-03-30 21:40:31');
/*!40000 ALTER TABLE `ProfileLike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Utilisateur`
--

DROP TABLE IF EXISTS `Utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` text COLLATE utf8mb4_unicode_ci,
  `role` enum('admin','mod','user') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` text COLLATE utf8mb4_unicode_ci,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sexe` enum('M','F') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mdp` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_feed_view` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Utilisateur`
--

LOCK TABLES `Utilisateur` WRITE;
/*!40000 ALTER TABLE `Utilisateur` DISABLE KEYS */;
INSERT INTO `Utilisateur` VALUES (1,'Sisso','Lionel','user','images/59IOh1a7TXL4ZbJJwUeaOVDLAqvy8VekFejZIWXn.png','Software dev 🚀 | Building Tulk from Lagos | Coffee addict ☕','Lagos, Nigeria','https://github.com/lionelsisso','banners/Jpi85aJJHNprT4xLF5G49qOWuEWWmnSTGQUGBWa7.jpg','2025-09-30 20:47:07','M','$2y$12$WkXMtOK2YHw4vjuBeUvUW.2uwGyj.UJb2N18PjmIE0mbYI3IDWo5a','sissolionel@gmail.com','2026-04-01 08:03:03'),(2,'Adeyemi','Kemi','user','images/avatars/kemi.jpg','Fashion designer 👗 | Afrobeats lover | Lagos Island girl 💛','Lagos, Nigeria','https://kemistyle.ng','images/banners/kemi_banner.jpg','2025-10-30 20:47:07','F','$2y$12$EnniZ4jbnoHwt6oGD8T2geZO6yAIrVNp8QgOhRAxF5vfMZfGEFM1W','kemi.adeyemi@gmail.com','2026-03-31 17:13:40'),(3,'Okonkwo','Chidi','user','images/avatars/chidi.jpg','Tech bro in Abuja 💻 | Fintech | Chelsea FC 🔵','Abuja, Nigeria',NULL,'images/banners/chidi_banner.jpg','2025-10-30 20:47:07','M','$2y$12$Q8cSFm8dcXXuAG3YJH5fD.07VWdV00oAA6RSp.Afs1lMshKpnisd2','chidi.okonkwo@gmail.com','2026-03-31 17:13:40'),(4,'Diallo','Amara','user','images/avatars/amara.jpg','Artiste sénégalaise 🎨 | Dakar vibes | Proud African 🌍','Dakar, Senegal','https://amaradiallo.art','images/banners/amara_banner.jpg','2025-11-30 20:47:07','F','$2y$12$I3KaVK2UNIPtdrN18R4p0.Bj9Ng8afVYDr7Db02snWkKyLvbSgKeu','amara.diallo@gmail.com','2026-03-31 17:13:40'),(5,'Ndiaye','Fatou','user','images/avatars/fatou.jpg','Journaliste | Féministe | Dakar 🇸🇳 | Words matter ✍️','Dakar, Senegal',NULL,'images/banners/fatou_banner.jpg','2025-11-30 20:47:07','F','$2y$12$qZUG6Id05qrP101qQSKN8evWmxtvxfiKgzscuiQ6LLB0nHNw0m3mK','fatou.ndiaye@gmail.com','2026-03-31 17:13:40'),(6,'Mensah','Kwame','user','images/avatars/kwame.jpg','Entrepreneur 🇬🇭 | Accra hustler | Pan-Africanist 🌍','Accra, Ghana','https://kwamemensah.com','images/banners/kwame_banner.jpg','2025-12-30 20:47:07','M','$2y$12$GEAuMQPjcWHfsuXe0mMP4edi82yQlL9zS6YJuFSni16KOfLrW9usy','kwame.mensah@gmail.com','2026-03-31 17:13:40'),(7,'Eze','Ngozi','user','images/avatars/ngozi.jpg','Doctor 👩‍⚕️ | Health advocate | Enugu proud | God first 🙏','Enugu, Nigeria',NULL,'images/banners/ngozi_banner.jpg','2025-12-30 20:47:07','F','$2y$12$kbMG33lYYb6j/teoJcVO9uf.54V.0KlKGMJKgSDLyuJmjB1osJ.Zm','ngozi.eze@gmail.com','2026-03-31 17:13:40'),(8,'Ogundimu','Bayo','user','images/avatars/bayo.jpg','DJ Bayo 🎧 | Lagos nightlife | Music producer | Afrobeats > everything','Lagos, Nigeria','https://djbayo.com','images/banners/bayo_banner.jpg','2026-01-30 20:47:07','M','$2y$12$PWYXPPNITMNU9NhRHlDm1Oe6MdQpCGy1OczKcbgadwSbIzrK7wo/.','bayo.ogundimu@gmail.com','2026-03-31 17:13:40'),(9,'Bello','Aisha','user','images/avatars/aisha.jpg','Lawyer ⚖️ | Human rights | Kano girl | Islam & progress ☪️','Kano, Nigeria',NULL,'images/banners/aisha_banner.jpg','2026-01-30 20:47:07','F','$2y$12$JdLXlO9CgHJ9Fpco3UouFeZ7sPOST6ayd9NRCZXF3Qs5.rqm7Aoka','aisha.bello@gmail.com','2026-03-31 17:13:40'),(10,'Adebayo','Tunde','user','images/avatars/tunde.jpg','Agritech founder 🌱 | Ibadan raised | Feeding Africa one startup at a time','Ibadan, Nigeria','https://agriventure.ng','images/banners/tunde_banner.jpg','2026-03-02 20:47:07','M','$2y$12$NUycspws.48OJJvBImbxj.D2/mcmD7js7S8uR6DjbSr9A4bXcmEpG','tunde.adebayo@gmail.com','2026-03-31 17:13:40'),(11,'Nwosu','Emeka','user','images/avatars/emeka.jpg','Petroleum engineer ⛽ | Port Harcourt | Arsenal 🔴 | Family man 👨‍👩‍👦','Port Harcourt, Nigeria',NULL,'images/banners/emeka_banner.jpg','2026-03-02 20:47:07','M','$2y$12$igRUfYfot61bFmBdAQbGgOwP67A.ntxP91dkCucgDSd4NZ./YNyN6','emeka.nwosu@gmail.com','2026-03-31 17:13:40'),(12,'Usman','Zainab','user','images/avatars/zainab.jpg','Architect 🏛️ | Abuja city planner | Sustainable design enthusiast 🌿','Abuja, Nigeria','https://zainabdesigns.com','images/banners/zainab_banner.jpg','2026-03-09 20:47:07','F','$2y$12$0FnS3EFmWMbxiVu7.9CkkeTPWhxgQm.3yQbvzNx3GX4BJTRdRQnMm','zainab.usman@gmail.com','2026-03-31 17:13:40'),(13,'Adesanya','Sola','user','images/avatars/sola.jpg','Content creator 📱 | Lagos life | Brand deals 📩 sola@creator.ng','Lagos, Nigeria','https://solacreates.ng','images/banners/sola_banner.jpg','2026-03-16 20:47:07','M','$2y$12$QMv4aktAFL3/Esx7/BO7teJql4VaoMXu8WPPCeET4353zbzaK7RP6','sola.adesanya@gmail.com','2026-03-31 17:13:40'),(14,'Obi','Ifeanyi','user','images/avatars/ifeanyi.jpg','Teacher 📚 | Enugu state | Lover of books and good jollof 🍛','Enugu, Nigeria',NULL,'images/banners/ifeanyi_banner.jpg','2026-03-23 20:47:07','M','$2y$12$jvzGu8O.Qnhz3A5oJYfLyO3C.A9qeE9eELSu1toj7BcfYd7jR3k6i','ifeanyi.obi@gmail.com','2026-03-31 17:13:40'),(15,'lionel','sisso','user','images/fprF9ePgdWPiW6Px1PpJ.jpg',NULL,NULL,NULL,NULL,'2026-04-01 08:26:19',NULL,'$2y$12$ITR1QdxGDaXZUFPsg3MRuOLO/nre0vtupx4N5ScHpsOM3.Xk0avNe','lionelmauto@gmail.com','2026-04-01 08:26:19');
/*!40000 ALTER TABLE `Utilisateur` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloquages`
--

DROP TABLE IF EXISTS `bloquages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bloquages` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `id_bloqueur` int NOT NULL,
  `id_bloque` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bloquages_id_bloqueur_id_bloque_unique` (`id_bloqueur`,`id_bloque`),
  KEY `bloquages_id_bloque_foreign` (`id_bloque`),
  CONSTRAINT `bloquages_id_bloque_foreign` FOREIGN KEY (`id_bloque`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bloquages_id_bloqueur_foreign` FOREIGN KEY (`id_bloqueur`) REFERENCES `Utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloquages`
--

LOCK TABLES `bloquages` WRITE;
/*!40000 ALTER TABLE `bloquages` DISABLE KEYS */;
INSERT INTO `bloquages` VALUES (1,1,2,'2026-03-31 01:29:34','2026-03-31 01:29:34');
/*!40000 ALTER TABLE `bloquages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (18,'0001_01_01_000000_create_users_table',1),(19,'0001_01_01_000001_create_cache_table',1),(20,'0001_01_01_000002_create_jobs_table',1),(21,'2025_11_30_201829_create_utilisateur_table',1),(22,'2025_11_30_201909_create_article_table',1),(23,'2025_11_30_201947_create_commentaire_table',1),(24,'2025_11_30_202011_create_amitie_table',1),(25,'2025_11_30_202115_create_message_table',1),(26,'2025_11_30_202142_create_liker_table',1),(27,'2025_11_30_202329_add_foreign_keys_to_french_tables',1),(28,'2025_11_30_213903_create_personal_access_tokens_table',1),(29,'2026_03_21_160427_add_profile_fields_to_utilisateur',1),(30,'2026_03_21_163006_add_timestamps_to_amitie_table',1),(31,'2026_03_21_174717_create_notifications_table',1),(32,'2026_03_21_184537_add_subtype_to_notifications',1),(33,'2026_03_21_193119_create_profile_likes_table',1),(34,'2026_03_21_193252_create_follows_table',1),(35,'2026_03_31_021711_create_bloquages_table',2),(36,'2026_03_31_163235_add_is_read_to_message_table',3),(37,'2026_03_31_171325_add_last_feed_view_to_utilisateur',4),(38,'2026_04_01_000755_make_columns_nullable_in_message_table',5);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\Utilisateur',1,'auth_token','03e9c1c620783449dfbadf07f640d08fccc6816a90400928b2545e75f6a29bba','[\"*\"]','2026-04-01 00:10:12',NULL,'2026-03-30 20:47:29','2026-04-01 00:10:12'),(2,'App\\Models\\Utilisateur',1,'auth_token','e3737e98858221e2a0bbe2fa241f4d2365e8e24a761c9dc1205b962dba8bafa2','[\"*\"]','2026-04-01 00:16:25',NULL,'2026-04-01 00:01:35','2026-04-01 00:16:25'),(3,'App\\Models\\Utilisateur',1,'auth_token','12ab045f41b979e3a5bff03ed9a976ed9897f0a138f72d19deb45680d31a93e7','[\"*\"]','2026-04-01 00:18:47',NULL,'2026-04-01 00:18:08','2026-04-01 00:18:47'),(4,'App\\Models\\Utilisateur',15,'auth_token','d58e9420947bffc6267ec0e726284aa202b384dece556f191dbd919f45c7c610','[\"*\"]',NULL,NULL,'2026-04-01 07:26:25','2026-04-01 07:26:25'),(5,'App\\Models\\Utilisateur',1,'auth_token','fac10401e0c9ae07712385012fce2df42e1c24e44f9b46b94bd5569e638215f3','[\"*\"]','2026-04-01 08:48:29',NULL,'2026-04-01 07:26:46','2026-04-01 08:48:29');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('96tXEf9V7NVKirXKdC66YpQUsxR4qun1177m2OP5',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoid0RqbUF5c3FQN1lSSU1FbmVlQ1ptOUVmSGRva2dFZW1ISGg4b3VyRyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL2ltYWdlcy9hdmF0YXJzL25nb3ppLmpwZyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1775032010),('bjWkejgH6VLt1cj2mENzqNosh3AkxMTqTzQOxwOF',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiSWJ0YnJnQXZuNERUYWZJb0Iydm91SENQTWdQbVJ3eG84TXZIUWZESCI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL2ltYWdlcy9hdmF0YXJzL2NoaWRpLmpwZyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1775032009),('BYnWxgGGc01iaR358uN8YEPkOQyUfNzBO96bM4Er',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieEQ3cXkxV0VCVlRiQjk1Y2NtYXBZQmFJaG1hdk52cUx1UEdtVExBMSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL2ltYWdlcy9hdmF0YXJzL2t3YW1lLmpwZyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1775032010),('HgU6zA0Rt0y0LTXpiPC63RxIrHDKfFavQNxWjlqI',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoieGdxNHR4TjhxYmh0QXVuVFBCb0p4dXJoa25NbmpRU1packdBMHRQZiI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL2ltYWdlcy9hdmF0YXJzL2VtZWthLmpwZyI7czo1OiJyb3V0ZSI7Tjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==',1775035141),('qyeg4CH4oI6oEbs0UQOm855ynUTXUg7XnPYU9pQi',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoiOWxQbWhJcTJrUXNITWl4N3h6RVl0S0NLNTRyYVBScklsaG5LWkZPaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTM6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL2ltYWdlcy9hdmF0YXJzL2JheW8uanBnIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775032009),('wL4I0nso6iXkrPZx7vTfmdUxaeKwLcCoKGq6ARVb',NULL,'127.0.0.1','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36','YTozOntzOjY6Il90b2tlbiI7czo0MDoibFpyU2FOSWtqMVk1Rkg1QVBLZFloOFpoR2VPY3ZhakdiOUEzSzhUaSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9zdG9yYWdlL2ltYWdlcy9wb3N0cy9lbWVrYV9mYW1pbHkuanBnIjtzOjU6InJvdXRlIjtOO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19',1775032009);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-01 10:48:31
