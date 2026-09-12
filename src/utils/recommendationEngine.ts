import { Experience, RecommendationFilter, RecommendationBadge } from "../types";

export interface RecommendationResult {
  experience: Experience;
  matchScore: number;
  matchReasons: string[];
  badgeType?: RecommendationBadge;
  contextCombo?: {
    title: string;
    steps: string[];
    whyItFits: string;
  };
}

export function calculateRecommendations(
  experiences: Experience[],
  filters: RecommendationFilter
): RecommendationResult[] {
  const scored: RecommendationResult[] = experiences.map((exp) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Activity Match (30%)
    if (filters.activity && filters.activity.trim()) {
      const actQuery = filters.activity.toLowerCase().trim();
      const directMatch = exp.activities.some((a) =>
        a.toLowerCase().includes(actQuery)
      );
      const subMatch = exp.subcategory.toLowerCase().includes(actQuery);
      const catMatch = exp.category.toLowerCase().includes(actQuery);

      if (directMatch) {
        score += 30;
        reasons.push(`Exactly matches your desire for "${filters.activity}"`);
      } else if (subMatch || catMatch) {
        score += 22;
        reasons.push(`Includes great "${exp.subcategory}" activities`);
      } else {
        score += 8; // partial fallback
      }
    } else {
      score += 25; // no specific activity filter specified, generous baseline
    }

    // 2. Budget Match (20%)
    const cost = exp.trueCost.totalPerPerson;
    let budgetCap: number | null = filters.customMaxBudget;
    if (!budgetCap && filters.budgetTier) {
      switch (filters.budgetTier) {
        case "under_50":
          budgetCap = 50;
          break;
        case "50_100":
          budgetCap = 100;
          break;
        case "100_200":
          budgetCap = 200;
          break;
        case "200_500":
          budgetCap = 500;
          break;
        case "500_plus":
          budgetCap = 1500;
          break;
      }
    }

    if (budgetCap) {
      if (cost <= budgetCap) {
        score += 20;
        reasons.push(`Fits within your GH₵${budgetCap} budget (Est. outing: GH₵${cost})`);
      } else if (cost <= budgetCap * 1.25) {
        score += 12;
        reasons.push(`Slightly above GH₵${budgetCap} (GH₵${cost} outing), but exceptional value`);
      } else {
        score += 4;
      }
    } else {
      score += 18;
    }

    // 3. Group Suitability (10%)
    if (filters.group) {
      if (exp.goodFor.includes(filters.group)) {
        score += 10;
        const groupLabel =
          filters.group === "partner"
            ? "couples & date outings"
            : filters.group === "friends"
            ? "friend group outings"
            : filters.group === "solo"
            ? "solo explorers"
            : "families & groups";
        reasons.push(`Highly rated for ${groupLabel}`);
      } else {
        score += 3;
      }
    } else {
      score += 8;
    }

    // 4. Location / Distance Match (10%)
    if (filters.location && filters.location !== "Anywhere in Accra") {
      if (exp.area.toLowerCase() === filters.location.toLowerCase()) {
        score += 10;
        reasons.push(`Right in your target area (${exp.area})`);
      } else {
        // Neighborhood adjacency heuristics in Accra
        const isNearby = areAreasAdjacent(exp.area, filters.location);
        if (isNearby) {
          score += 7;
          reasons.push(`Just 10–15 mins away in ${exp.area}`);
        } else {
          score += 4;
        }
      }
    } else {
      score += 8;
    }

    // 5. Rating / Reviews Match (10%)
    // Normalized 4.0 to 5.0 -> 0 to 10
    const ratingScore = Math.min(10, Math.max(0, (exp.rating - 3.5) * 6.6));
    score += Math.round(ratingScore);
    if (exp.rating >= 4.7) {
      reasons.push(`Top-tier ⭐ ${exp.rating} community rating across ${exp.reviewCount} visits`);
    }

    // 6. Availability / Time (10%)
    let dayMatches = true;
    if (filters.dayOfWeek && filters.dayOfWeek !== "any") {
      const dayCapitalized =
        filters.dayOfWeek === "today"
          ? getTodayDayName()
          : filters.dayOfWeek === "tomorrow"
          ? getTomorrowDayName()
          : capitalize(filters.dayOfWeek);

      dayMatches = exp.availableDays.some(
        (d) => d.toLowerCase() === dayCapitalized.toLowerCase()
      );
      if (dayMatches) {
        score += 10;
        reasons.push(`Open & active on ${dayCapitalized}`);
      } else {
        score += 2;
      }
    } else {
      score += 8;
    }

    // 7. Mood / Intent Match (5%)
    if (filters.intent) {
      if (exp.intents.includes(filters.intent)) {
        score += 5;
        reasons.push(`Matches your intention to ${filters.intent}`);
      } else {
        score += 1;
      }
    } else {
      score += 4;
    }

    // 8. Duration Match (5%)
    if (filters.duration && filters.duration !== "any") {
      if (exp.duration === filters.duration) {
        score += 5;
        reasons.push(`Ideal timing: spans ${exp.duration}`);
      } else {
        score += 2;
      }
    } else {
      score += 4;
    }

    // Cap score at 98% (realistic human scoring)
    const finalScore = Math.min(98, Math.max(62, Math.round(score)));

    // Generate context-aware multi-stop combination (Section 13)
    const contextCombo = buildContextCombo(exp, filters);

    return {
      experience: exp,
      matchScore: finalScore,
      matchReasons: reasons.slice(0, 4), // pick top 4 clean reasons
      contextCombo,
    };
  });

  // Sort descending by match score
  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Take top candidates and assign distinct badges:
  // Best Match, Best Value, Best Rated, Closest, Hidden Gem
  const topList = scored.slice(0, 8);

  if (topList.length > 0) {
    // 🥇 Best Match
    topList[0].badgeType = "best_match";
  }

  // Find Best Value (lowest totalPerPerson among top candidates with score >= 75)
  let bestValueIdx = -1;
  let lowestCost = Infinity;
  topList.forEach((item, idx) => {
    if (idx !== 0 && item.experience.trueCost.totalPerPerson < lowestCost) {
      lowestCost = item.experience.trueCost.totalPerPerson;
      bestValueIdx = idx;
    }
  });
  if (bestValueIdx !== -1 && !topList[bestValueIdx].badgeType) {
    topList[bestValueIdx].badgeType = "best_value";
  }

  // Find Best Rated
  let bestRatedIdx = -1;
  let highestRating = -1;
  topList.forEach((item, idx) => {
    if (!item.badgeType && item.experience.rating > highestRating) {
      highestRating = item.experience.rating;
      bestRatedIdx = idx;
    }
  });
  if (bestRatedIdx !== -1) {
    topList[bestRatedIdx].badgeType = "best_rated";
  }

  // Find Hidden Gem (lower review count < 100, rating >= 4.7)
  const hiddenGemIdx = topList.findIndex(
    (item) =>
      !item.badgeType &&
      item.experience.reviewCount <= 120 &&
      item.experience.rating >= 4.7
  );
  if (hiddenGemIdx !== -1) {
    topList[hiddenGemIdx].badgeType = "hidden_gem";
  }

  // Find Closest if location was given
  if (filters.location && filters.location !== "Anywhere in Accra") {
    const closestIdx = topList.findIndex(
      (item) =>
        !item.badgeType &&
        item.experience.area.toLowerCase() === filters.location.toLowerCase()
    );
    if (closestIdx !== -1) {
      topList[closestIdx].badgeType = "closest";
    }
  }

  // Next one gets most popular if high review count
  const popularIdx = topList.findIndex(
    (item) => !item.badgeType && item.experience.reviewCount >= 150
  );
  if (popularIdx !== -1) {
    topList[popularIdx].badgeType = "most_popular";
  }

  return topList;
}

