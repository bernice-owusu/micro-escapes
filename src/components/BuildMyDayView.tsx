import React, { useState } from "react";
import {
  CalendarDays,
  Sparkles,
  Users,
  Coins,
  Clock,
  ArrowRight,
  Share2,
  BookmarkPlus,
  RefreshCw,
  Car,
  MapPin,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Experience, DayItinerary, GroupType, IntentType } from "../types";

interface Props {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
  onClose?: () => void;
}

export const BuildMyDayView: React.FC<Props> = ({
  experiences,
  onSelectExperience,
  onClose,
}) => {
  const [selectedDay, setSelectedDay] = useState("Saturday");
  const [groupType, setGroupType] = useState<GroupType>("partner");
  const [targetBudget, setTargetBudget] = useState(250);
  const [vibe, setVibe] = useState<IntentType>("date");
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<DayItinerary | null>(null);

  // Generate Itinerary
  const generateItinerary = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/build-my-day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: selectedDay,
          group: groupType,
          budgetPerPerson: targetBudget,
          vibe: vibe,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.itinerary) {
          setItinerary(data.itinerary);
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Falling back to local itinerary composer", e);
    }

    // Local Fallback composer
    setTimeout(() => {
      // Pick suitable experiences based on group and vibe
      const suitable = experiences.filter(
        (e) => e.goodFor.includes(groupType) || e.intents.includes(vibe)
      );
      const pool = suitable.length >= 3 ? suitable : experiences;

      const stop1 = pool[0] || experiences[0];
      const stop2 = pool[1] || experiences[1];
      const stop3 = pool[2] || experiences[2];

      const total =
        Math.round(
          (stop1.trueCost.totalPerPerson +
            stop2.trueCost.totalPerPerson +
            stop3.trueCost.totalPerPerson) *
            0.85
        ); // account for shared taxi

      setItinerary({
        id: "day-" + Date.now(),
        title: `The Ultimate ${selectedDay} in Accra for ${
          groupType === "partner" ? "Two" : groupType === "friends" ? "Friends" : "Solo Explorers"
        }`,
        summary: `A carefully paced flow through ${stop1.area} and ${stop3.area}, balancing memorable activities with relaxed conversation.`,
        targetBudget,
        totalCost: total,
        group: groupType,
        stops: [
          {
            timeSlot: "Morning (10:00 AM)",
            experienceId: stop1.id,
            experienceName: stop1.name,
            area: stop1.area,
            activity: stop1.activities[0] || "Exploration",
            costEstimate: stop1.trueCost.totalPerPerson,
            travelTimeToNext: "15 min Bolt ride",
            insiderNote: "Start unhurried before the midday Accra heat sets in.",
          },
          {
            timeSlot: "Afternoon (1:30 PM)",
            experienceId: stop2.id,
            experienceName: stop2.name,
            area: stop2.area,
            activity: stop2.activities[0] || "Hands-on activity & lunch",
            costEstimate: stop2.trueCost.totalPerPerson,
            travelTimeToNext: "12 min ride",
            insiderNote: "Great air conditioning and relaxed social energy.",
          },
          {
            timeSlot: "Golden Hour & Evening (5:30 PM)",
            experienceId: stop3.id,
            experienceName: stop3.name,
            area: stop3.area,
            activity: stop3.activities[0] || "Sunset breeze & dinner",
            costEstimate: stop3.trueCost.totalPerPerson,
            insiderNote: "Catch the Accra twilight breeze as the night comes alive.",
          },
        ],
      });
      setIsLoading(false);
    }, 600);
  };

  const handleShareWhatsApp = () => {
    if (!itinerary) return;
    let text = `✨ *${itinerary.title}*\n_${itinerary.summary}_\n\n`;
    itinerary.stops.forEach((s) => {
      text += `🕒 *${s.timeSlot}*: ${s.experienceName} (${s.area})\n- Activity: ${s.activity}\n- Est. Cost: GH₵${s.costEstimate}\n${s.travelTimeToNext ? `🚗 ${s.travelTimeToNext} to next stop\n` : ""}\n`;
    });
    text += `\n💰 *Total Day Estimate:* ~GH₵${itinerary.totalCost} per person\nPlanned with Micro Escapes (Accra)`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-800 text-xs font-bold px-3 py-1 rounded-full border border-purple-200 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
            Full Day Planning Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Build My Day in Accra
          </h2>
          <p className="text-xs text-slate-500">
            Get an effortlessly sequenced morning-to-night itinerary with realistic travel times.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-1 rounded-lg border border-slate-200"
          >
            Back to Escapes
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Day of week:
          </label>
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-medium"
          >
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
            <option value="Friday Evening">Friday Evening</option>
            <option value="Today">Today</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Who with:
          </label>
          <select
            value={groupType}
            onChange={(e) => setGroupType(e.target.value as GroupType)}
            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-medium"
          >
            <option value="partner">Date / Partner</option>
            <option value="friends">Friend Group</option>
            <option value="solo">Solo Day Out</option>
            <option value="family">Family</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Vibe:
          </label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value as IntentType)}
            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-slate-800 font-medium"
          >
            <option value="date">Romantic & Intimate</option>
            <option value="fun">Fun & Social Banter</option>
            <option value="relax">Chill & Restorative</option>
            <option value="adventure">Active & Outdoor</option>
            <option value="create">Artistic & Cultural</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Budget (GH₵{targetBudget}):
          </label>
          <input
            type="range"
            min="100"
            max="600"
            step="50"
            value={targetBudget}
            onChange={(e) => setTargetBudget(Number(e.target.value))}
            className="w-full accent-purple-600 mt-2"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateItinerary}
          disabled={isLoading}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Crafting Personalized Accra Day...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate My {selectedDay} Plan
            </>
          )}
        </button>
      </div>

      {/* Generated Itinerary Display */}
      {itinerary && (
        <div className="mt-4 p-5 bg-gradient-to-b from-purple-50/40 to-white rounded-3xl border border-purple-200/80 space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-100 pb-3">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                {itinerary.title}
              </h3>
              <p className="text-xs text-slate-600 max-w-xl">{itinerary.summary}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                  Est. Outing Total
                </span>
                <span className="text-sm font-extrabold text-purple-800">
                  ~GH₵{itinerary.totalCost}
                </span>
              </div>
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition shadow-xs"
                title="Send full day plan to group on WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share on WhatsApp
              </button>
            </div>
          </div>

          {/* Timeline Sequence */}
          <div className="space-y-4">
            {itinerary.stops.map((stop, idx) => {
              const matchedExp = experiences.find((e) => e.id === stop.experienceId);
              return (
                <div key={idx} className="relative">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-purple-300 transition space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="bg-purple-100 text-purple-900 font-bold text-[11px] px-2.5 py-0.5 rounded-full">
                        {stop.timeSlot}
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Est. GH₵{stop.costEstimate}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base hover:text-purple-700 transition">
                          {stop.experienceName}
                        </h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-purple-600" />
                          {stop.area} • {stop.activity}
                        </span>
                      </div>

                      {matchedExp && (
                        <button
                          onClick={() => onSelectExperience(matchedExp)}
                          className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 shrink-0 bg-purple-50 px-2.5 py-1.5 rounded-lg transition"
                        >
                          View Details
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 italic">
                      &ldquo;{stop.insiderNote}&rdquo;
                    </p>
                  </div>

                  {/* Connecting Transit indicator */}
                  {stop.travelTimeToNext && (
                    <div className="py-2.5 flex items-center justify-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 text-slate-600 text-[11px] font-semibold px-3 py-1 rounded-full">
                        <Car className="w-3 h-3 text-purple-600" />
                        {stop.travelTimeToNext}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
