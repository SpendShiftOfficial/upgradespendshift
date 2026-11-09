/*
 * Genuine customer reviews shown near the upgrade offer (Phase 5).
 *
 * The section stays hidden while this list is empty.
 * Only add reviews from real, independent paying customers who have given
 * written permission. Never add family/friends' feedback as customer reviews,
 * and never edit wording beyond fixing obvious typos.
 *
 * Example:
 * { quote: "I cancelled two subscriptions in ten minutes.", name: "Sam", location: "Brisbane", date: "2026-12" },
 */

export type Review = {
  quote: string;
  /** First name or initials only. */
  name: string;
  location?: string;
  /** YYYY-MM the review was given. */
  date: string;
};

export const REVIEWS: Review[] = [];
