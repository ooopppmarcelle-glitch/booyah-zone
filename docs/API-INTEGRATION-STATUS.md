# État de l'intégration API — BOOYAH ZONE

## État : préparation uniquement

Les exemples JavaScript transmis identifient six routes : /info, /stats, /image, /bancheck, /wishlist et /craftland. Ils montrent un en-tête x-api-key. L'exemple /info montre les paramètres region et uid.

Le seul JSON reçu pour /stats contient brCareer_solo, brCareer_duo et brCareer_squad, tous vides. Cela ne permet pas de connaître les champs internes ni de garantir des statistiques non vides.

## Implémenté dans le dépôt
- Catalogue des six routes dans l'adaptateur.
- Normaliseur qui reconnaît les trois sections BR reçues.
- Une section vide est marquée indisponible, jamais convertie en zéro.
- L'adaptateur reste désactivé et ne réalise aucun appel réseau.

## Bloqueurs avant activation
- Confirmation écrite que les comptes de la région Cameroun/Afrique sont pris en charge.
- Paramètres exacts des routes et exemples de réponses réelles.
- Vérification des conditions d'utilisation, prix, quotas et limites.
- Fonction serveur sécurisée pour protéger la clé API, avec validation et limitation de débit.
- Consentement du joueur et affichage de la source/date des données.

## Consigne
Ne pas coller de clé API dans le dépôt GitHub, le navigateur, une capture d'écran ou une conversation. Ne jamais demander un mot de passe Free Fire, un jeton de session ou un code de connexion.
