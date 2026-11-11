# Recherche API Free Fire — BOOYAH ZONE

## Résultat
Aucune API publique officielle Garena pour consulter les statistiques de comptes n'a été confirmée dans cette recherche. Les solutions trouvées sont des services communautaires indépendants.

## Fournisseur étudié : Free Fire Community API
Documentation : https://docs.freefirecommunity.com/

La documentation annonce des endpoints de profil (`/info`) et statistiques (`/stats`), et précise explicitement que le service n'est **pas affilié, approuvé ou connecté à Garena**.

La documentation affiche plusieurs plans et quotas :
- Trial : playground seulement, pas d'utilisation en production.
- Trial Pass : 300 requêtes / 24 h.
- Beginner : 3 000 requêtes / mois.
- Developer : 12 000 requêtes / mois.
- Pro : 30 000 requêtes / mois.

Une clé API est requise pour la production. Le fournisseur recommande les appels côté serveur et déconseille l'exposition de la clé dans le navigateur.

## Limite régionale
Les régions listées dans la documentation sont SG, IND et BR. La documentation consultée ne confirme pas explicitement la prise en charge du Cameroun. Il faut obtenir une réponse du fournisseur avant toute intégration.

## Autres pistes examinées
- Le dépôt communautaire `siambhau/FreeFireApi` décrit des statistiques BR et CS mais indique que l'accès passe par une clé et que certains endpoints ont un accès payant.
- Le dépôt `jinix6/free-ff-api` documente des endpoints de compte et de statistiques, mais la disponibilité, la sécurité, la couverture régionale et les conditions d'utilisation doivent être vérifiées indépendamment.

## Décision BOOYAH ZONE
**Ne pas connecter de fournisseur pour l'instant.** L'adaptateur reste désactivé. Avant activation, vérifier par écrit :
1. prise en charge réelle des comptes de la région du Cameroun ;
2. autorisation de réutilisation des données dans une application communautaire ;
3. prix, quotas, disponibilité et limites d'appels ;
4. données exactes renvoyées et fréquence de mise à jour ;
5. politique de confidentialité et conservation des données.

## Règles non négociables
- Ne jamais demander le mot de passe Free Fire ou un jeton de session.
- Ne jamais appeler une API tierce directement depuis le navigateur avec une clé secrète.
- Afficher le fournisseur et la date de mise à jour.
- Étiqueter les données tierces comme non officielles.
- Garder l'import manuel disponible en solution de repli.

Sources consultées :
- https://docs.freefirecommunity.com/
- https://github.com/siambhau/FreeFireApi
- https://github.com/jinix6/free-ff-api
