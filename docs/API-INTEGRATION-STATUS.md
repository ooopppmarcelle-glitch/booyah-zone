# État de l'intégration API — BOOYAH ZONE

## État : initialisation préparée, appels de production désactivés

Le propriétaire du projet a confirmé qu'un test du Playground officiel a retrouvé son propre profil Free Fire à partir de son UID. Le test est donc positif pour le profil et la région sélectionnée dans le Playground. Le code exact de cette région n'a pas encore été communiqué ; ne pas le deviner ni le coder en dur.

Ce résultat valide le parcours de test du Playground, mais ne prouve pas encore qu'une clé de production est disponible ni que les appels depuis Netlify sont autorisés par le forfait.

## Contrat API vérifié

- Endpoint profil : GET /info
- Paramètres : region et uid (UID de 5 à 15 chiffres selon la documentation)
- Authentification recommandée : en-tête x-api-key
- User-Agent personnalisé obligatoire : au moins 10 caractères et sans nom de bibliothèque HTTP, d'outil d'automatisation ou de bot
- Réponse attendue : JSON, notamment basicInfo.region, basicInfo.nickname et basicInfo.accountId

La documentation actuelle décrit les codes régionaux sg, ind, br et d'autres valeurs. Elle précise que region est transmis au fournisseur et ne détermine pas l'autorisation du forfait. La valeur exacte testée dans le Playground doit être reprise pour le compte concerné ; ne pas supposer que tous les comptes camerounais utilisent la même région.

## Implémenté dans le dépôt

- Catalogue des six routes dans l'adaptateur.
- Normaliseur qui reconnaît les trois sections BR reçues.
- Une section vide est marquée indisponible, jamais convertie en zéro.
- La passerelle de diagnostic Netlify reste sans appel fournisseur et n'expose aucun secret.
- L'adaptateur frontend reste désactivé.

## À faire avant les appels de production

- Obtenir une clé API de production valide et vérifier le quota/prix du forfait.
- Reporter le code de région exact retourné par le test Playground.
- Vérifier les paramètres et exemples de réponse réels pour chaque endpoint avant de l'activer.
- Ajouter validation UID/région, protection anti-abus et gestion des limites de débit côté serveur.
- Afficher la source et la date de récupération des données.
- Vérifier les conditions d'utilisation du fournisseur.

## Sécurité

Ne jamais coller de clé API dans le dépôt GitHub, le navigateur, une capture d'écran ou une conversation. Ne jamais demander ni stocker le mot de passe Free Fire, un jeton de session ou un code de connexion.
