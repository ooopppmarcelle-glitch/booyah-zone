# Configuration Netlify — BOOYAH ZONE

## Projet Netlify détecté

Le projet Netlify `booyah-zone-t6rx` existe et possède un déploiement publié à l'état `ready`. Le site public détecté est :

https://booyah-zone-t6rx.netlify.app

Cette information confirme l'existence du projet et d'un déploiement prêt ; elle ne prouve pas que la nouvelle fonction de cette branche est déjà publiée.

## Fonction de diagnostic

Après publication de la branche contenant cette fonction, l'URL de diagnostic sera :

`/.netlify/functions/freefire-status`

Elle indique uniquement si les variables de configuration sont présentes. Elle ne contacte jamais le fournisseur et ne renvoie jamais la clé.

## Variables d'environnement à créer plus tard

Dans Netlify : **Project configuration → Environment variables**.

| Nom | Valeur | Portée |
|---|---|---|
| `FREEFIRE_API_KEY` | Clé fournie par Free Fire Community, quand elle sera obtenue | Functions / Runtime |
| `FREEFIRE_CAMEROON_CONFIRMED` | `true` uniquement après confirmation écrite du fournisseur ; sinon ne pas créer ou laisser `false` | Functions / Runtime |

Ne pas mettre ces valeurs dans `netlify.toml`, le code frontend ou GitHub. Après modification des variables, lancer un nouveau déploiement pour qu'elles soient prises en compte.

## Sécurité et activation

- La fonction de diagnostic n'effectue aucun appel externe.
- L'intégration reste désactivée tant que les paramètres, la réponse réelle et la compatibilité Cameroun ne sont pas vérifiés.
- Ne jamais communiquer le mot de passe Free Fire, un jeton de session ou un code de connexion.
- Ne jamais publier la clé API dans un dépôt ou une capture d'écran.
