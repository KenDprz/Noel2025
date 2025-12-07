# 🎲 Tirage au Sort Anonyme

Une application web simple et élégante pour effectuer des tirages au sort anonymes avec système admin et partage sécurisé.

## 🚀 Utilisation

### Mode Admin (Gestionnaire)

1. Ouvrez le fichier `index.html` dans votre navigateur web
2. Entrez le mot de passe admin : **`admin123`** (par défaut)
3. Configurez le nombre de participants et générez les champs
4. Remplissez les noms des participants
5. Copiez le lien de partage depuis le panneau admin
6. Partagez ce lien avec les participants (mode lecture seule)
7. Cliquez sur "🎯 Tirer au sort" pour lancer le tirage

### Mode Participant (Lecture seule)

1. Ouvrez le lien de partage reçu de l'admin
2. Vous pouvez voir la liste des participants (non modifiable)
3. Vous pouvez lancer le tirage au sort
4. Vous ne pouvez pas modifier les participants

## ✨ Fonctionnalités

- **Mode Admin** : Gestion complète des participants et génération de lien de partage
- **Mode Participant** : Lecture seule - peut voir et lancer le tirage mais ne peut pas modifier
- **Lien de partage sécurisé** : Chaque session a un ID unique
- **Synchronisation automatique** : Les participants voient les mises à jour en temps réel
- Interface simple et intuitive
- Design moderne et responsive
- Animation lors du tirage
- Support mobile
- Fonctionne hors ligne (pas besoin d'internet)

## 📦 Partage

Pour partager cette application :

1. **Option 1 - Fichiers locaux** : Envoyez les 3 fichiers (`index.html`, `style.css`, `script.js`) dans un dossier compressé (ZIP)

2. **Option 2 - Hébergement web** : 
   - Uploadez les fichiers sur un service d'hébergement gratuit (GitHub Pages, Netlify, Vercel, etc.)
   - Partagez le lien avec vos amis

## 🎯 Exemples d'utilisation

- Tirage au sort pour un cadeau
- Sélection d'un gagnant pour un concours
- Attribution aléatoire de tâches
- Choix d'un volontaire

## 🔒 Confidentialité et Sécurité

- Cette application fonctionne entièrement côté client (dans le navigateur)
- Aucune donnée n'est envoyée à un serveur
- Les données sont stockées localement dans le navigateur (localStorage)
- Chaque session a un ID unique pour le partage
- Le mot de passe admin par défaut est `admin123` (vous pouvez le modifier dans `script.js`)

## 🔑 Changer le mot de passe admin

Pour changer le mot de passe admin, modifiez la constante `ADMIN_PASSWORD` dans le fichier `script.js` :

```javascript
const ADMIN_PASSWORD = 'votre_nouveau_mot_de_passe';
```

## 📝 Notes

- Le tirage utilise la fonction `Math.random()` de JavaScript pour garantir l'équité
- L'application fonctionne sur tous les navigateurs modernes
- Aucune dépendance externe requise

