export default async function handler() {
  const apiKeyConfigured = Boolean(Netlify.env.get("FREEFIRE_API_KEY"));
  const cameroonConfirmed =
    Netlify.env.get("FREEFIRE_CAMEROON_CONFIRMED") === "true";

  let status = "waiting_for_api_key_and_region";
  if (apiKeyConfigured && !cameroonConfirmed) {
    status = "waiting_for_region_confirmation";
  } else if (!apiKeyConfigured && cameroonConfirmed) {
    status = "waiting_for_api_key";
  } else if (apiKeyConfigured && cameroonConfirmed) {
    status = "ready_for_a_controlled_provider_test";
  }

  return Response.json(
    {
      service: "BOOYAH ZONE",
      integration: "Free Fire Community API",
      status,
      apiKeyConfigured,
      cameroonConfirmed,
      providerCallsEnabled: false,
      note: "This endpoint reports configuration only. It never calls the provider or exposes secrets."
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
