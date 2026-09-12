import React from "react";
import { Sparkles, MessageCircle, Compass, Flame, ShieldCheck, ArrowRight, MapPin, ChevronRight, Shuffle } from "lucide-react";

interface LandingViewProps {
  onLaunchApp: (view?: "recommend" | "events" | "loyalty" | "weekend") => void;
  onOpenWheel: () => void;
}

export function LandingView({ onLaunchApp, onOpenWheel }: LandingViewProps) {
  const sights = [
    {
      title: "Kokrobite Beach & Surf",
      kicker: "Beach & Sunset • GH₵40",
      description: "Golden sand, Atlantic ocean breeze, and fresh coconut water along the coast.",
      tag: "Scenic",
    },
    {
      title: "Bliss Entertainment",
      kicker: "Games & Fun • GH₵80–160",
      description: "High-energy bowling lanes, nostalgic arcade games, and active friendly date nights.",
      tag: "Fun",
    },
    {
      title: "Buka Courtyard Dining",
      kicker: "Dining & Courtyard • GH₵60",
      description: "Authentic Ghanaian courtyards, tender grilled tilapia, and chilled bissap juice.",
      tag: "Dining",
    },
    {
      title: "Aburi Mountain Quad Biking",
      kicker: "Adventure & Nature • GH₵120",
      description: "Off-road mountain trail expedition through Aburi highland pine forests and misty views.",
      tag: "Adventure",
    },
    {
      title: "Legon Botanical Gardens",
      kicker: "Hidden Gems • GH₵20–50",
      description: "Suspended canopy walkway, tranquil lake canoe rides, and peaceful forest breeze.",
      tag: "Nature",
    },
    {
      title: "Sandbox Beach Club",
      kicker: "Sunset Lounge • GH₵120",
      description: "Ocean breeze deck, craft cocktails, and sunset vibes with Atlantic views.",
      tag: "Lounge",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Hero Section with Parallax Background Image */}
      <section className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden px-4 sm:px-8 py-10">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/landing/hero-bg.jpg"
            alt="Accra coastline at sunset"
            className="w-full h-full object-cover object-center scale-105 filter brightness-75 contrast-110"
            onError={(e) => {
              // Fallback to local image if path fails
              (e.currentTarget as HTMLImageElement).src = "/hero-bg.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950" />
          <div className="absolute inset-0 bg-radial from-transparent via-slate-950/40 to-slate-950" />
        </div>

        {/* Top Floating Badge */}
        <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Accra Activity & Intent Engine</span>
          </div>

          <button
            onClick={() => onLaunchApp("recommend")}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <span>Launch Web App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Main Hero Copy */}
        <div className="relative z-10 max-w-4xl mx-auto text-center my-auto py-12 px-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-serif text-white mb-6 leading-[1.1]">
            Micro Escapes
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-emerald-100/90 font-medium max-w-2xl mx-auto mb-4 font-serif italic">
            You don't need a vacation. You need a little escape.
          </p>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8 font-sans">
            Discover affordable things to do around Accra tailored in seconds by your mood, budget in Cedis (GH₵), and location.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-xl mx-auto">
            <button
              onClick={() => onLaunchApp("recommend")}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-sm sm:text-base transition shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>Find My Escape</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://t.me/micro_escapebot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-5 py-3.5 rounded-2xl text-sm font-bold transition backdrop-blur-md active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5 text-sky-400" />
              <span>Open Telegram Bot</span>
            </a>

            <button
              onClick={onOpenWheel}
              className="flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-5 py-3.5 rounded-2xl text-sm font-bold transition backdrop-blur-md active:scale-95 cursor-pointer w-full sm:w-auto"
            >
              <Shuffle className="w-5 h-5 text-amber-400" />
              <span>Spin Wheel</span>
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 max-w-4xl mx-auto w-full grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-800/80 pt-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">50+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Curated Escapes</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">100%</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Verified Cedis Pricing</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">&lt; 2s</div>
            <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Instant Matching</div>
          </div>
        </div>
      </section>

      {/* Sights Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Featured Experiences</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-serif text-white mt-1">Popular Accra Micro Escapes</h2>
          </div>
          <button
            onClick={() => onLaunchApp("recommend")}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition cursor-pointer self-start sm:self-auto"
          >
            <span>Explore All 50+ Escapes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sights.map((sight, idx) => (
            <div
              key={idx}
              onClick={() => onLaunchApp("recommend")}
              className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition duration-300 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center justify-between">
                  <span>{sight.kicker}</span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-semibold">{sight.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition mb-2 font-serif">
                  {sight.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {sight.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition duration-200">
                <span>View & Book on Web App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Simple & Instant</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mt-1">How Micro Escapes Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg mb-4 font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Tell us your vibe</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select what you feel like doing—relaxing by a pool, high-energy games, or an intimate courtyard dinner.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg mb-4 font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant smart match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We filter by your exact budget in Ghana Cedis (GH₵), party size, and neighborhood without endless searching.
            </p>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold text-lg mb-4 font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Book in 2 taps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reserve directly through our Telegram Bot or Web App with verified true pricing and zero hidden costs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 border-t border-slate-900 text-center">
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 p-8 sm:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
          <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mb-4">
            Ready for your Accra Micro Escape?
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto mb-8">
            Launch the interactive web application to filter by mood, location, and Cedis budget now.
          </p>

          <button
            onClick={() => onLaunchApp("recommend")}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base transition shadow-xl shadow-emerald-500/25 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Launch Web App Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-12 text-xs text-slate-500 flex flex-wrap items-center justify-center gap-6">
          <span>Micro Escapes Accra, Ghana</span>
          <span>•</span>
          <a href="https://t.me/micro_escapebot" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Telegram Bot (@micro_escapebot)</a>
          <span>•</span>
          <a href="https://wa.me/233559184383" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">WhatsApp Support (+233 55 918 4383)</a>
        </div>
      </section>
    </div>
  );
}
