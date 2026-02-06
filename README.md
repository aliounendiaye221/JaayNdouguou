# 🌾 JaayNdougou - Marché Digital de Légumes Frais

> **Mo Yomb, Mo Gaaw** - Plateforme e-commerce pour la vente de légumes frais au Sénégal

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

## 📋 Description

JaayNdougou est une plateforme e-commerce moderne dédiée à la vente de légumes frais au Sénégal. Notre mission est de connecter les producteurs locaux aux consommateurs urbains de Dakar et Rufisque avec une livraison rapide et des produits de qualité.

### ✨ Fonctionnalités

- 🛒 **Catalogue de produits** - Navigation intuitive par catégories
- 💳 **Paiements multiples** - Wave, Orange Money, et paiement à la livraison
- 👤 **Interface d'administration** - Gestion complète des commandes, clients et réclamations
- 📊 **Tableau de bord** - Statistiques en temps réel et analytics
- 📧 **Notifications email** - Confirmations de commande automatiques via Resend
- 📱 **Intégration WhatsApp** - Support client direct
- 🔐 **Authentification sécurisée** - NextAuth avec gestion des sessions
- 📦 **Suivi de commandes** - Status en temps réel de la préparation à la livraison
- 🎨 **Design responsive** - Optimisé pour mobile, tablette et desktop

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18 ou supérieur
- npm ou yarn
- PostgreSQL (pour la production)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/aliounendiaye221/JaayNdouguou.git
cd JaayNdouguou

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs

# Générer le client Prisma
npx prisma generate

# Créer l'admin initial (optionnel)
node scripts/seed-admin.js

# Lancer le serveur de développement
npm run dev
```

Accédez à l'application sur [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[Guide de Configuration et Déploiement](SETUP.md)** - Configuration complète, variables d'environnement, et déploiement sur Vercel
- **[Configuration des Variables](.env.example)** - Template des variables d'environnement
- **[Schéma de Base de Données](prisma/schema.prisma)** - Modèles de données Prisma

## 🛠️ Technologies

### Frontend
- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS 4** - Styling utilitaire
- **Lucide React** - Icônes modernes

### Backend & Base de Données
- **Prisma 6** - ORM TypeScript
- **PostgreSQL** - Base de données (Neon/Vercel Postgres)
- **NextAuth v5** - Authentication
- **bcryptjs** - Hachage de mots de passe

### Intégrations
- **Resend** - Service d'envoi d'emails
- **Wave & Orange Money** - Paiements mobiles Sénégal
- **WhatsApp Business** - Support client

## 📱 Captures d'Écran

### Page d'Accueil
Catalogue de produits avec navigation intuitive et panier d'achat.

### Interface Admin
Tableau de bord avec statistiques en temps réel, gestion des commandes et réclamations.

## 🏗️ Structure du Projet

```
JaayNdouguou/
├── app/                    # Application Next.js (App Router)
│   ├── (auth)/            # Routes d'authentification
│   ├── admin/             # Interface d'administration
│   ├── api/               # API Routes
│   ├── components/        # Composants React
│   ├── context/           # Context API (Cart, etc.)
│   ├── lib/               # Utilitaires et configurations
│   └── utils/             # Fonctions utilitaires
├── prisma/                # Schéma et migrations Prisma
│   └── schema.prisma      # Modèles de données
├── public/                # Assets statiques
├── scripts/               # Scripts d'administration
├── auth.ts                # Configuration NextAuth
├── middleware.ts          # Middleware Next.js
└── next.config.ts         # Configuration Next.js
```

## 🔐 Sécurité

- ✅ Headers de sécurité configurés (X-Frame-Options, CSP, etc.)
- ✅ Authentification avec tokens JWT
- ✅ Mots de passe hachés avec bcrypt
- ✅ Protection CSRF
- ✅ Validation des entrées avec Zod
- ✅ Connexions SSL/TLS pour la base de données

**Important**: Ne jamais commiter les fichiers `.env` contenant des secrets. Voir [SETUP.md](SETUP.md) pour les bonnes pratiques.

## 📦 Scripts Disponibles

```bash
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run start      # Serveur de production
npm run lint       # Linter ESLint
```

## 🚀 Déploiement

L'application est conçue pour être déployée sur Vercel :

```bash
# Installer la CLI Vercel
npm i -g vercel

# Déployer
vercel --prod
```

Voir [SETUP.md](SETUP.md) pour des instructions détaillées.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence privée. Tous droits réservés.

## 👨‍💻 Auteur

**ALIOUNE NDIAYE**

- GitHub: [@aliounendiaye221](https://github.com/aliounendiaye221)
- Email: contact@jaayndougou.sn
- WhatsApp: +221786037913

## 🙏 Remerciements

- L'équipe Next.js pour leur excellent framework
- La communauté open source pour les bibliothèques utilisées
- Nos utilisateurs et testeurs au Sénégal

---

**Développé avec ❤️ au Sénégal pour JaayNdougou**
