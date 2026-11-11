# Recherche API Free Fire — BOOYAH ZONE

## Fournisseur étudié
Free Fire Community API
Documentation : https://docs.freefirecommunity.com/
Portail : https://developers.freefirecommunity.com/en

Service communautaire tiers, non affilié à Garena. Une clé API est requise en production et doit rester côté serveur.

## Exemples JavaScript transmis
Le propriétaire du projet a transmis des exemples fetch pour les routes suivantes :

| Route | Paramètres visibles | Usage à examiner |
|---|---|---|
| /info | region et uid dans l'URL | Informations de profil |
| /stats | Non fournis dans l'exemple | Statistiques de carrière |
| /image | Aucun paramètre visible | Ressources visuelles |
| /bancheck | Aucun paramètre visible | Statut du compte |
| /wishlist | Aucun paramètre visible | Liste de souhaits |
| /craftland | Aucun paramètre visible | Données Craftland |

Ces extraits montrent la forme des appels, mais ne prouvent pas que les requêtes fonctionnent : aucune clé valide ni réponse HTTP de ces routes n'a été fournie. Les paramètres des routes autres que /info restent à confirmer.

## Exemple de réponse /stats reçu
Le seul JSON reçu est :

    {
      "brCareer_solo": {},
      "brCareer_duo": {},
      "brCareer_squad": {}
    }

Cela confirme uniquement la présence de ces trois clés dans cet exemple. Les objets étant vides, aucun champ de statistique précis n'est connu. La présence de données CS ou d'autres sections n'est pas confirmée.

Le normaliseur BOOYAH ZONE conserve les objets reçus, marque les sections vides comme indisponibles et ne transforme jamais une donnée manquante en zéro.

## Couverture régionale et coûts
Les régions listées dans la recherche précédente étaient SG, IND et BR. La couverture du Cameroun / Afrique n'est pas explicitement confirmée. Il faut une confirmation écrite du fournisseur avant d'activer la recherche pour les comptes camerounais.

Les quotas et tarifs doivent être revérifiés dans la documentation officielle au moment de l'activation.

## Décision technique
Le fournisseur reste désactivé. Aucun appel externe n'est fait depuis le navigateur et aucune clé n'est stockée dans le dépôt.

Avant activation, vérifier :
1. prise en charge de la région du compte ciblé, notamment Cameroun ;
2. paramètres exacts de chaque endpoint ;
3. réponse réelle non vide de /info et /stats ;
4. conditions d'utilisation et autorisation de réutilisation des données ;
5. tarifs, quotas, limites de débit et disponibilité ;
6. politique de confidentialité et conservation des données.

## Sécurité
- Ne jamais demander le mot de passe Free Fire, un jeton de session ou un code de connexion.
- Ne jamais placer x-api-key dans le frontend, le dépôt Git ou une capture publique.
- Les appels futurs doivent passer par une fonction serveur protégée, avec validation, limitation de débit et cache.
- Afficher la source et l'heure de mise à jour.
- Marquer les données du fournisseur comme tierces et non officielles.
- Garder l'import manuel disponible comme solution de repli.

## Sources
- https://docs.freefirecommunity.com/
- https://developers.freefirecommunity.com/en
