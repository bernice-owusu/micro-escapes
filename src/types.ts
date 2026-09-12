export type IntentType =
  | "relax"
  | "fun"
  | "date"
  | "explore"
  | "eat"
  | "create"
  | "adventure"
  | "party";

export type CategoryType =
  | "Relax"
  | "Games & Fun"
  | "Adventure"
  | "Creative"
  | "Food"
  | "Entertainment"
  | "Social / Nightlife"
  | "Romantic";

export type GroupType = "solo" | "partner" | "friends" | "family" | "colleagues";

export type BudgetTier = "under_50" | "50_100" | "100_200" | "200_500" | "500_plus";

export type NeighborhoodType =
  | "Osu"
  | "East Legon"
  | "Labone"
  | "Airport Residential"
  | "Cantonments"
  | "Spintex"
  | "Jamestown"
  | "Kokrobite"
  | "Legon / Madina"
  | "Dzorwulu"
  | "Aburi Hills"
  | "Anywhere in Accra";

export type DurationType = "1 hour" | "2–3 hours" | "Half day" | "Full day";

export type RecommendationBadge =
  | "best_match"
  | "best_value"
  | "best_rated"
  | "closest"
  | "hidden_gem"
  | "most_popular";

export interface TrueCostBreakdown {
  entryFee: number;
  activityCost: number;
  foodAndDrinks: number;
  transportEstimate: number;
  totalPerPerson: number;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  date: string;
  rating: number;
  valueForMoney: number;
  service: number;
  atmosphere: number;
  activityQuality: number;
  crowdLevel: "Low & Chill" | "Moderate" | "Bustling & Energetic";
  comment: string;
  amountSpentPerPerson?: number;
  recommendForWeekend: boolean;
}

export interface UGCTip {
  id: string;
  userName: string;
  date: string;
  tipText: string;
  bestTimeToVisit: string;
  actualAmountSpent: number;
}

export interface Experience {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: CategoryType;
  subcategory: string;
  activities: string[];
  area: NeighborhoodType;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  trueCost: TrueCostBreakdown;
  duration: DurationType;
  openingHours: string;
  availableDays: string[];
  photos: string[];
  rating: number;
  reviewCount: number;
  goodFor: GroupType[];
  intents: IntentType[];
  contact: {
    phone?: string;
    whatsapp?: string;
    website?: string;
    bookingUrl?: string;
    instagram?: string;
  };
  verificationStatus: "verified" | "community" | "needs_update";
  lastVerifiedDaysAgo: number;
  priceLastUpdated: string;
  featured?: boolean;
  isTemporaryEvent?: boolean;
  eventDate?: string;
  
  // Dynamic recommendation fields calculated at runtime
  matchScore?: number;
  badgeType?: RecommendationBadge;
  matchReasons?: string[];
  contextCombo?: {
    title: string;
    steps: string[];
    whyItFits: string;
  };
  reviews: Review[];
  ugcTips: UGCTip[];
}

export interface RecommendationFilter {
  intent: IntentType | null;
  activity: string | null;
  group: GroupType | null;
  budgetTier: BudgetTier | null;
  customMaxBudget: number | null;
  location: NeighborhoodType | "Anywhere in Accra";
  distance: "close" | "5km" | "10km" | "anywhere";
  distanceLimit?: "close" | "5km" | "10km" | "anywhere";
  dayOfWeek: "today" | "tomorrow" | "saturday" | "sunday" | "any";
  timeOfDay: "morning" | "afternoon" | "evening" | "any";
  duration: DurationType | "any";
}

export interface SavedFolder {
  id: string;
  name: string;
  experienceIds: string[];
  isDefault?: boolean;
}

export interface SavedCollection {
  id: string;
  name: string;
  icon?: string;
  experienceIds: string[];
}

export interface DayItineraryStop {
  time?: string;
  timeSlot?: string;
  activity: string;
  venueName?: string;
  experienceName?: string;
  experienceId?: string;
  neighborhood?: string;
  area?: string;
  estimatedCost?: number;
  costEstimate?: number;
  description?: string;
  travelTimeToNext?: string;
  insiderNote?: string;
  tag?: string;
}

export interface DayItinerary {
  id?: string;
  title: string;
  summary?: string;
  curatorNote?: string;
  totalEstimatedCost?: number;
  totalCost?: number;
  targetBudget?: number;
  group?: GroupType;
  timeline?: DayItineraryStop[];
  stops?: DayItineraryStop[];
}

// Loyalty & Passport Types
export type LoyaltyTier = "Explorer" | "Adventurer" | "Escape Pro" | "Escape Insider";

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  isCompleted: boolean;
  icon: string;
  category: string;
}

export interface PassportStamp {
  id: string;
  activityName: string;
  icon: string;
  category: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  venueName?: string;
  stampNote?: string;
}

// Booking & Ride Types
export interface RideSimulation {
  needed: boolean;
  pickupAddress: string;
  destination: string;
  estimatedCost: number;
  etaMinutes: number;
  driverName?: string;
  driverCar?: string;
  driverRating?: number;
  status: "idle" | "requested" | "assigned" | "completed";
}

export interface BookingRecord {
  id: string; // e.g. "ME-4982"
  experienceId: string;
  experienceName: string;
  experienceArea: string;
  experiencePhoto: string;
  date: string;
  timeSlot: string;
  partySize: number;
  ticketCost: number;
  rideIncluded: boolean;
  rideCost: number;
  pickupAddress?: string;
  totalPaid: number;
  paymentMethod: "momo" | "telecel" | "card" | "wallet";
  customerName: string;
  customerPhone: string;
  status: "confirmed" | "completed";
  pointsEarned: number;
  createdAt: string;
  hasReviewed?: boolean;
}

// Events Engine
export interface WeekendEvent {
  id: string;
  title: string;
  category: "Concert" | "Comedy" | "Workshop" | "Paint & Sip" | "Pop-Up & Market" | "Food Festival" | "Nightlife";
  date: string;
  time: string;
  venue: string;
  neighborhood: NeighborhoodType;
  priceGhc: number | "Free";
  image: string;
  description: string;
  isVerified: boolean;
  isFeatured?: boolean;
  tags: string[];
  timingType?: "weekend" | "holiday" | "long_weekend";
  holidayName?: string;
}

// Business Marketplace / Featured Requests
export interface FeaturedRequest {
  id: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  experienceName: string;
  campaignDates: string;
  targetAudience: string;
  preferredPlacement: "Hero Banner" | "Top of Category" | "Weekend Highlight";
  budgetGhc: number;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
}
