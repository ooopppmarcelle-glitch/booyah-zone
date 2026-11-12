# État de l'intégration API — BOOYAH ZONE

## État : initialisation préparée, appels de production désactivés

Le propriétaire du projet a confirmé que le Playground a retrouvé son profil Free Fire à partir de son UID. La région affichée dans le résultat est **ME**.

La documentation Free Fire Community regroupe ME dans le cluster régional **SG**. Il faut donc distinguer :
- Région du compte renvoyée par le profil : ME (Middle East).
- Valeur de routage documentée pour la requête API : SG (cluster qui couvre notamment ME).

Ce résultat confirme le test Playground pour ce compte et ce routage. Il ne prouve pas encore qu'une clé de production est disponible ni que les appels depuis Netlify sont autorisés par le forfait.

## Contrat API vérifié

- Endpoint profil : GET /info
- Paramètres : region et uid (UID de 5 à 15 chiffres selon la documentation)
- Pour un compte dont basicInfo.region vaut ME : utiliser le cluster de requête SG, conformément à la table de couverture régionale du fournisseur.
- Authentification recommandée : en-tête x-api-key
- User-Agent personnalisé obligatoire : au moins 10 caractères et sans nom de bibliothèque HTTP, d'outil d'automatisation ou de bot
- Réponse attendue : JSON, notamment basicInfo.region, basicInfo.nickname et basicInfo.accountId

## Implémenté dans le dépôt

- Catalogue des six routes dans l'adaptateur.
- Normaliseur qui reconnaît les trois sections BR reçues.
- Une section vide est marquée indisponible, jamais convertie en zéro.
- La passerelle de diagnostic Netlify reste sans appel fournisseur et n'expose aucun secret.
- L'adaptateur frontend reste désactivé.

## À faire avant les appels de production

- Obtenir une clé API de production valide et vérifier le quota/prix du forfait.
- Utiliser SG comme valeur de routage API pour le compte testé ME, et vérifier la réponse réelle en production avant activation.
- Vérifier les paramètres et exemples de réponse réels pour chaque endpoint avant de l'activer.
- Ajouter validation UID/région, protection anti-abus et gestion des limites de débit côté serveur.
- Afficher la source et la date de récupération des données.
- Vérifier les conditions d'utilisation du fournisseur.

## Sécurité

Ne jamais coller de clé API dans le dépôt GitHub, le navigateur, une capture d'écran ou une conversation. Ne jamais demander ni stocker le mot de passe Free Fire, un jeton de session ou un code de connexion.
