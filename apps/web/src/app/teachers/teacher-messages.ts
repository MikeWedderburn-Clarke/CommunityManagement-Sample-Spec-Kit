/**
 * All user-facing strings for the Teachers feature.
 * Constitution VIII: Extractable for i18n — no hardcoded strings in JSX.
 */

export const TEACHER_MESSAGES = {
  // List page
  title: "Teachers",
  searchPlaceholder: "Search teachers...",
  allStatuses: "All statuses",
  verified: "Verified",
  expired: "Expired",
  pending: "Pending",
  specialtyPlaceholder: "Specialty...",
  noTeachersFound: "No teachers found.",
  tryAdjusting: "Try adjusting your search or filters.",
  retry: "Retry",

  // Detail page
  backToTeachers: "\u2190 Back to Teachers",
  verifiedTeacher: "\u2713 Verified Teacher",
  reviews: "reviews",
  about: "About",
  specialties: "Specialties",
  certifications: "Certifications",
  expires: "Expires:",
  reviewsHeading: "Reviews",
  noReviews: "No reviews yet.",
  teacherNotFound: "Teacher not found",
  tryAgain: "Try Again",
} as const;
