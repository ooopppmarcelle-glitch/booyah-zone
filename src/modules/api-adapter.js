// Provider boundary: never call a third-party player API from the browser.
// A future server function must own credentials, rate limits, consent and validation.
const PROVIDERS = {
  freeFireCommunity: {
    label: "Free Fire Community API",
    official: false,
    enabled: false,
    docs: "https://docs.freefirecommunity.com/",
    note: "Service indépendant de Garena. Région Cameroun à confirmer auprès du fournisseur."
  }
};
export function getProfileSourceStatus() {
  return {
    ready: false,
    providers: Object.values(PROVIDERS),
    message: "Aucune API externe activée. Utilise la saisie manuelle jusqu’à validation du fournisseur, de sa région et de ses conditions."
  };
}
export async function fetchPlayerProfile() {
  throw new Error("Aucune source de statistiques n’est encore activée pour BOOYAH ZONE.");
}
