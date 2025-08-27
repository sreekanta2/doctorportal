import avatar from "@/public/images/avatar/avatar-11.jpg";
export { avatar };
export const siteConfig = {
  sidebarBg: "none",
  siteName: "Medixa",
  name: "Medixa - Find & Book Doctors Online",
  url: `${process.env.NEXT_PUBLIC_API_URL || "https://doccare.srikanto.site"}`,
  description:
    "Find and book appointments with top-rated doctors by specialty, location, and availability. Read verified patient reviews.",
  author: "Doccare Team",

  // SEO Enhancements
  googleSiteVerification: "ABC123XYZ", // From Google Search Console
  googleAnalyticsId: "G-XXXXXXXXXX", // Google Analytics 4 ID
  ahrefsVerification: "12345abcde", // Ahrefs verification code

  // Content
  keywords: [
    "find doctors",
    "book doctor appointment",
    "healthcare providers",
    "medical specialists",
    "doctor ratings",
  ],

  // Social & Images
  twitterHandle: "@DoccareApp",
  ogImage: `/assets/logo.png`,
  logo: `/images/logo/logo.png`,

  // Contact Information
  contact: {
    officeAddress: "3556 Beech Street, San Francisco, California, CA 94108",
    phone: "+8801737813575",
    email: "support@Doccare.com",
  },

  socialLinks: [
    { name: "Facebook", url: "https://facebook.com/Doccare" },
    { name: "Twitter", url: "https://twitter.com/DoccareApp" },
    { name: "Instagram", url: "https://instagram.com/DoccareApp" },
    { name: "LinkedIn", url: "https://linkedin.com/company/Doccare" },
  ],
};
