# BOOYAH ZONE — Player Intelligence

BOOYAH ZONE est une PWA communautaire indépendante consacrée à Free Fire. La V2 repart sur une architecture claire centrée sur les joueurs, leurs profils, leurs statistiques déclarées et la vie de leur communauté.

## Identité du produit

**BOOYAH ZONE — Ton profil. Ton évolution. Ta communauté.**

Modules prévus :
- **Player Passport** : identité joueur, UID, région, niveau et données de performance.
- **Crew Ladder** : classements BR/CS et classement communautaire.
- **Player Compare** : comparaison lisible de deux profils.
- **BOOYAH Pulse** : indice maison explicable, jamais présenté comme un score officiel Garena.
- **Crew & Zone Radar** : équipes, défis amicaux et activités communautaires (phases suivantes).

## Architecture V2

```
/
├── index.html
├── manifest.webmanifest
├── sw.js
├── src/
│   ├── app.js
│   ├── styles.css
│   ├── core/
│   │   └── store.js
│   └── modules/
│       └── api-adapter.js
├── assets/
│   ├── logo.svg
│   └── favicon.svg
└── docs/
    ├── ARCHITECTURE.md
    └── API-RESEARCH.md
```

- Interface : HTML/CSS/JavaScript natif en modules ES, sans framework ni frais de dépendances.
- Données V2 actuelle : stockage local du navigateur, limité à l'appareil courant.
- Source de vérité future : backend sécurisé et base de données partagée.
- API externe : couche adaptateur désactivée par défaut. Aucun secret API dans le navigateur.
- PWA : manifest et service worker pour la coque hors ligne.

## État actuel

Cette branche contient une refonte de l'interface et un prototype local. Elle ne fournit pas encore de comptes, de synchronisation multi-appareils, de validation automatique des UID, ni de connexion à une API Garena ou tierce.

Les statistiques saisies manuellement ou illustrées par capture sont marquées **non vérifiées**. La capture n'est pas analysée automatiquement.

## API et sécurité

Garena n'a pas été identifiée dans cette recherche comme proposant une API publique officielle de statistiques de comptes. Des services communautaires indépendants existent, mais ils ne sont ni affiliés ni approuvés par Garena. Leur couverture régionale, leurs conditions, leur fiabilité et leurs tarifs doivent être validés avant intégration.

Aucun mot de passe Free Fire, jeton de session ou code de connexion ne doit être demandé à un joueur.

## Déploiement

Le site reste statique et peut être publié sur Netlify ou GitHub Pages. Le backend et les comptes seront ajoutés dans une phase séparée, après validation de l'API et du budget.

BOOYAH ZONE est un projet de fans indépendant, non affilié à Garena. Free Fire est une marque de ses propriétaires respectifs.
