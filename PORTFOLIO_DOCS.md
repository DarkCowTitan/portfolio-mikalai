# 📘 Portfolio Mikalai — Documentation complète

> Dernière mise à jour : mai 2026  
> Auteur : Mikalai Yeuseyenka

---

## 🗂 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Stack technique](#stack-technique)
3. [Structure des fichiers](#structure-des-fichiers)
4. [Services connectés — URLs, clés, mots de passe](#services-connectés)
5. [Base de données Supabase](#base-de-données-supabase)
6. [Admin panel](#admin-panel)
7. [Déploiement Vercel](#déploiement-vercel)
8. [Lancer le projet en local](#lancer-le-projet-en-local)
9. [Ce qui a été fait](#ce-qui-a-été-fait)
10. [Ce qui reste à faire](#ce-qui-reste-à-faire)

---

## Vue d'ensemble

Site portfolio personnel pour le BUT MMI (Métiers du Multimédia et de l'Internet), déployé sur Vercel et connecté à Supabase.

- **Site public** : https://portfolio-next-darkcowtitans-projects.vercel.app  
  (alias stable : https://portfolio-next-gamma-rust.vercel.app)
- **Admin** : https://portfolio-next-darkcowtitans-projects.vercel.app/admin
- **Repo local** : `D:\Downloads\Cours\Année 2\www - Old wamp directory\Site_portfolio\portfolio-next`
- **Ancien site PHP** (référence) : `D:\Downloads\Cours\Année 2\www - Old wamp directory\Site_portfolio\Stable`
- **Images hébergées** : https://yeuseyenka-mikalai.com/fichiers_projets/

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Style | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Icônes | Lucide React |
| Base de données | Supabase (PostgreSQL) |
| Stockage images | Serveur perso yeuseyenka-mikalai.com |
| Emails | Resend (intégré, clé à configurer) |
| Déploiement | Vercel |
| Police | Inter (Google Fonts) |

---

## Structure des fichiers

```
portfolio-next/
│
├── app/                          # Pages (Next.js App Router)
│   ├── layout.tsx                # Layout global (Navigation + Footer + CursorSpotlight)
│   ├── page.tsx                  # Page d'accueil
│   ├── globals.css               # CSS global, animations, variables
│   ├── about/page.tsx            # Page "À propos"
│   ├── contact/page.tsx          # Page "Contact"
│   ├── projects/
│   │   ├── page.tsx              # Liste de tous les projets
│   │   ├── projects-client.tsx   # Filtres interactifs (côté client)
│   │   └── [id]/
│   │       ├── page.tsx          # Page projet individuel (SSR)
│   │       └── project-detail-client.tsx  # Rendu du projet (côté client)
│   ├── admin/
│   │   ├── layout.tsx            # Layout admin avec navigation
│   │   ├── page.tsx              # Dashboard admin
│   │   ├── admin-nav.tsx         # Menu latéral admin
│   │   ├── login/page.tsx        # Page de connexion admin
│   │   ├── projects/
│   │   │   ├── page.tsx          # Liste projets (admin)
│   │   │   ├── new/page.tsx      # Créer un projet
│   │   │   ├── [id]/page.tsx     # Modifier un projet
│   │   │   └── project-form.tsx  # Formulaire projet réutilisable
│   │   └── messages/page.tsx     # Voir les messages de contact
│   └── api/
│       ├── admin/login/route.ts  # API connexion admin
│       └── contact/route.ts      # API envoi de message
│
├── components/
│   ├── navigation.tsx            # Navbar responsive
│   ├── footer.tsx                # Footer
│   ├── cursor-spotlight.tsx      # Effet lumière qui suit la souris
│   ├── project-card.tsx          # Carte projet (grille)
│   └── home/
│       ├── hero-section.tsx      # Hero avec blobs + parallax + stats animées
│       ├── skills-marquee.tsx    # Défilement infini des technos
│       ├── poles-section.tsx     # Section 3 pôles MMI
│       ├── projects-preview.tsx  # Grille projets en avant
│       └── cta-section.tsx       # Call-to-action final
│
├── lib/
│   ├── supabase.ts               # Client Supabase + fonctions fetch
│   └── types.ts                  # Types TypeScript
│
├── middleware.ts                 # Protection des routes /admin
├── next.config.js                # Config Next.js (domaines images)
├── tailwind.config.ts            # Config Tailwind (couleurs custom)
├── .env.local                    # Variables d'environnement (NE PAS COMMITER)
└── vercel.json                   # Config Vercel (framework: nextjs)
```

---

## Services connectés

> ⚠️ **Attention** : ces données sont sensibles. Ne pas partager publiquement ni commiter dans Git.

### Supabase

| Variable | Valeur |
|---|---|
| URL | `https://jfasdepzzauqkkswsykl.supabase.co` |
| Anon Key (public) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmYXNkZXB6emF1cWtrc3dzeWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0ODI5NTUsImV4cCI6MjA5NDA1ODk1NX0.0ohM_8BfAl5ZUj69BUQU5gGcH8L5CBjTbENYsRRRmQs` |
| Project ID | `jfasdepzzauqkkswsykl` |
| Dashboard | https://supabase.com/dashboard/project/jfasdepzzauqkkswsykl |
| Table Editor | https://supabase.com/dashboard/project/jfasdepzzauqkkswsykl/editor |

### Admin Panel

| Variable | Valeur |
|---|---|
| Mot de passe admin | `mikalai2024` |
| Secret JWT (hash) | `portfolio-secret-mikalai-2024` |
| URL admin | `/admin/login` |

**Comment ça marche :** Le middleware Next.js vérifie un cookie `admin_token` = SHA-256(`mot_de_passe` + `ADMIN_SECRET`). Aucune table utilisateur dans Supabase — authentification simple par mot de passe.

### Resend (emails)

| Variable | Valeur |
|---|---|
| `RESEND_API_KEY` | à configurer sur https://resend.com (pas encore actif) |

### Vercel

| Info | Valeur |
|---|---|
| Project ID | `prj_37pT2GxvFthusPHoofkcTLokIKpU` |
| Org ID | `team_M3T5MU7J6AqMFV2xjyZ6A7Zh` |
| Project Name | `portfolio-next` |
| Dashboard | https://vercel.com/darkcowtitans-projects/portfolio-next |

### Serveur images (ancien site)

Les images des projets sont toujours hébergées sur le serveur PERSO :

```
https://yeuseyenka-mikalai.com/fichiers_projets/<nom_du_fichier>
```

Configuré dans `next.config.js` sous `remotePatterns`.

---

## Base de données Supabase

### Tables principales

| Table | Description |
|---|---|
| `projets` | Tous les projets (titre, description, images, liens, année...) |
| `poles` | 3 pôles MMI : Développement, Création, Communication |
| `competences_but` | Compétences du programme BUT MMI |
| `apprentissages_critiques` | ACs (codes comme AC21.01, AC22.03...) |
| `tags` | Tags libres (Next.js, Figma, Photoshop...) |
| `logiciels` | Logiciels/outils utilisés |
| `types_projets` | Types (SAÉ, Projet perso, Stage...) |
| `messages_contact` | Messages reçus via le formulaire de contact |

### Tables de liaison (many-to-many)

| Table | Liaison |
|---|---|
| `projet_tags` | projets ↔ tags |
| `projet_logiciels` | projets ↔ logiciels |
| `projet_images` | images additionnelles par projet |
| `projet_apprentissages` | projets ↔ apprentissages_critiques |

### Champs importants de la table `projets`

| Champ | Type | Notes |
|---|---|---|
| `id` | int | Clé primaire |
| `titre` | text | Nom du projet |
| `description` | text | Description courte |
| `description_longue` | text | Contenu détaillé |
| `image_principale` | text | Nom du fichier OU URL complète |
| `lien_demo` | text | URL de démo |
| `lien_github` | text | URL GitHub |
| `lien_behance` | text | URL Behance |
| `annee` | int | Année du projet |
| `est_publie` | bool | Visible sur le site |
| `est_mis_en_avant` | bool | Affiché sur la page d'accueil |
| `ordre_affichage` | int | Ordre de tri (plus petit = premier) |
| `type_projet_id` | int | FK vers `types_projets` |

**Projets mis en avant (homepage)** : IDs 10, 11, 14, 23, 24, 29

### Données importées (migration de l'ancien site PHP/MySQL)

- **19 projets** réels migrés
- **28 tags** importés
- **37 apprentissages critiques** (AC) importés
- **3 pôles** : Développement (bleu), Création (rose), Communication (vert)
- Toutes les relations (projet_tags, projet_apprentissages) reconstituées

### Requête utile — voir tous les projets avec leurs pôles

```sql
SELECT p.id, p.titre, p.est_mis_en_avant, p.est_publie,
       array_agg(DISTINCT po.nom) AS poles
FROM projets p
LEFT JOIN projet_apprentissages pa ON pa.projet_id = p.id
LEFT JOIN apprentissages_critiques ac ON ac.id = pa.ac_id
LEFT JOIN competences_but cb ON cb.id = ac.competence_id
LEFT JOIN poles po ON po.id = cb.pole_id
GROUP BY p.id, p.titre, p.est_mis_en_avant, p.est_publie
ORDER BY p.ordre_affichage;
```

---

## Admin Panel

Accessible sur `/admin` (protégé par middleware).

### Pages

| URL | Fonction |
|---|---|
| `/admin/login` | Connexion (mot de passe : `mikalai2024`) |
| `/admin` | Dashboard — stats rapides |
| `/admin/projects` | Liste de tous les projets |
| `/admin/projects/new` | Créer un nouveau projet |
| `/admin/projects/[id]` | Modifier un projet existant |
| `/admin/messages` | Lire les messages de contact reçus |

### Ce qu'on peut faire depuis l'admin

- Créer / modifier / supprimer des projets
- Mettre un projet en avant (homepage)
- Publier / dépublier un projet
- Ajouter des tags, logiciels, ACs à un projet
- Uploader une image principale
- Voir les messages de contact avec statut lu/non-lu

---

## Déploiement Vercel

### Déployer en production (CLI)

```powershell
Set-Location "D:\Downloads\Cours\Année 2\www - Old wamp directory\Site_portfolio\portfolio-next"
vercel deploy --prod
```

### Variables d'environnement sur Vercel

Ces variables doivent être configurées dans le dashboard Vercel (Settings → Environment Variables) :

```
NEXT_PUBLIC_SUPABASE_URL     = https://jfasdepzzauqkkswsykl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= [voir .env.local]
ADMIN_PASSWORD               = mikalai2024
ADMIN_SECRET                 = portfolio-secret-mikalai-2024
RESEND_API_KEY               = [à configurer depuis resend.com]
```

### Domaines images autorisés (`next.config.js`)

```js
remotePatterns: [
  { protocol: 'https', hostname: 'yeuseyenka-mikalai.com', pathname: '/fichiers_projets/**' },
  { protocol: 'https', hostname: 'jfasdepzzauqkkswsykl.supabase.co', pathname: '/storage/v1/object/public/**' },
  { protocol: 'https', hostname: 'cdn.simpleicons.org' },
]
```

---

## Lancer le projet en local

```powershell
# Aller dans le dossier
Set-Location "D:\Downloads\Cours\Année 2\www - Old wamp directory\Site_portfolio\portfolio-next"

# Installer les dépendances (si pas encore fait)
npm install

# Lancer le serveur de développement
npm run dev
```

Site disponible sur : http://localhost:3000

Le fichier `.env.local` est déjà configuré avec les vraies clés, pas besoin de rien toucher pour le dev local.

---

## Ce qui a été fait

### Infrastructure
- [x] Projet Next.js 14 créé (App Router + TypeScript + Tailwind)
- [x] Supabase configuré et connecté
- [x] Schéma de base de données complet créé
- [x] Migration de tous les projets de l'ancien site PHP/MySQL
- [x] Images corrigées (URL: `yeuseyenka-mikalai.com/fichiers_projets/`)
- [x] Déployé sur Vercel
- [x] `next.config.js` corrigé (domaine images bien configuré)

### Pages publiques
- [x] Page d'accueil avec hero, pôles, projets en avant, CTA
- [x] Page `/projects` avec filtres par pôle
- [x] Page détail projet `/projects/[id]`
- [x] Page `/about`
- [x] Page `/contact` avec formulaire
- [x] Navigation responsive
- [x] Footer

### Admin
- [x] `/admin/login` — authentification par mot de passe
- [x] Dashboard admin
- [x] CRUD projets (créer, modifier, voir)
- [x] Visualisation des messages de contact

### Animations & Design
- [x] **CursorSpotlight** — glow violet qui suit la souris (tout le site)
- [x] **Hero section** — blobs animés, grille en fond, parallax au scroll
- [x] **Compteurs animés** — stats qui comptent depuis 0 au chargement (19 projets, 3 pôles...)
- [x] **Skills marquee** — défilement infini des technos sur 2 lignes (direction opposée)
- [x] **Cards projets** — animation au scroll (whileInView), hover lift + scale image
- [x] **Badge "Featured"** sur les projets mis en avant
- [x] **Pôle badges** colorés (bleu dev, rose créa, vert com)

---

## Ce qui reste à faire

### Prioritaire
- [ ] Configurer `RESEND_API_KEY` pour que le formulaire de contact envoie vraiment des emails
- [ ] Connecter un vrai domaine personnalisé sur Vercel (ex: `portfolio.yeuseyenka-mikalai.com`)
- [ ] Finir la page `/about` avec vraie bio, photo, parcours

### Admin
- [ ] Bouton "Supprimer projet" dans l'admin (avec confirmation)
- [ ] Marquer les messages comme lus depuis l'admin (actuellement lecture seule)
- [ ] Upload d'image vers Supabase Storage (au lieu de saisir une URL manuellement)

### Animations à ajouter
- [ ] Effet 3D tilt sur les cartes projets (au survol)
- [ ] Transition de page (exit animation entre les routes)
- [ ] Éventuellement : fond particules ou géométries WebGL dans le hero

### SEO
- [ ] Open Graph image dynamique pour chaque projet
- [ ] Sitemap.xml
- [ ] `robots.txt`

---

## Couleurs & Design tokens

```css
/* Fond */
--bg:          #080810   /* fond principal */
--bg-card:     #12121f   /* cartes */
--bg-border:   #1e1e33   /* bordures */

/* Pôles */
Développement: #3B82F6  (bleu)
Création:      #EC4899  (rose/pink)
Communication: #10B981  (vert/emerald)

/* Accent */
violet:        #7c3aed / #a78bfa
cyan:          #22d3ee
```

---

## Dépendances clés

```json
{
  "next": "14.2.15",
  "@supabase/supabase-js": "^2.43.4",
  "framer-motion": "^11.3.8",
  "lucide-react": "^0.400.0",
  "resend": "^3.4.0",
  "tailwindcss": "^3.4.6",
  "typescript": "^5.5.3"
}
```
