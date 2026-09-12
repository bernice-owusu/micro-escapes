import React from "react";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  CheckCircle2,
  Sparkles,
  Trophy,
  Tag,
  Flame,
  Compass,
} from "lucide-react";
import { Experience, RecommendationBadge } from "../types";
import { TrueCostBadge } from "./TrueCostBadge";

interface Props {
  experience: Experience;
  onSelect: (exp: Experience) => void;
  isSaved?: boolean;
  onToggleSave?: (exp: Experience) => void;
  onShare?: (exp: Experience) => void;
}

export const ExperienceCard: React.FC<Props> = ({
  experience,
  onSelect,
  isSaved = false,
  onToggleSave,
  onShare,
}) => {
  const renderBadge = (badge?: RecommendationBadge) => {
    switch (badge) {
      case "best_match":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <Trophy className="w-3 h-3" /> 🥇 Best Match
          </span>
        );
      case "best_value":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <Tag className="w-3 h-3" /> 🥈 Best Value
          </span>
        );
      case "best_rated":
        return (
          <span className="inline-flex items-center gap-1 bg-purple-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <Star className="w-3 h-3 fill-current" /> 🥉 Best Rated
          </span>
        );
      case "hidden_gem":
        return (
          <span className="inline-flex items-center gap-1 bg-cyan-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <Sparkles className="w-3 h-3" /> 💎 Hidden Gem
          </span>
        );
      case "closest":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <MapPin className="w-3 h-3" /> 📍 Closest
          </span>
        );
      case "most_popular":
        return (
          <span className="inline-flex items-center gap-1 bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
            <Flame className="w-3 h-3" /> 🔥 Popular
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id={`experience-card-${experience.id}`}
      onClick={() => onSelect(experience)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
    >
      {/* Photo & Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={experience.photos[0]}
          alt={experience.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Row: Badges & Actions */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            {experience.badgeType && renderBadge(experience.badgeType)}
            {experience.matchScore && (
              <span className="bg-slate-900/80 backdrop-blur-xs text-emerald-400 font-bold px-2 py-0.5 rounded-full text-xs border border-emerald-500/30">
                {experience.matchScore}% Match
              </span>
            )}
            {experience.isTemporaryEvent && (
              <span className="bg-rose-500 text-white font-semibold px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                Event
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(experience);
                }}
                className={`p-2 rounded-full backdrop-blur-md transition focus-visible:outline-2 focus-visible:outline-emerald-300 ${
                  isSaved
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-black/40 hover:bg-black/60 text-white"
                }`}
                title={isSaved ? "Saved in My Escapes" : "Save to My Escapes"}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              </button>
            )}

            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(experience);
                }}
                className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition focus-visible:outline-2 focus-visible:outline-emerald-300"
                title="Share this escape with friends on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Floating Row: Neighborhood & Category */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 font-semibold drop-shadow-md">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            {experience.area}
          </span>
          <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md font-medium text-[11px]">
            {experience.category}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition line-clamp-2">
              {experience.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/60 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{experience.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal text-[11px]">
                ({experience.reviewCount})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {experience.tagline}
          </p>
        </div>

        {/* "What Can I Do There?" Section (PRD Section 17) */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Compass className="w-3 h-3 text-emerald-600" /> What can you do?
          </div>
          <div className="flex flex-wrap gap-1">
            {experience.activities.slice(0, 3).map((act, i) => (
              <span
                key={i}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                {act}
              </span>
            ))}
            {experience.activities.length > 3 && (
              <span className="text-[11px] text-slate-400 self-center">
                +{experience.activities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* "Why We Picked It" Match Reasons (If available from recommendation) */}
        {experience.matchReasons && experience.matchReasons.length > 0 && (
          <div className="bg-emerald-50/50 rounded-xl p-2.5 border border-emerald-100 text-[11px] text-emerald-900 space-y-1">
            <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider">
              Why we picked it:
            </span>
            {experience.matchReasons.slice(0, 2).map((reason, idx) => (
              <div key={idx} className="flex items-start gap-1 leading-tight">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer: True Cost & Duration & Verification */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs flex-wrap">
          <TrueCostBadge trueCost={experience.trueCost} compact />

          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {experience.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
