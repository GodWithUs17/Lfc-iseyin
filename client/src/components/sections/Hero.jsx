// /**
//  * Hero Section - Living Faith Church Iseyin
//  * Responsive, data-driven, reusable
//  * Uses siteConfig and data.json for live status
//  */

// import { useState, useEffect } from "react";
// import WinnersLogo from "@/components/brand/WINNER.png";
// import LfcIseyin from "@/components/brand/LfcIseyin.png";
// import Container from "@/components/ui/Container";
// import Badge from "@/components/ui/Badge";
// import Button from "@/components/ui/Button";
// import { getYouTubeWatchUrl } from "@/lib/youtube";

// export default function Hero({ data }) {
//   // Local state to guarantee instant reactivity when admin saves/toggles
//   const [liveState, setLiveState] = useState(() => {
//     try {
//       const saved = localStorage.getItem("LFC_LIVE_DATA");
//       if (saved) return JSON.parse(saved);
//     } catch {}
//     return data?.live || {};
//   });

//   // Sync with props or localStorage changes in real-time
//   useEffect(() => {
//     if (data?.live) {
//       setLiveState(data.live);
//     }
//   }, [data]);

//   useEffect(() => {
//     const handleStorage = (e) => {
//       if (e.key === "LFC_LIVE_DATA" && e.newValue) {
//         try {
//           setLiveState(JSON.parse(e.newValue));
//         } catch {}
//       }
//     };
//     window.addEventListener("storage", handleStorage);
    
//     // Custom event dispatcher listener if triggered on same window tab
//     const handleCustomSync = () => {
//       try {
//         const saved = localStorage.getItem("LFC_LIVE_DATA");
//         if (saved) setLiveState(JSON.parse(saved));
//       } catch {}
//     };
//     window.addEventListener("lfc_live_updated", handleCustomSync);

//     return () => {
//       window.removeEventListener("storage", handleStorage);
//       window.removeEventListener("lfc_live_updated", handleCustomSync);
//     };
//   }, []);

//   // Fail-safe coercion for isLive (handles boolean, string "true", number 1)
//   const isLive = 
//     liveState.isLive === true || 
//     liveState.isLive === "true" || 
//     liveState.isLive === 1 || 
//     liveState.isLive === "1";

//   // Resolve active YouTube link (checking streamUrl first per Prisma schema)
//   const rawStreamInput = liveState.streamUrl || liveState.youtubeUrl || liveState.youtubeId || "";
//   const parsedWatchUrl = getYouTubeWatchUrl(rawStreamInput);
  
//   const watchLiveHref = parsedWatchUrl || (
//     rawStreamInput.length === 11 
//       ? `https://www.youtube.com/watch?v=${rawStreamInput}`
//       : "https://www.youtube.com/@winnerschapel"
//   );

//   return (
//     <section className="relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(600px_at_20%_0%,#FFE4E6_0%,transparent_60%),radial-gradient(800px_at_80%_100%,#FEF3C7_0%,transparent_60%)] opacity-60 pointer-events-none" />
      
//       <Container className="relative">
//         <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center min-h-0 lg:min-h-[760px] py-8 sm:py-12 lg:py-0">
          
//           <div className="order-2 lg:order-1 py-2 sm:py-6 lg:py-12">
//             <Badge className="gap-2 bg-white border-rose-100 shadow-sm">
//               <span className="w-[18px] h-[18px] rounded-full bg-rose-50 border border-rose-200 grid place-items-center p-[1px]">
//                 <svg viewBox="0 0 200 200" className="w-full h-full">
//                   <circle cx="100" cy="108" r="78" fill="#C41E3A"/>
//                   <circle cx="100" cy="108" r="52" fill="white"/>
//                   <ellipse cx="100" cy="108" rx="22" ry="52" fill="none" stroke="#C41E3A" strokeWidth="4"/>
//                 </svg>
//               </span>
//               Liberation Mandate • Est. 1981
//             </Badge>

//             <h1 className="font-fraunces text-[32px] xs:text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.95] tracking-[-0.02em] text-slate-900 mt-4 sm:mt-5 mb-4 sm:mb-5 font-semibold">
//               Welcome to <span className="relative inline-block text-winners-red">Living Faith Church<span className="absolute left-0 bottom-1 sm:bottom-2 w-full h-2 sm:h-3 bg-rose-100 -z-10 rounded-sm" /></span> Iseyin
//             </h1>

//             <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-slate-600 max-w-[560px] mb-6 sm:mb-8 leading-[1.6]">
//               A family of faith where destinies are transformed by the Word of Faith. Join thousands experiencing liberation and supernatural turnaround.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-9">
//               <Button as="a" href="#services" size="lg" className="w-full sm:w-auto justify-center">
//                 Join Us This Sunday →
//               </Button>
//               <Button 
//                 as="a" 
//                 href={watchLiveHref} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 variant="outline" 
//                 size="lg" 
//                 className="w-full sm:w-auto justify-center"
//               >
//                 ▶ Watch Live
//               </Button>
//             </div>

