"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gauge, Leaf, MoonStar, SlidersHorizontal, Sparkles, WalletCards, X } from "lucide-react";
import { JOURNEY_PRESETS, type JourneyPreset } from "@/lib/journey-fit";
import type { JourneyWeights } from "@/lib/types";

const presets: { key: JourneyPreset; label: string; description: string; icon: typeof Sparkles }[] = [
  { key: "balanced", label: "Balanced", description: "A composed mix", icon: Sparkles },
  { key: "value", label: "Value", description: "Spend with intention", icon: WalletCards },
  { key: "rested", label: "Arrive rested", description: "Protect your first day", icon: MoonStar },
  { key: "fastest", label: "Fastest", description: "Keep moving", icon: Gauge },
  { key: "lighter", label: "Lighter impact", description: "Lower estimated CO₂", icon: Leaf },
];

const sliders: { key: keyof JourneyWeights; label: string }[] = [
  { key: "value", label: "Value" },
  { key: "speed", label: "Speed" },
  { key: "rest", label: "Rest-friendly timing" },
  { key: "impact", label: "Lighter impact" },
];

type JourneyFitPanelProps = {
  activePreset: JourneyPreset | "custom";
  weights: JourneyWeights;
  tuningOpen: boolean;
  onPreset: (preset: JourneyPreset) => void;
  onWeights: (weights: JourneyWeights) => void;
  onToggleTuning: () => void;
};

export function JourneyFitPanel({
  activePreset,
  weights,
  tuningOpen,
  onPreset,
  onWeights,
  onToggleTuning,
}: JourneyFitPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="fit-panel" aria-labelledby="fit-heading">
      <div className="fit-heading">
        <div>
          <p className="eyebrow">Signature feature</p>
          <h3 id="fit-heading">Journey Fit</h3>
          <p>Rank the same flights around the way you want to arrive.</p>
        </div>
        <button type="button" className="tune-button" onClick={onToggleTuning} aria-expanded={tuningOpen}>
          {tuningOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
          {tuningOpen ? "Close" : "Fine-tune"}
        </button>
      </div>

      <div className="preset-row" role="group" aria-label="Journey Fit presets">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const active = activePreset === preset.key;
          return (
            <button
              key={preset.key}
              type="button"
              className={active ? "preset-card preset-card-active" : "preset-card"}
              onClick={() => onPreset(preset.key)}
              aria-pressed={active}
            >
              <Icon size={17} aria-hidden="true" />
              <span>
                <strong>{preset.label}</strong>
                <small>{preset.description}</small>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {tuningOpen && (
          <motion.div
            className="tuning-grid"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
          >
            {sliders.map(({ key, label }) => (
              <label className="tuning-control" key={key}>
                <span>
                  {label}
                  <output>{weights[key]}%</output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={weights[key]}
                  onChange={(event) => onWeights({ ...weights, [key]: Number(event.target.value) })}
                />
              </label>
            ))}
            <p className="tuning-note">
              Sliders are automatically normalized, so your preferences always combine into one clear score.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function weightsForPreset(preset: JourneyPreset) {
  return { ...JOURNEY_PRESETS[preset] };
}
