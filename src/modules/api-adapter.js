// BOOYAH ZONE provider boundary.
// Never expose the provider API key in browser code.
// Live requests remain disabled until regional coverage, terms, quotas and
// a protected server-side gateway have been verified.
const PROVIDER = {
  id: "freefire-community",
  label: "Free Fire Community API",
  official: false,
  enabled: false,
  docs: "https://docs.freefirecommunity.com/",
  endpoints: ["/info", "/stats", "/image", "/bancheck", "/wishlist", "/craftland"],
  note: "Service communautaire indépendant de Garena. Prise en charge du Cameroun non confirmée."
};
const BR_CAREER_KEYS = ["brCareer_solo", "brCareer_duo", "brCareer_squad"];

export function getProfileSourceStatus() {
  return {
    ready: false,
    providers: [PROVIDER],
    message: "Connexion externe désactivée : couverture Cameroun, autorisations, quotas et réponses réelles à confirmer."
  };
}

// Empty objects remain unavailable. Missing values are never fabricated as zero.
export function normalizeStatsResponse(payload) {
  const source = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {};
  const brCareer = Object.fromEntries(BR_CAREER_KEYS.map((key) => {
    const value = source[key];
    const data = value && typeof value === "object" && !Array.isArray(value) ? value : null;
    return [key, { available: Boolean(data && Object.keys(data).length > 0), data: data || null }];
  }));
  const knownKeys = new Set(BR_CAREER_KEYS);
  const additionalSections = Object.fromEntries(Object.entries(source).filter(([key]) => !knownKeys.has(key)));
  return {
    provider: PROVIDER.id,
    official: false,
    received: Object.keys(source).length > 0,
    brCareer,
    additionalSections,
    raw: source
  };
}

export function getSupportedEndpointCatalog() {
  return PROVIDER.endpoints.map((endpoint) => ({ endpoint, enabled: false, requiresServerGateway: true }));
}

export async function fetchPlayerProfile() {
  throw new Error("Connexion API désactivée : aucune clé ni passerelle serveur n’a été configurée.");
}
