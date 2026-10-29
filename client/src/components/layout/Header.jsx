import { useState, useEffect } from "react";
import WinnersLogoImg from "@/components/brand/WINNER.webp";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { handleAnchorClick } = useSmoothScroll(88);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section for highlight
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    siteConfig.navLinks.forEach((link) => {
      const el = document.getElementById(link.href.slice(1));
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e) => {
    handleAnchorClick(e);
    setOpen(false);
  };

  return (
    <>
      {/* Sticky Outer Header Container */}
      <header className="sticky top-0 z-50 w-full bg-white">
        {/* Topbar */}
        <div className="bg-[#0F172A] text-slate-300 text-[12px] md:text-[13px] py-2.5 hidden sm:block">
          <Container className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-2 md:gap-4 truncate">
              <span className="truncate">📍 {siteConfig.contact.address.split(",").slice(0, 2).join(",")}</span>
              <span className="hidden md:inline opacity-30">•</span>
              <span className="hidden lg:inline">✉️ {siteConfig.contact.email}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              <a href="#services" onClick={handleAnchorClick} className="hover:text-white transition whitespace-nowrap">Service Times</a>
              <a href="#live" onClick={handleAnchorClick} className="text-rose-200 hover:text-white flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                Live
              </a>
            </div>
          </Container>
        </div>

        {/* Main Nav */}
        <nav className={`border-b transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-rose-100 shadow-sm" : "bg-[#FFFBFB]/80 backdrop-blur-xl border-rose-100"}`}>
          <Container className="py-3 md:py-3.5 flex items-center justify-between gap-4">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex items-center gap-2.5 sm:gap-3 min-w-0 group">
              <img 
                src={WinnersLogoImg} 
                alt="Winners Chapel Logo" 
                className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
              />
              <div className="leading-[1.1] min-w-0">
                <strong className="block font-fraunces text-[14px] sm:text-[16px] text-slate-900 truncate">{siteConfig.name.split(",")[0]}</strong>
                <span className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-winners-red font-bold">Winners Chapel • Iseyin</span>
              </div>
            </a>

            <div className="hidden lg:flex items-center gap-6 xl:gap-7">
              {siteConfig.navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={handleAnchorClick}
                  className={`font-semibold text-[14px] relative group py-2 transition-colors ${activeSection === l.href ? "text-winners-red" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {l.label}
                  <span className={`absolute left-0 bottom-0 h-0.5 bg-winners-red transition-all duration-300 ${activeSection === l.href ? "w-full" : "w-0 group-hover:w-full"}`} />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <Button variant="outline" size="md" as="a" href="#giving" onClick={handleAnchorClick} className="hidden md:inline-flex">Give</Button>
              <Button as="a" href="#contact" onClick={handleAnchorClick} className="whitespace-nowrap">New Here? →</Button>
              
              {/* Toggle Icon */}
              <button 
                onClick={() => setOpen(!open)} 
                aria-label="Toggle menu" 
                className="lg:hidden w-10 h-10 rounded-xl border border-rose-100 bg-white grid place-items-center hover:bg-rose-50 transition text-lg"
              >
                {open ? "✕" : "☰"}
              </button>
            </div>
          </Container>
        </nav>

        {/* Compact Dropdown Menu */}
        {open && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-rose-100 shadow-xl transition-all">
            <Container className="py-4 space-y-1">
              {siteConfig.navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={handleNavClick}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-semibold transition ${
                    activeSection === l.href 
                      ? "bg-rose-50 text-winners-red" 
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {l.label}
                  <span className="text-sm opacity-60">→</span>
                </a>
              ))}

              <div className="pt-3 border-t border-rose-100/60 mt-2 flex gap-2">
                <Button as="a" href="#contact" onClick={handleNavClick} className="flex-1 py-2.5 text-xs text-center justify-center">
                  I'm New
                </Button>
                <Button variant="outline" as="a" href="#giving" onClick={handleNavClick} className="flex-1 py-2.5 text-xs text-center justify-center">
                  Give Online
                </Button>
              </div>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}