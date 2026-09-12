import React, { useState } from "react";
import {
  X,
  Plus,
  ShieldCheck,
  Check,
  Building,
  Coins,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Experience, NeighborhoodType, FeaturedRequest, CategoryType } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  experiences: Experience[];
  featuredRequests?: FeaturedRequest[];
  onAddExperience: (exp: Experience) => void;
  onVerifyExperience: (id: string) => void;
  onApproveFeaturedRequest?: (requestId: string) => void;
  onOpenFeaturedModal?: () => void;
}

export const AdminPortalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  experiences,
  featuredRequests = [],
  onAddExperience,
  onVerifyExperience,
  onApproveFeaturedRequest,
  onOpenFeaturedModal,
}) => {
  const [activeTab, setActiveTab] = useState<"list" | "add" | "requests">("list");

  // Add form fields
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fun & Games");
  const [area, setArea] = useState<NeighborhoodType>("Osu");
  const [address, setAddress] = useState("");
  const [activitiesStr, setActivitiesStr] = useState("Bowling, Arcade, Food");
  const [entryFee, setEntryFee] = useState(0);
  const [activityCost, setActivityCost] = useState(80);
  const [foodCost, setFoodCost] = useState(60);
  const [transportCost, setTransportCost] = useState(30);
  const [duration, setDuration] = useState<Experience["duration"]>("2–3 hours");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=900&auto=format&fit=crop&q=80"
  );
  const [whatsapp, setWhatsapp] = useState("0559184383");

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const total = entryFee + activityCost + foodCost + transportCost;

    let cleanWhatsapp = whatsapp.replace(/\D/g, "");
    if (cleanWhatsapp.startsWith("0")) {
      cleanWhatsapp = `233${cleanWhatsapp.slice(1)}`;
    }
    if (!cleanWhatsapp) {
      cleanWhatsapp = "233559184383";
    }

    const newExp: Experience = {
      id: "exp-" + Date.now(),
      name: name.trim(),
      tagline: tagline.trim() || "Exciting new micro escape in Accra",
      description: description.trim() || `${name} offers fantastic weekend activities in ${area}.`,
category: category as CategoryType,
      subcategory: category,
      area,
      address: address.trim() || `${area}, Accra, Ghana`,
      activities: activitiesStr.split(",").map((s) => s.trim()).filter(Boolean),
      photos: [photoUrl],
      coordinates: { lat: 5.6037, lng: -0.187 },
      priceRange: { min: total, max: Math.round(total * 1.3) },
      trueCost: {
        entryFee,
        activityCost,
        foodAndDrinks: foodCost,
        transportEstimate: transportCost,
        totalPerPerson: total,
      },
      duration,
      openingHours: "Wed–Sun: 12:00 PM – 10:00 PM",
      availableDays: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      goodFor: ["friends", "partner"],
      intents: ["fun", "relax"],
      contact: {
        phone: "+233 55 918 4383",
        whatsapp: cleanWhatsapp,
      },
      verificationStatus: "verified",
      rating: 4.8,
      reviewCount: 1,
      lastVerifiedDaysAgo: 0,
      priceLastUpdated: "September 2026",
      isTemporaryEvent: false,
      reviews: [],
      ugcTips: [],
    };

    onAddExperience(newExp);
    setActiveTab("list");
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1">
            <Building className="w-3 h-3 text-emerald-400" />
            Curator & Merchant Portal
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            Micro Escapes Curation Console
          </h2>
          <p className="text-xs text-slate-500">
            Verify prices, maintain data freshness, and list new Accra experiences.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-5 text-xs font-semibold text-slate-600 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("list")}
            className={`py-3 px-3 border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "list"
                ? "border-slate-900 text-slate-900 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            Verified Venues ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
              activeTab === "requests"
                ? "border-slate-900 text-slate-900 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            <span>Featured Requests</span>
            <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
              {featuredRequests.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`py-3 px-3 border-b-2 transition shrink-0 whitespace-nowrap ${
              activeTab === "add"
                ? "border-slate-900 text-slate-900 font-bold"
                : "border-transparent hover:text-slate-900"
            }`}
          >
            + Add New Experience
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[60dvh] overflow-y-auto">
          {activeTab === "list" ? (
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={exp.photos[0]}
                      alt=""
                      className="w-12 h-12 rounded-lg object-cover bg-slate-200 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>{exp.name}</span>
                        {exp.featured && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            ⭐ Featured
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 text-[11px] flex items-center gap-2">
                        <span>{exp.area}</span>
                        <span>•</span>
                        <span>Est. GH₵{exp.trueCost.totalPerPerson}/person</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">
                          Verified {exp.lastVerifiedDaysAgo}d ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onVerifyExperience(exp.id)}
                    className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold px-3 py-1.5 rounded-lg transition shrink-0"
                    title="Mark verified today and confirm active pricing"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verify Now
                  </button>
                </div>
              ))}
            </div>
          ) : activeTab === "requests" ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">
                    Sponsor & Featured Campaigns
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Venues requesting hero spotlight or category placement.
                  </p>
                </div>
                {onOpenFeaturedModal && (
                  <button
                    onClick={onOpenFeaturedModal}
                    className="bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs hover:bg-amber-600 transition"
                  >
                    + Submit New Request
                  </button>
                )}
              </div>

              {featuredRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  No pending featured placement requests right now.
                </div>
              ) : (
                <div className="space-y-3">
                  {featuredRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-sm text-slate-900">
                            {req.businessName} — <span className="font-normal text-slate-600">{req.experienceName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Contact: {req.contactPerson} • {req.phone} • {req.email}
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            req.status === "approved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {req.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600">
                        <span>Placement: <strong>{req.preferredPlacement}</strong></span>
                        <span>Budget: <strong>GH₵{req.budgetGhc}</strong></span>
                        <span>Audience: <strong>{req.targetAudience}</strong></span>
                      </div>

                      {req.status === "pending" && onApproveFeaturedRequest && (
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => onApproveFeaturedRequest(req.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-xs transition flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve & Spotlight Venue
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Experience Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Accra Paint Club"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Neighborhood
                  </label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value as NeighborhoodType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-emerald-600"
                  >
                    <option value="Osu">Osu</option>
                    <option value="East Legon">East Legon</option>
                    <option value="Labone">Labone</option>
                    <option value="Airport Residential">Airport Residential</option>
                    <option value="Cantonments">Cantonments</option>
                    <option value="Spintex">Spintex</option>
                    <option value="Jamestown">Jamestown</option>
                    <option value="Kokrobite">Kokrobite</option>
                    <option value="Aburi Hills">Aburi Hills</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tagline (Punchy one-liner)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Guided weekend acrylic painting with local palm wine"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Activities (Comma-separated)
                </label>
                <input
                  type="text"
                  value={activitiesStr}
                  onChange={(e) => setActivitiesStr(e.target.value)}
                  placeholder="e.g. Canvas painting, Wine tasting, Social games"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  WhatsApp Booking Phone Number
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. 0559184383"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white focus:outline-emerald-600 font-mono text-xs"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Default: 0559184383 (Routes to official Micro Escapes booking line)
                </span>
              </div>

              {/* True Cost Grid */}
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
                <div className="font-bold text-slate-900 text-xs">
                  True Cost Calculation (GH₵ per person)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-medium">Entry</label>
                    <input
                      type="number"
                      value={entryFee}
                      onChange={(e) => setEntryFee(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-medium">Activity</label>
                    <input
                      type="number"
                      value={activityCost}
                      onChange={(e) => setActivityCost(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-medium">Food/Drinks</label>
                    <input
                      type="number"
                      value={foodCost}
                      onChange={(e) => setFoodCost(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded p-1.5"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-medium">Transport</label>
                    <input
                      type="number"
                      value={transportCost}
                      onChange={(e) => setTransportCost(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded p-1.5"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("list")}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-xs"
                >
                  Publish & Verify Listing
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
