export {};

async function requireOk(url: string) {
  const response = await fetch(url, { signal: AbortSignal.timeout(5_000) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response;
}

async function main() {
  const baseUrl = process.env.STILLWAY_URL ?? "http://127.0.0.1:3000";
  const pageResponse = await requireOk(baseUrl);
  const html = await pageResponse.text();
  const assetPaths = [...html.matchAll(/(?:src|href)="([^"]*\/_next\/static\/[^"]+\.(?:js|css))"/g)]
    .map((match) => match[1])
    .filter((path, index, paths) => paths.indexOf(path) === index);

  if (assetPaths.length === 0) {
    throw new Error("Stillway rendered no Next.js client assets; the page cannot hydrate.");
  }

  await Promise.all(assetPaths.map((assetPath) => requireOk(new URL(assetPath, baseUrl).toString())));
  const health = await (await requireOk(`${baseUrl}/api/health`)).json() as { status?: string; flights?: number };

  if (health.status !== "ok") throw new Error(`Stillway health status is ${health.status ?? "missing"}.`);
  if (!Number.isInteger(health.flights) || (health.flights ?? 0) < 20) {
    throw new Error(`Stillway expected at least 20 seeded flights but reported ${health.flights ?? "missing"}.`);
  }

  console.log("Stillway runtime verification");
  console.log(`  page: ${baseUrl}`);
  console.log(`  client assets: ${assetPaths.length} loaded`);
  console.log(`  database health: ${health.status ?? "unknown"}`);
  console.log(`  flights: ${health.flights ?? "unknown"}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
