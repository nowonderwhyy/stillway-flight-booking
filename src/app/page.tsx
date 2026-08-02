import { HomeExperience } from "@/components/home-experience";
import { SiteHeader } from "@/components/site-header";
import { getDefaultSearch, listAirports } from "@/lib/flight-service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [airports, defaultSearch] = await Promise.all([listAirports(), getDefaultSearch()]);

  if (!defaultSearch) {
    return (
      <main className="setup-state">
        <h1>Stillway needs its sample flights.</h1>
        <p>Run <code>npm run db:setup</code>, then refresh this page.</p>
      </main>
    );
  }

  return (
    <>
      <SiteHeader overlay />
      <HomeExperience
        airports={airports.map((airport) => ({
          code: airport.code,
          city: airport.city,
          name: airport.name,
          timezone: airport.timezone,
        }))}
        defaultSearch={defaultSearch}
      />
    </>
  );
}
