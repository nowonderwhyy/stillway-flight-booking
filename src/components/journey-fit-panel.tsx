"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gauge, Leaf, MoonStar, SlidersHorizontal, Sparkles, WalletCards, X } from "lucide-react";
import { JOURNEY_PRESETS, type JourneyPreset } from "@/lib/journey-fit";
import type { JourneyWeights } from "@/lib/types";

const presets: { key: JourneyPreset; label: string; description: string; icon: typeof Sparkles }[] = [
  { key: "balanced", label: "Balanced", description: "No single priority leads", icon: Sparkles },
  { key: "value", label: "Spend less", description: "Lower fare, more flexibility", icon: WalletCards },
  { key: "rested", label: "Arrive rested", description: "Better hours, even if pricier", icon: MoonStar },
  { key: "fastest", label: "Fastest", description: "Less travel time, even if pricier", icon: Gauge },
  { key: "lighter", label: "Lighter impact", description: "Lower CO₂, flexible schedule", icon: Leaf },
];

const sliders: { key: keyof JourneyWeights; label: string; shortLabel: string }[] = [
  { key: "value", label: "Spend less", shortLabel: "Value" },
  { key: "speed", label: "Travel faster", shortLabel: "Speed" },
  { key: "rest", label: "Better timing", shortLabel: "Timing" },
  { key: "impact", label: "Lighter impact", shortLabel: "Impact" },
];

type JourneyFitPanelProps = {
  activePreset: JourneyPreset | "custom";
  weights: JourneyWeights;
  tuningOpen: boolean;
  onPreset: (preset: JourneyPreset) => void;
  onWeightChange: (key: keyof JourneyWeights, value: number) => void;
  onToggleTuning: () => void;
};

export function JourneyFitPanel({
  activePreset,
  weights,
  tuningOpen,
  onPreset,
  onWeightChange,
  onToggleTuning,
}: JourneyFitPanelProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="fit-panel" aria-labelledby="fit-heading">
      <div className="fit-heading">
        <div>
          <p className="eyebrow">Decision lens · Journey Fit</p>
          <h3 id="fit-heading">What are you willing to prioritize?</h3>
          <p>Every option keeps its fare and schedule visible. This only changes which flight rises first.</p>
        </div>
        <button type="button" className="tune-button" onClick={onToggleTuning} aria-expanded={tuningOpen}>
          {tuningOpen ? <X size={16} /> : <SlidersHorizontal size={16} />}
          {tuningOpen ? "Close custom mix" : "Build my mix"}
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
            className="tuning-drawer"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto", y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -8 }}
          >
            <div className="budget-heading">
              <span>
                <strong>Your 100-point priority budget</strong>
                <small>Raise one priority and the others make room.</small>
              </span>
              <strong>100 / 100</strong>
            </div>
            <div
              className="preference-budget"
              aria-label={`Priority budget: ${sliders.map(({ key, shortLabel }) => `${shortLabel} ${weights[key]} percent`).join(", ")}`}
            >
              {sliders.map(({ key, shortLabel }) => (
                <span key={key} className={`budget-${key}`} style={{ width: `${weights[key]}%` }} title={`${shortLabel}: ${weights[key]}%`} />
              ))}
            </div>
            <div className="tuning-grid">
              {sliders.map(({ key, label }) => (
                <label className="tuning-control" key={key}>
                  <span>
                    {label}
                    <output>{weights[key]} pts</output>
                  </span>
                  <input
                    type="range"
                    aria-label={label}
                    aria-valuetext={`${weights[key]} of 100 priority points`}
                    min="0"
                    max="100"
                    step="5"
                    value={weights[key]}
                    onChange={(event) => onWeightChange(key, Number(event.target.value))}
                  />
                </label>
              ))}
            </div>
            <p className="tuning-note">This is a real tradeoff: 100 points total, never 100 points in every category.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function weightsForPreset(preset: JourneyPreset) {
  return { ...JOURNEY_PRESETS[preset] };
}
