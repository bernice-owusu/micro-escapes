import React, { useState, useEffect } from "react";
import {
  X,
  Shuffle,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  ArrowRight,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { Experience, BudgetTier, NeighborhoodType } from "../types";
import { TrueCostBadge } from "./TrueCostBadge";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
}

export const SurpriseMeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  experiences,
  onSelectExperience,
}) => {
  const [budgetTier, setBudgetTier] = useState<BudgetTier | "any">("100_200");
  const [selectedArea, setSelectedArea] = useState<NeighborhoodType>("Anywhere in Accra");
  const [currentPick, setCurrentPick] = useState<Experience | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollEscape = () => {
    setIsRolling(true);

    setTimeout(() => {
      // Filter candidates
      let pool = experiences;
      if (budgetTier !== "any") {
        let maxCost = 200;
        if (budgetTier === "under_50") maxCost = 50;
        else if (budgetTier === "50_100") maxCost = 100;
        else if (budgetTier === "100_200") maxCost = 200;
        else if (budgetTier === "200_500") maxCost = 500;
        else maxCost = 1500;
        pool = pool.filter((e) => e.trueCost.totalPerPerson <= maxCost * 1.2);
      }

      if (selectedArea !== "Anywhere in Accra") {
        const matchingArea = pool.filter(
          (e) => e.area.toLowerCase() === selectedArea.toLowerCase()
        );
        if (matchingArea.length > 0) pool = matchingArea;
      }

      if (pool.length === 0) pool = experiences;

      // Pick randomly
      const randomIdx = Math.floor(Math.random() * pool.length);
      setCurrentPick(pool[randomIdx]);
      setIsRolling(false);
    }, 450);
  };

  useEffect(() => {
    if (isOpen && !currentPick) {
      rollEscape();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
            <Shuffle className="w-3.5 h-3.5 text-amber-600" />
            Spontaneous Escape Roll
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            &ldquo;I just want to get out.&rdquo;
          </h2>
          <p className="text-xs text-slate-500">
            No decision fatigue. Set quick limits and let fate pick your Accra outing.
          </p>
        </div>

        {/* Quick Constraints */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Budget</label>
            <select
              value={budgetTier}
              onChange={(e) => setBudgetTier(e.target.value as BudgetTier | "any")}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-2 focus:outline-emerald-500"
            >
              <option value="any">Any Budget</option>
              <option value="under_50">Under GH₵50</option>
              <option value="50_100">GH₵50–100</option>
              <option value="100_200">GH₵100–200</option>
              <option value="200_500">GH₵200–500</option>
              <option value="500_plus">GH₵500+</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Neighborhood</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value as NeighborhoodType)}
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-2 focus:outline-emerald-500"
            >
              <option value="Anywhere in Accra">Anywhere in Accra</option>
              <option value="Osu">Osu</option>
              <option value="East Legon">East Legon</option>
              <option value="Labone">Labone</option>
              <option value="Airport Residential">Airport</option>
              <option value="Jamestown">Jamestown</option>
              <option value="Kokrobite">Kokrobite</option>
              <option value="Aburi Hills">Aburi Hills</option>
            </select>
          </div>
        </div>

        {!currentPick && (
          <div className="border rounded-2xl overflow-hidden bg-white shadow-sm" aria-hidden="true">
            <div className="aspect-[16/9] bg-slate-100 animate-pulse" />
            <div className="p-4 space-y-2.5 animate-pulse">
              <div className="h-3 bg-slate-100 rounded-full w-3/4" />
              <div className="h-3 bg-slate-100 rounded-full w-1/2" />
              <div className="h-3 bg-slate-100 rounded-full w-2/3" />
            </div>
          </div>
        )}

        {currentPick && (
          <div
            className={`border rounded-2xl overflow-hidden bg-white shadow-sm transition-all duration-300 ${
              isRolling ? "opacity-30 scale-95" : "opacity-100 scale-100 border-amber-300"
            }`}
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
              <img
                src={currentPick.photos[0]}
                alt={currentPick.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="bg-amber-500 font-bold text-[11px] px-2 py-0.5 rounded-full text-white inline-block mb-1">
                  🎲 Today's Surprise Destination
                </span>
                <h3 className="font-bold text-base text-white">{currentPick.name}</h3>
                <span className="text-xs text-amber-200 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {currentPick.area} • {currentPick.category}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2.5 text-xs">
              <p className="text-slate-700 leading-relaxed italic">
                &ldquo;{currentPick.tagline}&rdquo;
              </p>

              <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
                <TrueCostBadge trueCost={currentPick.trueCost} compact />
                <span className="text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {currentPick.duration}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {currentPick.activities.slice(0, 3).map((act, i) => (
                  <span
                    key={i}
                    className="bg-slate-100 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={rollEscape}
            disabled={isRolling}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRolling ? "animate-spin" : ""}`} />
            Roll Another Surprise
          </button>

          {currentPick && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectExperience(currentPick);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition"
            >
              Let's Go Here!
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
