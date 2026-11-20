const API_BASE_URL = "https://api.embed-project.thiraphatpp.com";

const noStoreHeaders = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const upstream = new URL("/api/telemetry", API_BASE_URL);
  for (const key of ["device_id", "limit", "from", "to"]) {
    const value = incoming.searchParams.get(key);
    if (value) upstream.searchParams.set(key, value);
  }
  try {
    const response = await fetch(upstream, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("Content-Type") ?? "application/json",
        ...noStoreHeaders,
      },
    });
  } catch {
    return Response.json(
      { error: "Telemetry API is temporarily unavailable." },
      { status: 502, headers: noStoreHeaders },
    );
  }
}
