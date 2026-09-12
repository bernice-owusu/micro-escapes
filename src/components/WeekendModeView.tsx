import React, { useState } from "react";
import {
  Calendar,
  Sparkles,
  Heart,
  Users,
  Coins,
  Compass,
  PartyPopper,
  Flame,
} from "lucide-react";
import { Experience } from "../types";
import { ExperienceCard } from "./ExperienceCard";

interface Props {
  experiences: Experience[];
  onSelectExperience: (exp: Experience) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (exp: Experience) => void;
  onShare: (exp: Experience) => void;
}

type WeekendTab = "under_100" | "dates" | "friends" | "resets" | "events" | "holidays";

export const WeekendModeView: React.FC<Props> = ({
  experiences,
  onSelectExperience,
  isSaved,
  onToggleSave,
  onShare,
}) => {
  const [activeTab, setActiveTab] = useState<WeekendTab>("under_100");

  const getFilteredList = () => {
    switch (activeTab) {
      case "under_100":
        return experiences.filter((e) => e.trueCost.totalPerPerson <= 100);
      case "dates":
        return experiences.filter(
          (e) => e.goodFor.includes("partner") || e.intents.includes("date")
        );
      case "friends":
        return experiences.filter(
          (e) => e.goodFor.includes("friends") || e.intents.includes("fun")
        );
      case "resets":
        return experiences.filter(
          (e) => e.intents.includes("relax") || e.goodFor.includes("solo")
        );
      case "events":
        return experiences.filter(
          (e) => e.isTemporaryEvent || e.intents.includes("party")
        );
      case "holidays":
        return experiences.filter(
          (e) => e.featured || e.area === "Kokrobite" || e.area === "Jamestown"
        );
      default:
        return experiences;
    }
  };

  const list = getFilteredList();

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            Curated Weekend & Holiday Pulse
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Weekends & Holidays in Accra
          </h2>
          <p className="text-xs text-slate-500">
            Hand-curated collections updated for this weekend's energy, coastal getaways, and upcoming Ghana public holidays.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
        <button
          onClick={() => setActiveTab("under_100")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            activeTab === "under_100"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          Under GH₵100 Escapes
        </button>

        <button
          onClick={() => setActiveTab("holidays")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer ${
            activeTab === "holidays"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <span>🇬🇭</span>
          Holiday & Day Trips
        </button>

        <button
          onClick={() => setActiveTab("dates")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === "dates"
              ? "bg-rose-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Top Date Spots
        </button>

        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === "friends"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Friend Group Hangouts
        </button>

        <button
          onClick={() => setActiveTab("resets")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === "resets"
              ? "bg-teal-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Sunday Resets
        </button>

        <button
          onClick={() => setActiveTab("events")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap transition ${
            activeTab === "events"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <PartyPopper className="w-3.5 h-3.5" />
          Events & Speakeasies
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((exp) => (
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
    </div>
  );
};
