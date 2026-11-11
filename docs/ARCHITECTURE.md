# Architecture BOOYAH ZONE V2

## Vision produit
BOOYAH ZONE devient un **hub d'intelligence communautaire** : chaque joueur dispose d'un passeport, suit ses progrès et se compare à une communauté. L'application ne se limite pas à un fil d'actualités.

## Piliers
1. **Player Passport** — UID, pseudo, région, niveau, rangs et statistiques renseignées.
2. **Crew Ladder** — classements filtrables BR, CS, victoires et BOOYAH Pulse.
3. **Player Compare** — comparaison de deux profils avec indicateurs identiques.
4. **BOOYAH Pulse** — indice maison transparent, explicable et non officiel.
5. **Crew** — invitations, équipes et objectifs collectifs (phase backend).
6. **Zone Radar** — actualités, défis amicaux et événements communautaires (phase contenu).

## Architecture technique
- Frontend PWA : HTML, CSS, ES modules natifs.
- Domaine métier : `src/core/store.js` pour la validation, le stockage et les calculs.
- Modules UI : `src/modules/` pour les intégrations isolées.
- Adaptateur API : `src/modules/api-adapter.js`, désactivé jusqu'à validation du fournisseur.
- Backend futur : API serveur, authentification, autorisations, limitation de débit et journalisation.
- Base future : profils, snapshots de statistiques, consentements, groupes/crews et historique de classement.

## Flux de données futur
1. Le joueur saisit son UID et choisit sa région.
2. BOOYAH ZONE demande un consentement clair avant toute recherche externe.
3. Le backend appelle un fournisseur autorisé sans exposer sa clé.
4. La réponse est normalisée, horodatée et marquée selon son niveau de vérification.
5. Le joueur confirme le lien avec son profil ; aucune donnée privée n'est déduite.
6. Le classement utilise uniquement des champs comparables et indique la date de mise à jour.

## Statuts de confiance
- **Saisi par le joueur** : déclaré, non vérifié.
- **Importé depuis une capture** : toujours déclaré; pas d'OCR automatique dans la V2.
- **Fourni par un service tiers** : source et heure affichées, non officiel.
- **Vérifié officiellement** : statut réservé à une intégration Garena autorisée, si elle devient disponible.

## Sécurité et vie privée
- Ne jamais demander le mot de passe Free Fire ou des jetons de session.
- Ne jamais placer une clé API dans le JavaScript client.
- Limiter les appels et mettre en cache côté serveur.
- Permettre la correction et la suppression d'un profil.
- Ne pas exposer les UID complets dans les classements publics sans choix explicite du joueur.

## Phases
- V2.0 : interface, passeport local, classement local, comparateur, Pulse.
- V2.1 : backend, comptes, consentement, base partagée.
- V2.2 : fournisseur de statistiques évalué et éventuellement activé.
- V2.3 : crews, défis communautaires, radar et outils de modération.
