/**
 * Living Faith Church Iseyin - Site Configuration
 * Central config for all site-wide settings
 * Easy to update for future branches or rebranding
 */

export const siteConfig = {
  name: "Living Faith Church, Iseyin",
  shortName: "LFC Iseyin",
  description: "Liberating the world through the preaching of the Word of Faith. Winners Chapel International - Iseyin, Oyo State.",
  url: "https://lfciseyin.org.ng",
  
  // Contact
  contact: {
    address: "Km 3, Oyo-Iseyin Road, Sawmill along saki-iseyin road, Iseyin, Oyo State, Nigeria",
    phone1: "+234 803 123 4567",
    phone2: "+234 805 987 6543",
    email: "info@lfciseyin.org.ng",
    whatsapp: "2348031234567", // without +, for wa.me links
  },

  // Socials
  socials: {
    youtube: "https://www.youtube.com/@lfcww",
    facebook: "https://facebook.com/lfciseyin",
    instagram: "https://instagram.com/lfciseyin",
    twitter: "https://x.com/WinnersWld",
  },

  // Branding
  brand: {
    colors: {
      primary: "#C41E3A",      // Winners Red
      primaryDark: "#9B1730",
      primaryLight: "#FFF1F2",
      gold: "#C9A227",
      dark: "#0F172A",
    },
    // Official logo files - replace with HQ assets when available
    logo: {
      svg: "/logo.svg", // inline component preferred
      png: "/winners-logo.png",
      icon: "/winners-icon.png",
    }
  },

  // Service Times (fallback, data.json overrides)
  serviceTimes: {
    sundayFirst: "7:30 AM",
    sundaySecond: "10:30 AM",
    wednesday: "5:00 PM",
    chop: "6:00 AM - 7:00 AM (Mon-Sat)",
    wsf: "Saturday 5:00 PM",
  },

  // Navigation
  navLinks: [
    { href: "#about", label: "About" },
    { href: "#services", label: "Services" },
    { href: "#ministries", label: "Ministries" },
    { href: "#sermons", label: "Sermons" },
    { href: "#events", label: "Events" },
    { href: "#contact", label: "Contact" },
  ],

  // Features
  features: {
    enableAdmin: true,
    enableGiving: true,
    enableLiveBadge: true,
  }
};

export const adminConfig = {
  password: siteConfig.features.adminPassword,
  formspreeUrl: "", // Set via data.json or env
  googleSheetUrl: "",
};
