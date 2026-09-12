import React, { useState } from "react";
import { MapPin, Navigation, Compass, ExternalLink, Sparkles } from "lucide-react";
import { Experience, NeighborhoodType } from "../types";
import { ExperienceCard } from "./ExperienceCard";

interface Props {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (exp: Experience) => void;
  onShare: (exp: Experience) => void;
}

// Neighborhood positions on a stylized vector Accra map canvas
const NEIGHBORHOOD_PINS: {
  name: NeighborhoodType;
  x: number; // percentage from left
  y: number; // percentage from top
  desc: string;
}[] = [
  { name: "Jamestown", x: 26, y: 72, desc: "Historic coastal lighthouse & arts" },
  { name: "Osu", x: 42, y: 64, desc: "Bustling nightlife, dining & shopping" },
  { name: "Labone", x: 50, y: 62, desc: "Intimate courtyards, cafes & dates" },
  { name: "Cantonments", x: 48, y: 52, desc: "Quiet upscale dining & diplomatic vibes" },
  { name: "Airport Residential", x: 52, y: 44, desc: "Modern lounges & artisan spots" },
  { name: "Dzorwulu", x: 44, y: 40, desc: "Cafes, sports & central hubs" },
  { name: "East Legon", x: 62, y: 34, desc: "Bowling, arcades, rooftop lounges" },
  { name: "Legon / Madina", x: 54, y: 26, desc: "Botanical gardens, canopy walks" },
  { name: "Spintex", x: 74, y: 48, desc: "Indoor games, eateries & fun" },
  { name: "Kokrobite", x: 12, y: 84, desc: "Beachfront surf, reggae & weekend sun" },
  { name: "Aburi Hills", x: 68, y: 12, desc: "Cool mountain breezes & quad bikes" },
];

export const InteractiveMapView: React.FC<Props> = ({
  experiences,
  onSelectExperience,
  isSaved,
  onToggleSave,
  onShare,
}) => {
  const [selectedPin, setSelectedPin] = useState<NeighborhoodType>("Osu");

  const filteredEscapes = experiences.filter(
    (e) => e.area.toLowerCase() === selectedPin.toLowerCase()
  );

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200 mb-1">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            Accra Escape Radar
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Neighborhood Map Explorer
          </h2>
          <p className="text-xs text-slate-500">
            Explore verified escapes across Greater Accra and scenic getaways.
          </p>
        </div>
      </div>

      {/* Stylized Vector Map Canvas */}
      <div className="relative w-full aspect-[2/1] sm:aspect-[2.4/1] bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950 rounded-2xl overflow-hidden border border-slate-800 p-4 select-none">
        {/* Coastal / Gulf of Guinea Indicator */}
        <div className="absolute bottom-0 inset-x-0 h-1/4 bg-teal-900/30 border-t border-teal-500/20 backdrop-blur-xs flex items-center justify-center text-[11px] font-semibold text-teal-400/80 tracking-widest uppercase">
          🌊 Gulf of Guinea (Accra Coastline)
        </div>

        {/* Aburi Mountain Ridge Top Indicator */}
        <div className="absolute top-2 right-4 text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
          ⛰️ Eastern Hills / Aburi Ridge
        </div>

        {/* Grid lines overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

        {/* Pins */}
        {NEIGHBORHOOD_PINS.map((pin) => {
          const count = experiences.filter((e) => e.area === pin.name).length;
          const isSelected = selectedPin === pin.name;

          return (
            <button
              key={pin.name}
              onClick={() => setSelectedPin(pin.name)}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-200 z-10 flex flex-col items-center`}
            >
              <div
                className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-full font-bold text-[10px] sm:text-xs transition-all shadow-md max-w-[92px] sm:max-w-none ${
                  isSelected
                    ? "bg-emerald-500 text-white scale-110 ring-4 ring-emerald-400/30"
                    : "bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                <MapPin className={`w-3 h-3 shrink-0 ${isSelected ? "text-white" : "text-emerald-400"}`} />
                <span className="truncate">{pin.name}</span>
                <span className="hidden sm:inline-block text-[10px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {count}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Neighborhood Tray */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900">
              Escapes in {selectedPin}
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              {filteredEscapes.length} spots
            </span>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            {NEIGHBORHOOD_PINS.find((p) => p.name === selectedPin)?.desc}
          </span>
        </div>

        {filteredEscapes.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500">
            More verified venues currently being surveyed in {selectedPin}. Check nearby clusters!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEscapes.map((exp) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                onSelect={onSelectExperience}
                isSaved={isSaved(exp.id)}
                onToggleSave={onToggleSave}
                onShare={onShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
