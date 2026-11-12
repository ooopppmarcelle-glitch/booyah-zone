# BOOYAH ZONE — Player Intelligence

BOOYAH ZONE est une PWA communautaire indépendante consacrée à Free Fire.

**BOOYAH ZONE — Ton profil. Ton évolution. Ta communauté.**

## Modules
- Player Passport : profil et informations du joueur.
- Crew Ladder : classements communautaires BR/CS.
- Player Compare : comparaison de profils.
- BOOYAH Pulse : indice maison explicable, non officiel.
- Crew & Zone Radar : équipes et activités communautaires (phases suivantes).

## Architecture
- HTML, CSS et JavaScript natif en modules ES.
- Stockage local dans la version actuelle.
- PWA avec manifest et service worker.
- Adaptateur fournisseur isolé dans src/modules/api-adapter.js.
- Documentation API dans docs/API-RESEARCH.md et docs/API-INTEGRATION-STATUS.md.

## API Free Fire Community
Les exemples transmis identifient six routes : /info, /stats, /image, /bancheck, /wishlist et /craftland. Le seul exemple de réponse reçu pour /stats contient brCareer_solo, brCareer_duo et brCareer_squad, avec des objets vides. Les champs détaillés et la couverture du Cameroun ne sont donc pas confirmés.

**L'API reste désactivée.** Aucun appel externe n'est fait depuis le navigateur et aucune clé n'est stockée dans le dépôt. Une fonction serveur protégée sera nécessaire avant toute activation.

## État actuel et limites
Les profils et classements locaux utilisent les données saisies par les joueurs. Ils ne sont pas synchronisés entre appareils. Les données manuelles sont clairement non vérifiées. Aucun compte Garena n'est connecté.

Ne jamais demander le mot de passe Free Fire, un jeton de session ou un code de connexion.

## Déploiement
Le frontend statique peut être publié sur un hébergeur PWA statique. Les comptes, la base partagée et la passerelle API sont des étapes backend séparées.

BOOYAH ZONE est un projet de fans indépendant, non affilié à Garena. Free Fire est une marque de ses propriétaires respectifs.


## Netlify
Le projet Netlify `booyah-zone-t6rx` est configuré et possède un déploiement publié prêt. Voir [docs/NETLIFY-SETUP.md](docs/NETLIFY-SETUP.md) pour la fonction de diagnostic et les futures variables secrètes.

La fonction `netlify/functions/freefire-status.mjs` ne fait qu'indiquer l'état de configuration. Elle ne contacte pas l'API et ne révèle aucune clé. L'intégration réelle reste désactivée tant que la clé et la prise en charge du Cameroun ne sont pas confirmées.