//             <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-7 pt-6 sm:pt-7 border-t border-rose-100">
//               {[
//                 { k: "2", v: "Sunday Services" },
//                 { k: "6AM", v: "Daily CHOP" },
//                 { k: "500+", v: "Souls Family" },
//                 { k: "WOFBI", v: "Training Center" },
//               ].map(s => (
//                 <div key={s.v} className="min-w-0">
//                   <strong className="block font-fraunces text-[22px] sm:text-[28px] leading-none text-slate-900">{s.k}</strong>
//                   <span className="text-[11px] sm:text-[13px] text-slate-500 font-medium leading-tight">{s.v}</span>
//                 </div>
//               ))} 
//             </div>
//           </div>

//           <div className="order-1 lg:order-2 relative">
//             <div className="relative rounded-[20px] sm:rounded-[28px] overflow-hidden h-[380px] xs:h-[440px] sm:h-[520px] lg:h-[640px] shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)] lg:rotate-[1deg] bg-rose-100">
//               <img src={LfcIseyin} alt="Living Faith Church Iseyin" className="w-full h-full object-cover" loading="eager" />
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
//               <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur rounded-full p-1.5 sm:p-2 shadow-lg">
//                 <img 
//                   src={WinnersLogo} 
//                   alt="Winners Chapel Logo" 
//                   className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
//                 />
//               </div>

//               {/* Mobile Status Badge */}
//               <div className="absolute bottom-3 left-3 right-3 sm:hidden bg-white/95 backdrop-blur rounded-2xl p-3 flex gap-3 items-center shadow-xl">
//                 <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isLive ? 'bg-red-500 animate-pulse shadow-[0_0_0_4px_#FECACA]' : 'bg-emerald-500 shadow-[0_0_0_4px_#DCFCE7]'}`} />
//                 <div className="min-w-0">
//                   <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
//                     {isLive ? '🔴 LIVE NOW' : 'Next Service'}
//                   </div>
//                   <div className="text-[13px] font-bold text-slate-900 truncate">
//                     {isLive ? (liveState?.title || 'Sunday Service Live') : 'Sunday • 7:30AM'}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Desktop Status Badge */}
//             <div className="hidden sm:flex absolute -left-4 lg:-left-6 bottom-8 lg:bottom-12 bg-white rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-4 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] gap-3.5 items-center max-w-[300px] sm:max-w-[320px] -rotate-1 z-10 border border-slate-100">
//               <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isLive ? 'bg-red-500 shadow-[0_0_0_4px_#FECACA] animate-pulse' : 'bg-emerald-500 shadow-[0_0_0_4px_#DCFCE7]'}`} />
//               <div className="min-w-0">
//                 <small className="block text-slate-500 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
//                   {isLive ? '🔴 LIVE NOW ON YOUTUBE' : 'Next Live Service'}
//                 </small>
//                 <strong className="text-[12px] sm:text-[14px] text-slate-900 leading-tight line-clamp-2">
//                   {isLive ? (liveState?.title || 'Sunday Service Live') : 'Sunday Turnaround Service • 7:30AM'}
//                 </strong>
//                 <div className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 truncate">
//                   Km 3 Oyo-Iseyin Road • Be our guest
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </Container>
//     </section>
//   );
// }



/**
 * Hero Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 * Uses siteConfig and data.json for live status
 */

import { useState, useEffect } from "react";
import WinnersLogo from "@/components/brand/WINNER.png";
import LfcIseyin from "@/components/brand/LfcIseyin.png";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { getYouTubeWatchUrl } from "@/lib/youtube";

