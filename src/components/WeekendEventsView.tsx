import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Tag,
  Filter,
  MessageCircle,
  Check,
  ExternalLink,
} from "lucide-react";
import { WeekendEvent } from "../types";

interface Props {
  events: WeekendEvent[];
  onBookEventTicket: (event: WeekendEvent) => void;
  onOpenAdminVerify: () => void;
}

export const WeekendEventsView: React.FC<Props> = ({
  events,
  onBookEventTicket,
  onOpenAdminVerify,
}) => {
  const [selectedTiming, setSelectedTiming] = useState<"all" | "weekend" | "holiday">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showVerifiedOnly, setShowVerifiedOnly] = useState<boolean>(false);

  const categories = ["All", "Paint & Sip", "Comedy", "Pop-Up & Market", "Workshop", "Concert", "Food Festival"];

  const filteredEvents = events.filter((evt) => {
    if (selectedTiming === "weekend" && evt.timingType === "holiday") return false;
    if (selectedTiming === "holiday" && evt.timingType === "weekend") return false;
    if (selectedCategory !== "All" && evt.category !== selectedCategory) return false;
    if (showVerifiedOnly && !evt.isVerified) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Accra Events Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Events on Weekends & Holidays
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              From Saturday rooftop comedy and coastal beach bonfires to Kwame Nkrumah Day heritage walks and public holiday picnics. Aggregated and verified by the Micro Escapes team.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/233559184383?text=Hello!%20I%20would%20like%20to%20submit%20an%20event%20for%20a%20weekend%20or%20public%20holiday%20in%20Accra."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Submit Event (WhatsApp)</span>
            </a>
          </div>
        </div>

        {/* Ghana Holiday Spotlight Bar */}
        <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border border-amber-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">🇬🇭</span>
            <div>
              <span className="font-extrabold text-slate-900">Upcoming Ghana Holidays & Long Weekends: </span>
              <span className="text-slate-600">Kwame Nkrumah Memorial Day • Farmers' Day • Detty December • Independence Day</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-300">
              ⚡ Long Weekend Perks
            </span>
          </div>
        </div>

        {/* Primary Timing Filters (Weekends vs Public Holidays) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold">
            <button
              onClick={() => setSelectedTiming("all")}
              className={`px-3 py-2 rounded-lg transition cursor-pointer shrink-0 whitespace-nowrap ${
                selectedTiming === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setSelectedTiming("weekend")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                selectedTiming === "weekend"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📅 Weekends</span>
              <span className="text-[10px] opacity-70">
                ({events.filter((e) => e.timingType !== "holiday").length})
              </span>
            </button>
            <button
              onClick={() => setSelectedTiming("holiday")}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                selectedTiming === "holiday"
                  ? "bg-white text-emerald-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🇬🇭 Public Holidays</span>
              <span className="text-[10px] opacity-70">
                ({events.filter((e) => e.timingType === "holiday" || e.timingType === "long_weekend").length})
              </span>
            </button>
          </div>

          {/* Verified Only Toggle */}
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={(e) => setShowVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verified Escapes Only</span>
          </label>
        </div>

        {/* Category Filters */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Event Image Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                {/* Verification & Timing Badges */}
                <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {evt.isVerified ? (
                      <span className="bg-emerald-600/95 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                        ✓ Verified by Team
                      </span>
                    ) : (
                      <span className="bg-amber-500/95 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1 shadow-sm">
                        <AlertCircle className="w-3 h-3" />
                        Community Submitted
                      </span>
                    )}

                    {(evt.timingType === "holiday" || evt.timingType === "long_weekend") && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <span>🇬🇭</span>
                        <span>{evt.holidayName || "Public Holiday"}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Tag */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 text-slate-900 font-mono font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                    {typeof evt.priceGhc === "number" ? `GH₵${evt.priceGhc}` : evt.priceGhc}
                  </span>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    {evt.category}
                  </span>
                  <h3 className="font-black text-base leading-tight mt-0.5 line-clamp-2">
                    {evt.title}
                  </h3>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-900">{evt.date}</span>
                    <span className="text-slate-400">•</span>
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{evt.venue} ({evt.neighborhood})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {evt.description}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {evt.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
              <button
                onClick={() => onBookEventTicket(evt)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Book / RSVP</span>
              </button>

              <a
                href={`https://wa.me/233559184383?text=${encodeURIComponent(
                  `Hello! I want to enquire about tickets for: ${evt.title} on ${evt.date}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl transition"
                title="Enquire on WhatsApp (0559184383)"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
