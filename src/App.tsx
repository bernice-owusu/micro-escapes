/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Compass,
  CalendarDays,
  Flame,
  Heart,
  MapPin,
  Shuffle,
  ShieldCheck,
  Share2,
  WifiOff,
  SlidersHorizontal,
  ChevronDown,
  X,
  MessageCircle,
} from "lucide-react";
import { INITIAL_EXPERIENCES } from "./data/curatedEscapes";
import { Experience, RecommendationFilter, SavedFolder, UGCTip } from "./types";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { ExperienceDetailModal } from "./components/ExperienceDetailModal";
import { SurpriseMeModal } from "./components/SurpriseMeModal";
import { BuildMyDayView } from "./components/BuildMyDayView";
import { WeekendModeView } from "./components/WeekendModeView";
import { MyEscapesView } from "./components/MyEscapesView";
import { InteractiveMapView } from "./components/InteractiveMapView";
import { AdminPortalModal } from "./components/AdminPortalModal";
import { GamifiedEscapeFinder } from "./components/GamifiedEscapeFinder";
import { LoyaltyPassportView } from "./components/LoyaltyPassportView";
import { WeekendEventsView } from "./components/WeekendEventsView";
import { EscapeWheelModal } from "./components/EscapeWheelModal";
import { BookingCheckoutModal } from "./components/BookingCheckoutModal";
import { BusinessFeaturedModal } from "./components/BusinessFeaturedModal";
import {
  INITIAL_PASSPORT_STAMPS,
  INITIAL_WEEKLY_CHALLENGES,
} from "./data/loyaltyData";
import { INITIAL_WEEKEND_EVENTS } from "./data/curatedEvents";
import {
  BookingRecord,
  FeaturedRequest,
  PassportStamp,
  WeeklyChallenge,
  WeekendEvent,
} from "./types";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

type AppView =
  | "recommend"
  | "events"
  | "loyalty"
  | "weekend"
  | "day"
  | "map"
  | "saved";

const INITIAL_SAVED_FOLDERS: SavedFolder[] = [
  {
    id: "f-dates",
    name: "Date Ideas",
    experienceIds: ["exp-2", "exp-4"],
    isDefault: true,
  },
  {
    id: "f-try",
    name: "Things to Try",
    experienceIds: ["exp-1", "exp-7"],
    isDefault: true,
  },
  {
    id: "f-friends",
    name: "Friend Hangouts",
    experienceIds: ["exp-1", "exp-6"],
    isDefault: true,
  },
];

