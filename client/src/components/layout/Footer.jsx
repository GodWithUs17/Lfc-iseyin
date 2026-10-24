/**
 * Footer - Site footer with links, newsletter, contact
 * Responsive grid, uses siteConfig
 */

import toast from "react-hot-toast";
import WinnersLogo from "@/components/brand/WINNER.png";
import Container from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export default function Footer() {
  const { handleAnchorClick } = useSmoothScroll(88);
  const quickLinks = siteConfig.navLinks.map(l => ({ label: l.label === "About" ? "About Us" : l.label === "Services" ? "Service Times" : l.label === "Sermons" ? "Sermons & Live" : l.label, href: l.href }));
  quickLinks.push({ label: "Give Online", href: "#giving" });

  const ministries = ["Children Church", "Youth Alive", "WOFBI", "Choir & Media", "Evangelism Team", "Welfare & Care"];

  return (
    <footer className="bg-[#020617] text-slate-400 pt-12 sm:pt-16 lg:pt-20 pb-6 sm:pb-8">
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-8 lg:gap-10 mb-10 sm:mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex gap-3 items-center mb-4">
              <img 
                src={WinnersLogo} 
                alt="Winners Chapel Logo" 
                className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
              />
              <div><strong className="block font-fraunces text-white text-[15px] sm:text-[16px]">{siteConfig.name.split(",")[0]}</strong><span className="block text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-winners-red font-bold">Winners Chapel • Iseyin</span></div>
            </div>
            <p className="text-[13px] sm:text-[14px] leading-[1.6] max-w-[320px]">{siteConfig.description}</p>
            {/* <div className="flex gap-2 mt-4 sm:mt-4.5">
              {[
                { icon: "f", href: siteConfig.socials.facebook, label: "Facebook" },
                { icon: "▶", href: siteConfig.socials.youtube, label: "YouTube" },
                { icon: "◎", href: siteConfig.socials.instagram, label: "Instagram" },
                { icon: "w", href: `https://wa.me/${siteConfig.contact.whatsapp}`, label: "WhatsApp" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:bg-white hover:text-slate-900 transition text-[14px]">{s.icon}</a>
              ))}
            </div> */}

            <div className="flex gap-2 mt-4 sm:mt-4.5">
  {[
    { 
      label: "Facebook", 
      href: siteConfig.socials.facebook, 
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H7v3h2v9h3v-9h2.77L15 8h-3V6.5a1 1 0 0 1 1-1h2V2h-3A3.5 3.5 0 0 0 8.5 5.5V8z"/>
        </svg>
      )
    },
    { 
      label: "YouTube", 
      href: siteConfig.socials.youtube, 
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { 
      label: "Instagram", 
      href: siteConfig.socials.instagram, 
      icon: (
        <svg className="w-5 h-5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      )
    },
    { 
      label: "WhatsApp", 
      href: `https://wa.me/${siteConfig.contact.whatsapp}`, 
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.454 5.709 1.455h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      )
    },
  ].map((s) => (
    <a 
      key={s.label} 
      href={s.href} 
      target="_blank" 
      rel="noopener noreferrer" 
      aria-label={s.label} 
      className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:bg-white hover:text-slate-900 transition"
    >
      {s.icon}
    </a>
  ))}
</div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-[11px] sm:text-[13px] tracking-[0.06em] uppercase mb-3 sm:mb-4.5 font-bold">Quick Links</h4>
            <div className="flex flex-col gap-1">
              {quickLinks.map((l) => (
                <a key={l.label} href={l.href} onClick={handleAnchorClick} className="py-1.5 text-[13px] sm:text-[14px] hover:text-white transition w-fit">{l.label}</a>
              ))}
            </div>
          </div>

          {/* Ministries */}
          <div>
            <h4 className="text-white text-[11px] sm:text-[13px] tracking-[0.06em] uppercase mb-3 sm:mb-4.5 font-bold">Ministries</h4>
            <div className="flex flex-col gap-1 text-[13px] sm:text-[14px]">
              {ministries.map((m) => (
                <a key={m} href="#ministries" className="py-1.5 hover:text-white transition w-fit">{m}</a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1 mt-2 lg:mt-0">
            <h4 className="text-white text-[11px] sm:text-[13px] tracking-[0.06em] uppercase mb-3 sm:mb-4.5 font-bold">Stay Updated</h4>
            <p className="text-[12px] sm:text-[13px] mb-3">Get weekly prophetic focus, events and testimonies.</p>
            <form onSubmit={(e) => { e.preventDefault(); toast.success("Thanks for subscribing! (Connect to Mailchimp/Formspree in production)"); }} className="flex gap-2">
              <input placeholder="Your email" type="email" required className="flex-1 min-w-0 px-3 sm:px-3.5 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-slate-500 text-[13px] focus:outline-none focus:border-white/20 transition" />
              <button type="submit" className="px-4 sm:px-4.5 py-2.5 sm:py-3 rounded-xl bg-winners-red text-white font-bold text-[13px] hover:bg-winners-red-dark transition shrink-0">Join</button>
            </form>
            <div className="mt-4 sm:mt-5 text-[12px] sm:text-[13px] p-3 rounded-xl bg-white/5 border border-white/10">
              <strong className="block text-white text-[12px] sm:text-[13px]">Service Hotline</strong>
              <span className="leading-relaxed">{siteConfig.contact.phone1}<br />{siteConfig.contact.phone2}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 sm:pt-7 flex flex-col sm:flex-row justify-between gap-3 text-[11px] sm:text-[13px]">
          <span className="leading-relaxed">© 2026 {siteConfig.name}. All Rights Reserved.<br className="sm:hidden" /> Winners Chapel International.</span>
          <span className="flex gap-3 sm:gap-4"><a href="#" className="hover:text-white transition">Privacy</a><a href="#" className="hover:text-white transition">Terms</a><span className="text-white font-medium">Jesus is Lord!</span></span>
        </div>
      </Container>
    </footer>
  );
}
