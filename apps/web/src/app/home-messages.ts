/**
 * All user-facing strings for the Home page.
 * Constitution VIII: Extractable for i18n — no hardcoded strings in JSX.
 */

export const HOME_MESSAGES = {
  // Hero
  heroTitle: "Find Your AcroYoga Community",
  heroSubtitle: "Discover events, connect with teachers, and join a vibrant community of acrobatic yoga enthusiasts near you.",
  browseEvents: "Browse Events",
  findTeachers: "Find Teachers",

  // Featured events
  upcomingEvents: "Upcoming Events",
  viewAll: "View all →",

  // Error / empty
  failedToLoadEvents: "Failed to load events",
  tryAgain: "Try Again",
  noUpcomingEvents: "No upcoming events yet.",
  checkBackSoon: "Check back soon or explore our teacher directory!",
} as const;