export default function App() {
  const isOnline = useOnlineStatus();

  // Experiences database (with localStorage persistence)
  const [experiences, setExperiences] = useState<Experience[]>(() => {
    try {
      const saved = localStorage.getItem("micro_escapes_venues");
      if (saved) {
        const parsed: Experience[] = JSON.parse(saved);
        // Ensure booking number is always synced to 0559184383 (WhatsApp: 233559184383)
        return parsed.map((exp) => ({
          ...exp,
          contact: {
            ...exp.contact,
            whatsapp: "233559184383",
            phone: exp.contact?.phone?.includes("55 918")
              ? exp.contact.phone
              : "+233 55 918 4383",
          },
        }));
      }
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_EXPERIENCES;
  });

  // Saved Folders
  const [savedFolders, setSavedFolders] = useState<SavedFolder[]>(() => {
    try {
      const saved = localStorage.getItem("micro_escapes_saved_folders");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return INITIAL_SAVED_FOLDERS;
  });

  // Active view navigation
  const [currentView, setCurrentView] = useState<AppView>("recommend");

  // Loyalty Points & Passport State
  const [escapePoints, setEscapePoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("micro_escapes_points");
      if (saved) return Number(saved);
    } catch (e) {}
    return 640;
  });

  const [passportStamps, setPassportStamps] = useState<PassportStamp[]>(() => {
    try {
      const saved = localStorage.getItem("micro_escapes_stamps");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PASSPORT_STAMPS;
  });

  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>(
    () => {
      try {
        const saved = localStorage.getItem("micro_escapes_challenges");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return INITIAL_WEEKLY_CHALLENGES;
    },
  );

  // Weekend Events Layer
  const [weekendEvents, setWeekendEvents] = useState<WeekendEvent[]>(() => {
    try {
      const saved = localStorage.getItem("micro_escapes_events");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WEEKEND_EVENTS;
  });

  // Business Featured Requests
  const [featuredRequests, setFeaturedRequests] = useState<FeaturedRequest[]>(
    () => {
      try {
        const saved = localStorage.getItem("micro_escapes_featured_reqs");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return [
        {
          id: "req-sandbox",
          businessName: "Sandbox Beach Club",
          contactPerson: "Nana Kwesi",
          email: "reservations@sandbox.gh",
          phone: "0559184383",
          experienceName: "Sunset Sangria & Seafood Lounge Deck",
          campaignDates: "September Weekend Spotlight",
          targetAudience: "Couples & Friends",
          preferredPlacement: "Hero Banner",
          budgetGhc: 1500,
          status: "approved",
          submittedAt: "2 days ago",
        },
        {
          id: "req-bliss",
          businessName: "Bliss Family Entertainment",
          contactPerson: "Akua Osei",
          email: "events@blissaccra.com",
          phone: "0559184383",
          experienceName: "Weekend Glow Bowling Squad Package",
          campaignDates: "This Friday–Sunday",
          targetAudience: "Squads & Birthday Hangouts",
          preferredPlacement: "Weekend Highlight",
          budgetGhc: 1000,
          status: "pending",
          submittedAt: "1 day ago",
        },
      ];
    },
  );

  // Bookings Record
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem("micro_escapes_bookings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Active Recommendation Filters
  const [filters, setFilters] = useState<RecommendationFilter>({
    intent: null,
    activity: null,
    group: "friends",
    budgetTier: "100_200",
    customMaxBudget: null,
    location: "Anywhere in Accra",
    distanceLimit: "anywhere",
    distance: "anywhere",
    dayOfWeek: "any",
    timeOfDay: "afternoon",
    duration: "2–3 hours",
  });

  // Modals
  const [selectedExperience, setSelectedExperience] =
    useState<Experience | null>(null);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [bookingModalState, setBookingModalState] = useState<{
    isOpen: boolean;
    experience: Experience | null;
    partySize: number;
  }>({
    isOpen: false,
    experience: null,
    partySize: 2,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle URL deep links from Landing Page, Telegram Bot & external apps
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view") as AppView | null;
      if (
        viewParam &&
        ["recommend", "events", "loyalty", "weekend", "day", "map", "saved"].includes(viewParam)
      ) {
        setCurrentView(viewParam);
      }

      const expParam = params.get("exp");
      if (expParam) {
        const found = experiences.find(
          (e) =>
            e.id.toLowerCase() === expParam.toLowerCase() ||
            e.name.toLowerCase().includes(expParam.toLowerCase())
        );
        if (found) {
          const action = params.get("action");
          if (action === "book") {
            const partySize = Number(params.get("party")) || 2;
            setBookingModalState({
              isOpen: true,
              experience: found,
              partySize,
            });
          } else {
            setSelectedExperience(found);
          }
        }
      }

      const actionParam = params.get("action");
      if (actionParam === "wheel") {
        setIsWheelOpen(true);
      } else if (actionParam === "surprise") {
        setIsSurpriseModalOpen(true);
      } else if (actionParam === "admin" || actionParam === "merchant") {
        setIsAdminModalOpen(true);
      }
    } catch (e) {
      console.warn("Error parsing URL parameters:", e);
    }
  }, [experiences]);

  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= 36) {
        setIsHeaderHidden(false);
      } else if (y > lastScrollY.current && y - lastScrollY.current >= 4) {
        setIsHeaderHidden(true);
      } else if (lastScrollY.current - y >= 4) {
        setIsHeaderHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Persist experiences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("micro_escapes_venues", JSON.stringify(experiences));
    } catch (e) {
      console.warn(e);
    }
  }, [experiences]);

  // Persist saved folders
  useEffect(() => {
    try {
      localStorage.setItem(
        "micro_escapes_saved_folders",
        JSON.stringify(savedFolders),
      );
    } catch (e) {
      console.warn(e);
    }
  }, [savedFolders]);

  // Persist points, stamps, challenges, bookings, and featured requests
  useEffect(() => {
    try {
      localStorage.setItem("micro_escapes_points", String(escapePoints));
      localStorage.setItem(
        "micro_escapes_stamps",
        JSON.stringify(passportStamps),
      );
      localStorage.setItem(
        "micro_escapes_challenges",
        JSON.stringify(weeklyChallenges),
      );
      localStorage.setItem("micro_escapes_bookings", JSON.stringify(bookings));
      localStorage.setItem(
        "micro_escapes_featured_reqs",
        JSON.stringify(featuredRequests),
      );
    } catch (e) {
      console.warn(e);
    }
  }, [
    escapePoints,
    passportStamps,
    weeklyChallenges,
    bookings,
    featuredRequests,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Handle booking confirmed: awards points, unlocks passport stamp
  const handleBookingConfirmed = (booking: BookingRecord) => {
    setBookings((prev) => [booking, ...prev]);
    const earned = booking.pointsEarned || 50;
    setEscapePoints((prev) => prev + earned);

    // Check if we should unlock/stamp a category in the passport
    const matchedExp = experiences.find((e) => e.id === booking.experienceId);
    if (matchedExp) {
      setPassportStamps((prev) =>
        prev.map((stamp) => {
          if (
            !stamp.isUnlocked &&
            (matchedExp.category
              .toLowerCase()
              .includes(stamp.category.toLowerCase()) ||
              matchedExp.activities.some((act) =>
                stamp.activityName.toLowerCase().includes(act.toLowerCase()),
              ))
          ) {
            return {
              ...stamp,
              isUnlocked: true,
              unlockedDate: "Today",
              venueName: booking.experienceName,
              stampNote: `Escaped to ${booking.experienceName} in ${booking.experienceArea}!`,
            };
          }
          return stamp;
        }),
      );
    }

    showToast(`Escape Reserved! +${earned} Escape Points credited 🎉`);
  };

  const handleClaimReviewPoints = (pts: number) => {
    setEscapePoints((prev) => prev + pts);
    showToast(`+${pts} Points awarded for your verified review!`);
  };

  const handleClaimChallenge = (challengeId: string, pointsToAward: number) => {
    setWeeklyChallenges((prev) =>
      prev.map((ch) =>
        ch.id === challengeId ? { ...ch, isCompleted: true } : ch,
      ),
    );
    setEscapePoints((prev) => prev + pointsToAward);
    showToast(
      `Challenge completed! +${pointsToAward} Escape Points claimed 🏆`,
    );
  };

  const handleSubmitFeaturedRequest = (req: FeaturedRequest) => {
    setFeaturedRequests((prev) => [req, ...prev]);
    showToast(`Featured request submitted for "${req.businessName}"!`);
  };

  const handleApproveFeaturedRequest = (reqId: string) => {
    setFeaturedRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "approved" } : r)),
    );
    const targetReq = featuredRequests.find((r) => r.id === reqId);
    if (targetReq) {
      setExperiences((prev) =>
        prev.map((exp) =>
          exp.name.toLowerCase().includes(targetReq.businessName.toLowerCase())
            ? { ...exp, isFeatured: true }
            : exp,
        ),
      );
    }
    showToast("Featured campaign approved & spotlighted!");
  };

  // Check if an experience is saved in any folder
  const isExperienceSaved = (id: string): boolean => {
    return savedFolders.some((f) => f.experienceIds.includes(id));
  };

  // Toggle saving to the first folder (or 'Things to Try')
  const handleToggleSave = (exp: Experience) => {
    const isCurrentlySaved = isExperienceSaved(exp.id);
    if (isCurrentlySaved) {
      // Remove from all folders
      setSavedFolders((prev) =>
        prev.map((f) => ({
          ...f,
          experienceIds: f.experienceIds.filter((eId) => eId !== exp.id),
        })),
      );
      showToast(`Removed "${exp.name}" from My Escapes`);
    } else {
      // Add to default folder
      const targetFolderId = savedFolders[0]?.id || "f-try";
      setSavedFolders((prev) =>
        prev.map((f) =>
          f.id === targetFolderId
            ? { ...f, experienceIds: [...f.experienceIds, exp.id] }
            : f,
        ),
      );
      showToast(
        `Saved "${exp.name}" to ${savedFolders[0]?.name || "My Escapes"} ❤️`,
      );
    }
  };

  const handleRemoveSaved = (folderId: string, expId: string) => {
    setSavedFolders((prev) =>
      prev.map((f) =>
        f.id === folderId
          ? {
              ...f,
              experienceIds: f.experienceIds.filter((id) => id !== expId),
            }
          : f,
      ),
    );
    showToast("Removed from folder");
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: SavedFolder = {
      id: "f-" + Date.now(),
      name,
      experienceIds: [],
    };
    setSavedFolders((prev) => [...prev, newFolder]);
    showToast(`Created folder "${name}"`);
  };

  const handleShareExperience = (exp: Experience) => {
    const text = encodeURIComponent(
      `Check out this escape in Accra: *${exp.name}* in ${exp.area}!\n\n` +
        `• Activity: ${exp.activities.join(", ")}\n` +
        `• Est. Outing: ~GH₵${exp.trueCost.totalPerPerson}/person\n` +
        `Discovered on Micro Escapes (Accra)`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleAddTip = (
    expId: string,
    tipData: Omit<UGCTip, "id" | "date">,
  ) => {
    const newTip: UGCTip = {
      ...tipData,
      id: "tip-" + Date.now(),
      date: "Just now",
    };

    setExperiences((prev) =>
      prev.map((e) =>
        e.id === expId ? { ...e, ugcTips: [newTip, ...e.ugcTips] } : e,
      ),
    );
    showToast("Thanks for submitting your tip!");
  };

  const handleAddExperience = (newExp: Experience) => {
    setExperiences((prev) => [newExp, ...prev]);
    showToast(`Listed "${newExp.name}"!`);
  };

  const handleVerifyExperience = (id: string) => {
    setExperiences((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              lastVerifiedDaysAgo: 0,
              priceLastUpdated: "September 2026",
            }
          : e,
      ),
    );
    showToast("Verified venue pricing & status!");
  };

  const totalSavedCount = savedFolders.reduce(
    (acc, f) => acc + f.experienceIds.length,
    0,
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Offline Status Warning */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs px-4 py-2 flex items-center justify-center gap-2 font-medium shadow-xs">
          <WifiOff className="w-3.5 h-3.5" />
          You are offline. Showing cached Accra escapes from local storage.
        </div>
      )}

      {/* PWA In-App Install Banner */}
      <PWAInstallBanner />

      {/* Global Brand Header */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs transition-transform duration-300 ease-out ${
          isHeaderHidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo & Vision Tagline */}
          <div
            onClick={() => setCurrentView("recommend")}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <img
              src="/logo.svg"
              alt="Micro Escapes logo"
              className="w-9 h-9 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="hidden sm:block font-black text-lg tracking-tight text-slate-950 truncate">
                  Micro Escapes
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                You don't need a vacation. You need a little escape.
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setCurrentView("recommend")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                currentView === "recommend"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Find Escapes
            </button>

            <button
              onClick={() => setCurrentView("loyalty")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition cursor-pointer text-xs font-bold ${
                currentView === "loyalty"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
              title="Accra Escape Passport"
            >
              <span>Passport</span>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  currentView === "loyalty"
                    ? "bg-amber-400 text-slate-950"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {escapePoints}
              </span>
            </button>

            <button
              onClick={() => setCurrentView("saved")}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition relative cursor-pointer ${
                currentView === "saved"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Saved
              {totalSavedCount > 0 && (
                <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {totalSavedCount}
                </span>
              )}
            </button>

            <a
              href="/landing"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              title="View Cinematic Story & Landing Page"
            >
              Story
            </a>
          </nav>

          {/* Quick Shortcuts & Support - Only at the top, visible across devices */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsWheelOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 px-2 sm:px-3 py-2.5 rounded-xl text-xs font-extrabold transition shadow-2xs cursor-pointer active:scale-95 shrink-0"
              title="Spin the Accra Escape Wheel"
            >
              <span className="hidden sm:inline">Spin Wheel</span>
              <span className="sm:hidden text-[11px] font-bold">Spin</span>
            </button>

            <button
              onClick={() => setIsSurpriseModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 px-2 sm:px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shrink-0"
              title="Surprise me with a spontaneous Accra escape"
            >
              <span className="hidden sm:inline">Surprise Me</span>
              <span className="sm:hidden text-[11px] font-bold">Surprise</span>
            </button>

            {/* Telegram Bot button */}
            <a
              href="https://t.me/micro_escapebot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition shadow-2xs cursor-pointer active:scale-95 shrink-0 focus-visible:outline-2 focus-visible:outline-sky-500 text-xs font-bold"
              title="Telegram Bot (@micro_escapebot)"
              aria-label="Telegram Bot (@micro_escapebot)"
            >
              Telegram
            </a>

            {/* Support logo button */}
            <a
              href="https://wa.me/233559184383?text=Hello!%20I%20would%20like%20to%20book%20an%20escape%20in%20Accra%20via%20Micro%20Escapes."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition shadow-2xs cursor-pointer active:scale-95 shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-500"
              title="WhatsApp Support & Bookings (055 918 4383)"
              aria-label="WhatsApp Support & Bookings"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </a>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0 focus-visible:outline-2 focus-visible:outline-emerald-500"
              title="Curator & Merchant Portal"
              aria-label="Curator portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Bar - 3 balanced touch-friendly tabs */}
        <div className="lg:hidden w-full border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-1.5 shadow-2xs">
          <div className="grid grid-cols-3 max-w-sm sm:max-w-md mx-auto gap-1 sm:gap-2 text-xs font-bold">
            <button
              onClick={() => setCurrentView("recommend")}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer min-h-[44px] ${
                currentView === "recommend"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] sm:text-xs font-bold">Escapes</span>
            </button>

            <button
              onClick={() => setCurrentView("loyalty")}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer min-h-[44px] ${
                currentView === "loyalty"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs shrink-0">🇬🇭</span>
                <span className="text-[11px] sm:text-xs font-bold">
                  Passport
                </span>
              </div>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none ${
                  currentView === "loyalty"
                    ? "bg-amber-400 text-slate-950"
                    : "bg-amber-100 text-amber-900"
                }`}
              >
                {escapePoints}
              </span>
            </button>

            <button
              onClick={() => setCurrentView("saved")}
              className={`py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl transition flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 text-center cursor-pointer relative min-h-[44px] ${
                currentView === "saved"
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                <span className="text-[11px] sm:text-xs font-bold">Saved</span>
              </div>
              {totalSavedCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {totalSavedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        {/* VIEW 1: Recommendation Engine (The Heart of Micro Escapes) */}
        {currentView === "recommend" && (
          <GamifiedEscapeFinder
            experiences={experiences}
            initialFilters={filters}
            onSelectExperience={(exp) => setSelectedExperience(exp)}
            onOpenSurpriseMe={() => setIsSurpriseModalOpen(true)}
            onOpenWheel={() => setIsWheelOpen(true)}
            onOpenBuildMyDay={() => setCurrentView("day")}
            onBookExperience={(exp, partySize) =>
              setBookingModalState({
                isOpen: true,
                experience: exp,
                partySize: partySize || 2,
              })
            }
          />
        )}

        {/* VIEW 2: Curated Weekend Events in Accra */}
        {currentView === "events" && (
          <WeekendEventsView
            events={weekendEvents}
            onBookEventTicket={(evt) => {
              const evtPrice = typeof evt.priceGhc === "number" ? evt.priceGhc : 0;
              const dummyExp: Experience = {
                id: evt.id,
                name: evt.title,
                tagline: `${evt.category} event in ${evt.neighborhood}`,
                description: evt.description,
                category: "Entertainment",
                subcategory: evt.category,
                activities: [evt.category],
                area: evt.neighborhood,
                address: `${evt.venue}, ${evt.neighborhood}, Accra`,
                coordinates: { lat: 5.556, lng: -0.196 },
                priceRange: { min: evtPrice, max: evtPrice },
                trueCost: {
                  entryFee: 0,
                  activityCost: evtPrice,
                  foodAndDrinks: 40,
                  transportEstimate: 30,
                  totalPerPerson: evtPrice + 70,
                },
                duration: "2–3 hours",
                openingHours: evt.time,
                availableDays: ["saturday", "sunday"],
                photos: [evt.image],
                rating: 4.9,
                reviewCount: 28,
                goodFor: ["friends", "partner", "solo"],
                intents: ["fun", "relax", "create"],
                contact: {
                  phone: "+233 55 918 4383",
                  whatsapp: "233559184383",
                },
                verificationStatus: "verified",
                lastVerifiedDaysAgo: 1,
                priceLastUpdated: "September 2026",
                featured: evt.isFeatured,
                reviews: [],
                ugcTips: [],
              };
              setBookingModalState({
                isOpen: true,
                experience: dummyExp,
                partySize: 1,
              });
            }}
            onOpenAdminVerify={() => setIsAdminModalOpen(true)}
          />
        )}

        {/* VIEW 3: Escape Passport & Loyalty Dashboard */}
        {currentView === "loyalty" && (
          <LoyaltyPassportView
            points={escapePoints}
            stamps={passportStamps}
            challenges={weeklyChallenges}
            onClaimChallenge={handleClaimChallenge}
            onSelectStampCategory={(category) => {
              setFilters((prev) => ({ ...prev, activity: category }));
              setCurrentView("recommend");
            }}
          />
        )}

        {/* VIEW 4: Weekend Mode (Curated Themed Outings) */}
        {currentView === "weekend" && (
          <WeekendModeView
            experiences={experiences}
            onSelectExperience={(exp) => setSelectedExperience(exp)}
            isSaved={isExperienceSaved}
            onToggleSave={handleToggleSave}
            onShare={handleShareExperience}
          />
        )}

        {/* VIEW 5: Build My Day Itinerary Generator */}
        {currentView === "day" && (
          <BuildMyDayView
            experiences={experiences}
            onSelectExperience={(exp) => setSelectedExperience(exp)}
            onClose={() => setCurrentView("recommend")}
          />
        )}

        {/* VIEW 6: Interactive Neighborhood Map */}
        {currentView === "map" && (
          <InteractiveMapView
            experiences={experiences}
            onSelectExperience={(exp) => setSelectedExperience(exp)}
            isSaved={isExperienceSaved}
            onToggleSave={handleToggleSave}
            onShare={handleShareExperience}
          />
        )}

        {/* VIEW 7: My Escapes (Saved Wishlists) */}
        {currentView === "saved" && (
          <MyEscapesView
            savedFolders={savedFolders}
            experiences={experiences}
            onSelectExperience={(exp) => setSelectedExperience(exp)}
            onRemoveSaved={handleRemoveSaved}
            onCreateFolder={handleCreateFolder}
            onShare={handleShareExperience}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <ExperienceDetailModal
        experience={selectedExperience}
        onClose={() => setSelectedExperience(null)}
        isSaved={
          selectedExperience ? isExperienceSaved(selectedExperience.id) : false
        }
        onToggleSave={handleToggleSave}
        onShare={handleShareExperience}
        onAddTip={handleAddTip}
        onBookNow={(exp, partySize) =>
          setBookingModalState({
            isOpen: true,
            experience: exp,
            partySize: partySize || 2,
          })
        }
      />

      <EscapeWheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        experiences={experiences}
        onSelectExperience={(exp) => {
          setIsWheelOpen(false);
          setSelectedExperience(exp);
        }}
        onBookExperience={(exp, partySize) => {
          setIsWheelOpen(false);
          setBookingModalState({
            isOpen: true,
            experience: exp,
            partySize: partySize || 2,
          });
        }}
      />

      <BookingCheckoutModal
        isOpen={bookingModalState.isOpen}
        onClose={() =>
          setBookingModalState({
            isOpen: false,
            experience: null,
            partySize: 2,
          })
        }
        experience={bookingModalState.experience}
        initialPartySize={bookingModalState.partySize}
        onBookingConfirmed={handleBookingConfirmed}
        onClaimReviewPoints={handleClaimReviewPoints}
      />

      <BusinessFeaturedModal
        isOpen={isFeaturedModalOpen}
        onClose={() => setIsFeaturedModalOpen(false)}
        onSubmitRequest={handleSubmitFeaturedRequest}
      />

      <SurpriseMeModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        experiences={experiences}
        onSelectExperience={(exp) => {
          setIsSurpriseModalOpen(false);
          setSelectedExperience(exp);
        }}
      />

      <AdminPortalModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        experiences={experiences}
        featuredRequests={featuredRequests}
        onAddExperience={handleAddExperience}
        onVerifyExperience={handleVerifyExperience}
        onApproveFeaturedRequest={handleApproveFeaturedRequest}
        onOpenFeaturedModal={() => setIsFeaturedModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+1.25rem)] right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