function areAreasAdjacent(a: string, b: string): boolean {
  const clusters: Record<string, string[]> = {
    Osu: ["Labone", "Cantonments", "Jamestown"],
    Labone: ["Osu", "Cantonments"],
    Cantonments: ["Osu", "Labone", "Airport Residential"],
    "Airport Residential": ["Cantonments", "Dzorwulu", "East Legon"],
    "East Legon": ["Airport Residential", "Legon / Madina", "Spintex"],
    "Legon / Madina": ["East Legon", "Dzorwulu", "Aburi Hills"],
    Dzorwulu: ["Airport Residential", "Legon / Madina"],
  };

  const adj = clusters[a];
  return !!adj && adj.includes(b);
}

function getTodayDayName(): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[new Date().getDay()];
}

function getTomorrowDayName(): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[(new Date().getDay() + 1) % 7];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// PRD Section 13: Context-Aware Multi-Stop Combo Generator
function buildContextCombo(
  exp: Experience,
  filters: RecommendationFilter
): { title: string; steps: string[]; whyItFits: string } {
  const group = filters.group || "friends";
  const intent = filters.intent || "fun";

  if (group === "partner" || intent === "date") {
    return {
      title: "Romantic Flow in " + exp.area,
      steps: [
        `1. Start at ${exp.name} (${exp.activities[0] || "Activity"})`,
        `2. Walk over for intimate sunset drinks / cocktails nearby`,
        `3. Wind down with warm Kelewele or dessert bites`,
      ],
      whyItFits: "Crafted for effortless conversation and romantic pacing without rushing.",
    };
  }

  if (group === "friends" || intent === "party") {
    return {
      title: "The Crew Outing in " + exp.area,
      steps: [
        `1. Squad warmup: ${exp.name} (${exp.activities[0] || "Games"})`,
        `2. Competitive session / group photo challenge`,
        `3. Affordable shared grilled tilapia & cold beverages`,
      ],
      whyItFits: "Maximizes interaction and banter while keeping the total bill manageable.",
    };
  }

  // Solo / Relax
  return {
    title: "Solo Reset in " + exp.area,
    steps: [
      `1. Peaceful solo session at ${exp.name}`,
      `2. Unhurried artisan iced coffee or fresh ginger tea`,
      `3. Quiet journaling or coastal sunset reflection`,
    ],
    whyItFits: "Zero pressure, restorative pacing that lets you recharge at your own tempo.",
  };
}
