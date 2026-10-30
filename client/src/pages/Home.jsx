/**
 * Home Page - Living Faith Church Iseyin
 * Composes all sections in order
 * Easy to reorder, add, or remove sections for future scalability
 */

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Mandate from "@/components/sections/Mandate";
import Pastor from "@/components/sections/Pastor";
import Services from "@/components/sections/Services";
import Ministries from "@/components/sections/Ministries";
import Sermons from "@/components/sections/Sermons";
import Events from "@/components/sections/Events";
import Location from "@/components/sections/Location";
import Giving from "@/components/sections/Giving";
import Contact from "@/components/sections/Contact";
import useSiteData from "@/hooks/useSiteData";
import { useEffect } from "react";
import { useGlobalSmoothScroll } from "@/hooks/useSmoothScroll";
import { ScrollProgress, BackToTop } from "@/components/ui/ScrollProgress";


// export default function Home() {
//   const { data } = useSiteData();
//   useGlobalSmoothScroll(88); // Smooth scroll for all anchor links with header offset
export default function Home() {
  const { data } = useSiteData();

  useGlobalSmoothScroll(88);
 
  
  
useEffect(() => {
  const sections = document.querySelectorAll("main > section");

  const showSectionsImmediately = () => {
    sections.forEach((section, index) => {
      if (index !== 0) {
        section.classList.remove("motion-reveal");
        section.classList.add("motion-visible");
      }
    });
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    showSectionsImmediately();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    showSectionsImmediately();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("motion-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  sections.forEach((section, index) => {
    if (index === 0) return;

    section.classList.add("motion-reveal");
    observer.observe(section);
  });

  return () => observer.disconnect();
}, []);


  
  return (
    // ❌ REMOVED overflow-x-hidden FROM THIS DIV
    <div className="min-h-screen bg-[#FFFBFB]">
      <ScrollProgress />
      <Header />
      
      {/* ✅ MOVED overflow-x-hidden HERE TO PROTECT PAGE CONTENT WITHOUT BREAKING HEADER */}
      <main className="overflow-x-hidden">
        <Hero data={data} />
        <Mandate />
        <Pastor />
        <Services data={data} />
        <Ministries />
        <Sermons data={data} />
        <Events data={data} />
        <Location data={data} />
        <Giving />
        <Contact data={data} />
      </main>

      <Footer />
      <BackToTop />

      {/* Admin quick access - hidden, shows on hover */}
      <AdminFab />
    </div>
  );
}

function AdminFab() {
  return (
    <button
      onClick={() => (window.location.hash = "#admin")}
      className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-slate-900 text-white grid place-items-center opacity-10 hover:opacity-100 transition-all duration-300 z-50 shadow-lg hover:scale-110"
      aria-label="Admin"
      title="Admin Dashboard"
    >
      ⚙️
    </button>
  );
}
