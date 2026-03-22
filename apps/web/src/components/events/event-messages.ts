/**
 * All user-facing strings for Event components (card, detail, list, filters).
 * Constitution VIII: Extractable for i18n — no hardcoded strings in JSX.
 */

export const EVENT_MESSAGES = {
  // EventCard badges
  badgeNew: "New",
  badgeUpdated: "Updated",
  badgeFull: "Full",
  free: "Free",
  attending: "attending",
  interested: "interested",

  // EventDetailPage
  eventNotFound: "Event not found",
  cancelled: "Cancelled",
  googleMaps: "Google Maps",
  appleMaps: "Apple Maps",
  openStreetMap: "OpenStreetMap",
  prerequisites: "Prerequisites",
  concessionLabel: (currency: string, amount: string) => `(Concession: ${currency} ${amount})`,
  attendees: "Attendees",
  addToCalendar: "Add to Calendar",
  share: "Share",
  refundPolicy: (hours: number) =>
    `Cancellation within ${hours}h of event start: credit or refund available. After that: no refund.`,

  // Role breakdown
  roleBase: "Base",
  roleFlyer: "Flyer",
  roleHybrid: "Hybrid",

  // EventsListPage
  eventsTitle: "Events",
  retry: "Retry",
  eventsFound: (count: number) => `${count} events found`,
  noEventsMatch: "No events match your filters.",

  // EventFilters
  allCategories: "All categories",
  allLevels: "All levels",

  // CategoryLegendBar
  legendNone: "None",
  legendAll: "All",
} as const;
