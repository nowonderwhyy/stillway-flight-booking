"use client";

import Image from "next/image";
import { FormEvent, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpDown, CalendarDays, ChevronDown, Minus, Plus, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { DestinationGrid } from "@/components/destination-grid";
import { FlightCard } from "@/components/flight-card";
import { JourneyFitPanel, weightsForPreset } from "@/components/journey-fit-panel";
import { SiteFooter } from "@/components/site-footer";
import { TripSummary } from "@/components/trip-summary";
import { JOURNEY_PRESETS, rankFlights, rebalanceJourneyWeights, type JourneyPreset } from "@/lib/journey-fit";
import type { AirportSummary, FlightResult, JourneyWeights } from "@/lib/types";

type DefaultSearch = { origin: string; destination: string; departureDate: string; returnDate: string };
type SearchState = DefaultSearch & { travelers: number; roundTrip: boolean };

async function fetchFlights(origin: string, destination: string, date: string, travelers: number) {
  const params = new URLSearchParams({ origin, destination, date, travelers: String(travelers) });
  const response = await fetch(`/api/flights?${params.toString()}`);
  const payload = (await response.json()) as { flights?: FlightResult[]; error?: string };
  if (!response.ok) throw new Error(payload.error ?? "Stillway could not search those flights.");
  return payload.flights ?? [];
}

export function HomeExperience({ airports, defaultSearch }: { airports: AirportSummary[]; defaultSearch: DefaultSearch }) {
  const [search, setSearch] = useState<SearchState>({ ...defaultSearch, travelers: 1, roundTrip: true });
  const [outboundFlights, setOutboundFlights] = useState<FlightResult[]>([]);
  const [returnFlights, setReturnFlights] = useState<FlightResult[]>([]);
  const [selectedOutbound, setSelectedOutbound] = useState<FlightResult | null>(null);
  const [selectedReturn, setSelectedReturn] = useState<FlightResult | null>(null);
  const [phase, setPhase] = useState<"outbound" | "return">("outbound");
  const [activePreset, setActivePreset] = useState<JourneyPreset | "custom">("balanced");
  const [weights, setWeights] = useState<JourneyWeights>({ ...JOURNEY_PRESETS.balanced });
  const [tuningOpen, setTuningOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultsRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const rankedOutbound = useMemo(() => rankFlights(outboundFlights, weights), [outboundFlights, weights]);
  const rankedReturn = useMemo(() => rankFlights(returnFlights, weights), [returnFlights, weights]);
  const displayedFlights = phase === "outbound" ? rankedOutbound : rankedReturn;
  const selectedId = phase === "outbound" ? selectedOutbound?.id : selectedReturn?.id;

  function updateSearch<Key extends keyof SearchState>(key: Key, value: SearchState[Key]) {
    setSearch((current) => ({ ...current, [key]: value }));
  }

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (search.origin === search.destination) return setError("Choose two different airports.");
    if (search.roundTrip && (!search.returnDate || search.returnDate < search.departureDate)) {
      return setError("Choose a return date on or after your departure date.");
    }
    setLoading(true);
    setSelectedOutbound(null);
    setSelectedReturn(null);
    setPhase("outbound");
    try {
      const [outbound, returning] = await Promise.all([
        fetchFlights(search.origin, search.destination, search.departureDate, search.travelers),
        search.roundTrip ? fetchFlights(search.destination, search.origin, search.returnDate, search.travelers) : Promise.resolve([]),
      ]);
      setOutboundFlights(outbound);
      setReturnFlights(returning);
      setHasSearched(true);
      requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Stillway could not search those flights.");
    } finally {
      setLoading(false);
    }
  }

  function selectFlight(flight: FlightResult) {
    if (phase === "outbound") {
      setSelectedOutbound(flight);
      setSelectedReturn(null);
      if (search.roundTrip) {
        setPhase("return");
        requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }));
      }
    } else setSelectedReturn(flight);
  }

  function chooseDestination(code: string) {
    setSearch((current) => ({ ...current, destination: code }));
    searchRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }

  function selectPreset(preset: JourneyPreset) {
    setActivePreset(preset);
    setWeights(weightsForPreset(preset));
  }

  return (
    <>
      <main>
        <section className="hero-section" aria-labelledby="hero-heading">
          <Image src="/images/hero-flight.webp" alt="Sunlit clouds and an aircraft wing above the horizon" fill priority sizes="100vw" />
          <span className="hero-wash" />
          <motion.div className="shell hero-copy" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
            <p className="eyebrow hero-eyebrow">Flight search, rethought</p>
            <h1 id="hero-heading">Travel at<br />your rhythm.</h1>
            <p>Search a real sample inventory, choose what matters, and assemble a trip without an account or payment.</p>
            <button type="button" className="hero-link" onClick={() => searchRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" })}>Start with your trip <ArrowDown size={16} /></button>
          </motion.div>
        </section>

        <section className="search-zone" aria-label="Search sample flights">
          <div className="shell" ref={searchRef}>
            <form className="search-panel" onSubmit={handleSearch} aria-labelledby="planner-heading">
              <div className="planner-header">
                <div className="planner-heading">
                  <p className="eyebrow">Start here</p>
                  <h2 id="planner-heading">Plan your sample journey.</h2>
                  <p>Set the route and dates. Stillway will guide you through the rest.</p>
                </div>
                <div className="planner-header-actions">
                  <div className="trip-toggle" role="group" aria-label="Trip type">
                    <button type="button" className={search.roundTrip ? "active" : ""} onClick={() => updateSearch("roundTrip", true)} aria-pressed={search.roundTrip}>Round trip</button>
                    <button type="button" className={!search.roundTrip ? "active" : ""} onClick={() => updateSearch("roundTrip", false)} aria-pressed={!search.roundTrip}>One way</button>
                  </div>
                  <span className="demo-note"><ShieldCheck size={15} /> Demo only · no payment</span>
                </div>
              </div>

              <div className="planner-steps" aria-label="Booking steps">
                <span className={hasSearched ? "planner-step planner-step-complete" : "planner-step planner-step-active"}><b>1</b><span><strong>Search</strong><small>{hasSearched ? "Search complete" : "Route and dates"}</small></span></span>
                <span className={hasSearched ? "planner-step planner-step-active" : "planner-step"}><b>2</b><span><strong>Choose flights</strong><small>Compare what fits</small></span></span>
                <span className="planner-step"><b>3</b><span><strong>Guest details</strong><small>Confirm, no payment</small></span></span>
              </div>

              <div className="search-route">
                <label className="search-field route-field">
                  <span>From</span>
                  <select value={search.origin} onChange={(event) => updateSearch("origin", event.target.value)}>{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.code} — {airport.city}</option>)}</select>
                  <small>{airports.find((airport) => airport.code === search.origin)?.name}</small>
                  <ChevronDown className="select-chevron" size={18} aria-hidden="true" />
                </label>
                <button type="button" className="swap-button" onClick={() => setSearch((current) => ({ ...current, origin: current.destination, destination: current.origin }))} aria-label="Swap origin and destination"><ArrowUpDown size={16} /></button>
                <label className="search-field route-field">
                  <span>To</span>
                  <select value={search.destination} onChange={(event) => updateSearch("destination", event.target.value)}>{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.code} — {airport.city}</option>)}</select>
                  <small>{airports.find((airport) => airport.code === search.destination)?.name}</small>
                  <ChevronDown className="select-chevron" size={18} aria-hidden="true" />
                </label>
              </div>

              <div className={search.roundTrip ? "search-details search-details-roundtrip" : "search-details search-details-oneway"}>
                <label className="search-field date-field"><span><CalendarDays size={14} /> Depart</span><input type="date" value={search.departureDate} onChange={(event) => updateSearch("departureDate", event.target.value)} required /><small>Local departure date</small></label>
                {search.roundTrip && <label className="search-field date-field"><span><CalendarDays size={14} /> Return</span><input type="date" min={search.departureDate} value={search.returnDate} onChange={(event) => updateSearch("returnDate", event.target.value)} required /><small>Back to {search.origin}</small></label>}
                <div className="search-field traveler-field">
                  <span><Users size={14} /> Travelers</span>
                  <div><button type="button" onClick={() => updateSearch("travelers", Math.max(1, search.travelers - 1))} aria-label="Remove traveler" disabled={search.travelers === 1}><Minus size={14} /></button><strong>{search.travelers}</strong><button type="button" onClick={() => updateSearch("travelers", Math.min(6, search.travelers + 1))} aria-label="Add traveler" disabled={search.travelers === 6}><Plus size={14} /></button></div>
                  <small>Up to six guests</small>
                </div>
                <button className="search-button" type="submit" disabled={loading} aria-label="Search flights">
                  {loading ? <span className="button-spinner" aria-hidden="true" /> : <Search size={20} />}
                  <span><strong>{loading ? "Searching inventory" : "Show available flights"}</strong><small>{search.origin} to {search.destination} · {search.travelers} {search.travelers === 1 ? "traveler" : "travelers"}</small></span>
                </button>
              </div>
              {error && <p className="form-error" role="alert">{error}</p>}
            </form>
          </div>
        </section>

        <section className="booking-roadmap" aria-label="How Stillway works">
          <div className="shell roadmap-grid">
            <span><b>01</b><span><strong>Search real sample inventory</strong><small>Twenty SQLite-backed flight instances</small></span></span>
            <span><b>02</b><span><strong>Choose by your priorities</strong><small>Every ranking explains its tradeoffs</small></span></span>
            <span><b>03</b><span><strong>Confirm without friction</strong><small>No account, payment, or hidden total</small></span></span>
          </div>
        </section>

        <AnimatePresence initial={false}>
          {hasSearched && (
            <motion.section className="results-section" ref={resultsRef} aria-labelledby="results-heading" initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0.15 : 0.45 }}>
              <div className="shell">
                <div className="results-heading-row">
                  <div><p className="eyebrow">{phase === "outbound" ? "Step 1 of 2" : "Step 2 of 2"}</p><h2 id="results-heading">{phase === "outbound" ? `${search.origin} to ${search.destination}` : `${search.destination} to ${search.origin}`}</h2><p>{displayedFlights.length} sample {displayedFlights.length === 1 ? "option" : "options"} · sorted by your Journey Fit</p></div>
                  {phase === "return" && <button className="text-button" type="button" onClick={() => setPhase("outbound")}>Review outbound <ArrowRight size={14} /></button>}
                </div>
                <JourneyFitPanel activePreset={activePreset} weights={weights} tuningOpen={tuningOpen} onPreset={selectPreset} onWeightChange={(key, value) => { setWeights((current) => rebalanceJourneyWeights(current, key, value)); setActivePreset("custom"); }} onToggleTuning={() => setTuningOpen((open) => !open)} />
                <div className="results-workspace">
                  <div className="flight-list" aria-live="polite">
                    {displayedFlights.length === 0 ? <div className="empty-results"><Sparkles size={24} /><h3>No sample flights match those details.</h3><p>Try the prefilled ATL to SFO dates or choose another destination below.</p></div> : displayedFlights.map((flight, index) => <FlightCard key={flight.id} flight={flight} selected={selectedId === flight.id} rank={index + 1} selectionLabel={phase} onSelect={() => selectFlight(flight)} />)}
                  </div>
                  <TripSummary outbound={selectedOutbound} returning={selectedReturn} travelers={search.travelers} roundTrip={search.roundTrip} onEditOutbound={() => setPhase("outbound")} onEditReturn={() => setPhase("return")} />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <DestinationGrid onChoose={chooseDestination} />
      </main>
      <SiteFooter />
    </>
  );
}
