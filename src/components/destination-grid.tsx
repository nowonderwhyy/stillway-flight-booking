"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const destinations = [
  { code: "SFO", city: "San Francisco", note: "Fog, light, and the Pacific edge", image: "/images/san-francisco.webp" },
  { code: "JFK", city: "New York", note: "An early start in the city", image: "/images/new-york.webp" },
  { code: "MIA", city: "Miami", note: "Warm water, slower mornings", image: "/images/miami.webp" },
  { code: "SEA", city: "Seattle", note: "Evergreen air and open water", image: "/images/seattle.webp" },
  { code: "ORD", city: "Chicago", note: "Architecture along the river", image: "/images/chicago.webp" },
];

export function DestinationGrid({ onChoose }: { onChoose: (code: string) => void }) {
  return (
    <section className="destination-section" id="explore" aria-labelledby="destination-heading">
      <div className="shell">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">From Atlanta</p>
            <h2 id="destination-heading">A change of pace, thoughtfully chosen.</h2>
          </div>
          <p>Five sample routes, each with a different rhythm. Choose one to place it into your search.</p>
        </div>
        <div className="destination-grid">
          {destinations.map((destination, index) => (
            <button
              className={`destination-card destination-card-${index + 1}`}
              key={destination.code}
              type="button"
              onClick={() => onChoose(destination.code)}
              aria-label={`Search sample flights to ${destination.city}`}
            >
              <Image src={destination.image} alt="" fill sizes="(max-width: 720px) 92vw, 40vw" />
              <span className="destination-shade" />
              <span className="destination-copy">
                <span>
                  <small>{destination.code}</small>
                  <strong>{destination.city}</strong>
                  <em>{destination.note}</em>
                </span>
                <span className="destination-arrow" aria-hidden="true">
                  <ArrowUpRight size={18} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
