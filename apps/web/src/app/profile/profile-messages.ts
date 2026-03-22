/**
 * All user-facing strings for the Profile feature.
 * Constitution VIII: Extractable for i18n — no hardcoded strings in JSX.
 */

export const PROFILE_MESSAGES = {
  // Auth
  signInToView: "Please sign in to view your profile.",
  signIn: "Sign In",

  // Edit profile
  myProfile: "My Profile",
  savedSuccess: "Profile saved successfully!",
  savedError: "Failed to save profile. Please try again.",
  displayNameLabel: "Display Name",
  displayNameRequired: "Display name is required",
  bioLabel: "Bio",
  defaultRoleLabel: "Default Role",
  roleBase: "Base",
  roleFlyer: "Flyer",
  roleHybrid: "Hybrid",
  avatarUrlLabel: "Avatar URL",
  homeCityLabel: "Home City",
  notSet: "Not set",
  detecting: "Detecting...",
  autoDetect: "Auto-detect",
  socialLinksLabel: "Social Links",
  platformFacebook: "Facebook",
  platformInstagram: "Instagram",
  platformYouTube: "YouTube",
  platformWebsite: "Website",
  visibilityEveryone: "Everyone",
  visibilityFollowers: "Followers",
  visibilityFriends: "Friends",
  visibilityHidden: "Hidden",
  addLink: "+ Add link",
  saving: "Saving...",
  saveProfile: "Save Profile",

  // Public profile
  userNotFound: "User not found",
  anonymous: "Anonymous",
  links: "Links",
  follow: "Follow",
  following: "Following",
  followBack: "Follow back",
  friends: "Friends",
  block: "Block",
  mute: "Mute",
  report: "Report",
} as const;
