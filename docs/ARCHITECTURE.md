# Architecture BOOYAH ZONE V2

## Vision produit
BOOYAH ZONE est un hub communautaire indépendant : passeport joueur, suivi de progression, comparaison de profils et classement communautaire.

## Piliers
1. Player Passport — UID, pseudo, région, niveau et statistiques.
2. Crew Ladder — classements communautaires BR/CS.
3. Player Compare — comparaison de profils sur des champs comparables.
4. BOOYAH Pulse — indice maison explicable, jamais présenté comme officiel.
5. Crew — invitations, équipes et objectifs collectifs.
6. Zone Radar — actualités, défis amicaux et événements communautaires.

## Architecture technique
- Frontend PWA : HTML, CSS et modules JavaScript natifs.
- Domaine métier : src/core/store.js.
- Adaptateur fournisseur : src/modules/api-adapter.js.
- Recherche API : docs/API-RESEARCH.md.
- État d'intégration : docs/API-INTEGRATION-STATUS.md.
- Backend futur : fonction serveur, authentification, autorisations, limitation de débit et journalisation.
- Base future : profils, snapshots, consentements, groupes et historique des classements.

## Flux d'intégration prévu
1. Le joueur saisit son UID et la région de son compte.
2. L'application demande un consentement avant une recherche externe.
3. Le backend valide les paramètres et appelle le fournisseur sans exposer la clé.
4. La réponse est normalisée sans inventer les champs absents.
5. Le profil affiche la source, la date de mise à jour et le niveau de confiance.
6. Le joueur peut corriger ou supprimer ses données.
7. Les classements ne comparent que des champs réellement disponibles et compatibles.

## Statuts de confiance
- Saisi par le joueur : déclaré, non vérifié.
- Importé depuis une capture : déclaré; aucune lecture automatique n'est promise.
- Fourni par un service tiers : source et date affichées, non officiel.
- Vérifié officiellement : réservé à une intégration Garena autorisée, si disponible.

## Sécurité
- Aucun mot de passe Free Fire ni jeton de session.
- Aucune clé API dans le JavaScript client ou le dépôt.
- Passerelle serveur avec validation, limitation de débit et cache avant tout appel live.
- UID complets non exposés dans les classements publics sans choix explicite.
- Ne pas traiter les champs absents comme des zéros.

## Phases
- V2.0 : interface et outils locaux.
- V2.1 : backend, comptes, consentement et base partagée.
- V2.2 : fournisseur évalué, puis éventuellement activé après validation de la région et des conditions.
- V2.3 : crews, défis, radar et modération.