export default function Hero({ data }) {
  // Local state to guarantee instant reactivity when admin saves/toggles
  const [liveState, setLiveState] = useState(() => {
    try {
      const saved = localStorage.getItem("LFC_LIVE_DATA");
      if (saved) return JSON.parse(saved);
    } catch {}
    return data?.live || {};
  });

  // Sync with props or localStorage changes in real-time
  useEffect(() => {
    if (data?.live) {
      setLiveState(data.live);
    }
  }, [data]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "LFC_LIVE_DATA" && e.newValue) {
        try {
          setLiveState(JSON.parse(e.newValue));
        } catch {}
      }
    };

    const handleCustomSync = () => {
      try {
        const saved = localStorage.getItem("LFC_LIVE_DATA");
        if (saved) setLiveState(JSON.parse(saved));
      } catch {}
    };

    const handleFocus = () => {
      handleCustomSync();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("lfc_live_updated", handleCustomSync);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("lfc_live_updated", handleCustomSync);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Fail-safe coercion for isLive (handles boolean, string "true", number 1)
  const isLive = 
    liveState.isLive === true || 
    liveState.isLive === "true" || 
    liveState.isLive === 1 || 
    liveState.isLive === "1";

  // Resolve active YouTube link (checking streamUrl first per Prisma schema)
  const rawStreamInput = liveState.streamUrl || liveState.youtubeUrl || liveState.youtubeId || "";
  const parsedWatchUrl = getYouTubeWatchUrl(rawStreamInput);
  
  const watchLiveHref = parsedWatchUrl || (
    rawStreamInput.length === 11 
      ? `https://www.youtube.com/watch?v=${rawStreamInput}`
      : "https://www.youtube.com/@winnerschapel"
  );

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(600px_at_20%_0%,#FFE4E6_0%,transparent_60%),radial-gradient(800px_at_80%_100%,#FEF3C7_0%,transparent_60%)] opacity-60 pointer-events-none" />
      
      <Container className="relative">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center min-h-0 lg:min-h-[760px] py-8 sm:py-12 lg:py-0">
          
          <div className="order-2 lg:order-1 py-2 sm:py-6 lg:py-12">
            <Badge className="gap-2 bg-white border-rose-100 shadow-sm">
              <span className="w-[18px] h-[18px] rounded-full bg-rose-50 border border-rose-200 grid place-items-center p-[1px]">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="108" r="78" fill="#C41E3A"/>
                  <circle cx="100" cy="108" r="52" fill="white"/>
                  <ellipse cx="100" cy="108" rx="22" ry="52" fill="none" stroke="#C41E3A" strokeWidth="4"/>
                </svg>
              </span>
              Liberation Mandate • Est. 1981
            </Badge>

            <h1 className="font-fraunces text-[32px] xs:text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[0.95] tracking-[-0.02em] text-slate-900 mt-4 sm:mt-5 mb-4 sm:mb-5 font-semibold">
              Welcome to <span className="relative inline-block text-winners-red">Living Faith Church<span className="absolute left-0 bottom-1 sm:bottom-2 w-full h-2 sm:h-3 bg-rose-100 -z-10 rounded-sm" /></span> Iseyin
            </h1>

            <p className="text-[15px] sm:text-[17px] lg:text-[18px] text-slate-600 max-w-[560px] mb-6 sm:mb-8 leading-[1.6]">
              A family of faith where destinies are transformed by the Word of Faith. Join thousands experiencing liberation and supernatural turnaround.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8 sm:mb-9">
              <Button as="a" href="#services" size="lg" className="w-full sm:w-auto justify-center">
                Join Us This Sunday →
              </Button>
              <Button 
                as="a" 
                href={watchLiveHref} 
                target="_blank" 
                rel="noopener noreferrer"
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto justify-center"
              >
                ▶ Watch Live
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:flex gap-4 sm:gap-7 pt-6 sm:pt-7 border-t border-rose-100">
              {[
                { k: "2", v: "Sunday Services" },
                { k: "6AM", v: "Daily CHOP" },
                { k: "500+", v: "Souls Family" },
                { k: "WOFBI", v: "Training Center" },
              ].map(s => (
                <div key={s.v} className="min-w-0">
                  <strong className="block font-fraunces text-[22px] sm:text-[28px] leading-none text-slate-900">{s.k}</strong>
                  <span className="text-[11px] sm:text-[13px] text-slate-500 font-medium leading-tight">{s.v}</span>
                </div>
              ))} 
            </div>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative rounded-[20px] sm:rounded-[28px] overflow-hidden h-[380px] xs:h-[440px] sm:h-[520px] lg:h-[640px] shadow-[0_20px_60px_-20px_rgba(15,23,42,0.2)] lg:rotate-[1deg] bg-rose-100">
              <img src={LfcIseyin} alt="Living Faith Church Iseyin" className="w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 backdrop-blur rounded-full p-1.5 sm:p-2 shadow-lg">
                <img 
                  src={WinnersLogo} 
                  alt="Winners Chapel Logo" 
                  className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
                />
              </div>

              {/* Mobile Status Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:hidden bg-white/95 backdrop-blur rounded-2xl p-3 flex gap-3 items-center shadow-xl">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isLive ? 'bg-red-500 animate-pulse shadow-[0_0_0_4px_#FECACA]' : 'bg-emerald-500 shadow-[0_0_0_4px_#DCFCE7]'}`} />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
                    {isLive ? '🔴 LIVE NOW' : 'Next Service'}
                  </div>
                  <div className="text-[13px] font-bold text-slate-900 truncate">
                    {isLive ? (liveState?.title || 'Sunday Service Live') : 'Sunday • 7:30AM'}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Status Badge */}
            <div className="hidden sm:flex absolute -left-4 lg:-left-6 bottom-8 lg:bottom-12 bg-white rounded-[16px] sm:rounded-[20px] p-3.5 sm:p-4 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)] gap-3.5 items-center max-w-[300px] sm:max-w-[320px] -rotate-1 z-10 border border-slate-100">
              <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isLive ? 'bg-red-500 shadow-[0_0_0_4px_#FECACA] animate-pulse' : 'bg-emerald-500 shadow-[0_0_0_4px_#DCFCE7]'}`} />
              <div className="min-w-0">
                <small className="block text-slate-500 text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase">
                  {isLive ? '🔴 LIVE NOW ON YOUTUBE' : 'Next Live Service'}
                </small>
                <strong className="text-[12px] sm:text-[14px] text-slate-900 leading-tight line-clamp-2">
                  {isLive ? (liveState?.title || 'Sunday Service Live') : 'Sunday Turnaround Service • 7:30AM'}
                </strong>
                <div className="text-[11px] sm:text-[12px] text-slate-500 mt-0.5 truncate">
                  Km 3 Oyo-Iseyin Road • Be our guest
                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}