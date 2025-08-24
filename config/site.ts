// export const siteConfig = {
//   name: "DCare",
//   description: null,
//   theme: "violet",
//   layout: "vertical",
//   // semi-box, horizontal, vertical
//   hideSideBar: false,
//   sidebarType: "module",
//   // popover, classic, module
//   sidebarColor: null,
//   navbarType: "sticky",
//   // sticky, floating, static
//   footerType: "static",
//   // sticky,  static, hidden
//   sidebarBg: "none",
//   radius: 0.5,
// };
// config/site.ts
// config/site.ts
import avatar from "@/public/images/avatar/avatar-11.jpg";
export { avatar };
export const siteConfig = {
  sidebarBg: "none",
  siteName: "Medexa",
  name: "Doccare - Find & Book Doctors Online",
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
    phone: "+8801737813575",
    email: "support@Doccare.com",
  },

  // Social Links
  socialLinks: [
    { name: "Facebook", url: "https://facebook.com/Doccare" },
    { name: "Twitter", url: "https://twitter.com/DoccareApp" },
    { name: "Instagram", url: "https://instagram.com/DoccareApp" },
    { name: "LinkedIn", url: "https://linkedin.com/company/Doccare" },
  ],
};
