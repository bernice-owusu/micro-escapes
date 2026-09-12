import { PassportStamp, WeeklyChallenge, LoyaltyTier } from "../types";

export const INITIAL_PASSPORT_STAMPS: PassportStamp[] = [
  {
    id: "stamp-bowling",
    activityName: "Bowling Strike Master",
    icon: "🎳",
    category: "Games & Fun",
    isUnlocked: true,
    unlockedDate: "Last weekend",
    venueName: "Bliss Family Entertainment",
    stampNote: "Scored 132 points on lane 4 in Airport Residential!",
  },
  {
    id: "stamp-beach",
    activityName: "Atlantic Coast Breeze",
    icon: "🏖️",
    category: "Relax",
    isUnlocked: true,
    unlockedDate: "2 weeks ago",
    venueName: "Sandbox Beach Club",
    stampNote: "Golden hour sea breeze and coconut water at Labadi coast.",
  },
  {
    id: "stamp-pottery",
    activityName: "Clay & Craft Alchemist",
    icon: "🏺",
    category: "Creative",
    isUnlocked: false,
    stampNote: "Throw a terracotta mug on a pottery wheel.",
  },
  {
    id: "stamp-canopy",
    activityName: "Canopy Walkway Explorer",
    icon: "🥾",
    category: "Adventure",
    isUnlocked: false,
    stampNote: "Cross the 7 aerial bridge spans over lush treetops.",
  },
  {
    id: "stamp-comedy",
    activityName: "Accra Laugh Seeker",
    icon: "🎭",
    category: "Entertainment",
    isUnlocked: false,
    stampNote: "Catch live stand-up comedy at Snap Cinemas.",
  },
  {
    id: "stamp-gokart",
    activityName: "Grand Prix Speed Demon",
    icon: "🏎️",
    category: "Adventure",
    isUnlocked: false,
    stampNote: "Clock a sub-45s lap on the outdoor asphalt track.",
  },
  {
    id: "stamp-spa",
    activityName: "Zen Sanctuary Recharger",
    icon: "💆",
    category: "Relax",
    isUnlocked: false,
    stampNote: "Melt stress away with a warm bamboo or Swedish massage.",
  },
  {
    id: "stamp-foodie",
    activityName: "Accra Heritage Foodie",
    icon: "🍽️",
    category: "Food",
    isUnlocked: true,
    unlockedDate: "3 weeks ago",
    venueName: "Buka Restaurant",
    stampNote: "Savored tender grilled tilapia with spicy kelewele in Osu.",
  },
];

export const INITIAL_WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: "ch-1",
    title: "Try something you've never done before",
    description: "Book or complete an activity outside your typical favorites (e.g. pottery or go-karting).",
    points: 150,
    isCompleted: false,
    icon: "🎯",
    category: "Discovery",
  },
  {
    id: "ch-2",
    title: "Escape to a new neighbourhood",
    description: "Discover a curated micro escape outside your primary residential area this weekend.",
    points: 100,
    isCompleted: true,
    icon: "🗺️",
    category: "Exploration",
  },
  {
    id: "ch-3",
    title: "Plan an escape with 3+ friends",
    description: "Share or book a group outing with at least 3 people for group savings.",
    points: 120,
    isCompleted: false,
    icon: "👥",
    category: "Social",
  },
  {
    id: "ch-4",
    title: "Spend under GH₵100 total",
    description: "Master the affordable escape: complete an outing while keeping total spend under GH₵100.",
    points: 80,
    isCompleted: false,
    icon: "💸",
    category: "Budget",
  },
];

export function calculateLoyaltyTier(points: number): {
  tier: LoyaltyTier;
  nextTier: LoyaltyTier | null;
  pointsToNext: number;
  progressPercent: number;
  badgeColor: string;
  perks: string[];
} {
  if (points < 500) {
    return {
      tier: "Explorer",
      nextTier: "Adventurer",
      pointsToNext: 500 - points,
      progressPercent: Math.min(100, Math.round((points / 500) * 100)),
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      perks: [
        "Earn points on every completed escape",
        "Save personalized folders & wishlist",
        "Community insider tips access",
      ],
    };
  } else if (points < 1500) {
    return {
      tier: "Adventurer",
      nextTier: "Escape Pro",
      pointsToNext: 1500 - points,
      progressPercent: Math.min(100, Math.round(((points - 500) / 1000) * 100)),
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
      perks: [
        "5% discount code on partner bookings",
        "Early access to weekend pop-up events",
        "Exclusive 'Adventurer' digital passport stamp",
      ],
    };
  } else if (points < 3000) {
    return {
      tier: "Escape Pro",
      nextTier: "Escape Insider",
      pointsToNext: 3000 - points,
      progressPercent: Math.min(100, Math.round(((points - 1500) / 1500) * 100)),
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      perks: [
        "10% discount on all partner experiences",
        "Priority WhatsApp VIP concierge booking",
        "Free drink or dessert voucher at selected cafes",
      ],
    };
  } else {
    return {
      tier: "Escape Insider",
      nextTier: null,
      pointsToNext: 0,
      progressPercent: 100,
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      perks: [
        "15% VIP discount across all partner venues",
        "Secret speakeasy & invitation-only guestlist",
        "Custom itinerary consultation with local curators",
      ],
    };
  }
}
