import { useState } from 'react';

/**
 * Sermons Section - Living Faith Church Iseyin
 * Ultra-Responsive, Zero-Overflow, Cross-Device Optimized
 */
export default function Sermons({ data }) {
  const sermons = data?.sermons || [];
  const live = data?.live;

  const [activeId, setActiveId] = useState(sermons?.[0]?.id || 'live');
  const [isPlaying, setIsPlaying] = useState(false);

  // Parse YouTube Video ID safely
  const getYouTubeId = (url) => {
    if (!url) return '';
    try {
      if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split(/[?&]/)[0];
      if (url.includes('watch?v=')) return url.split('watch?v=')[1].split(/[&]/)[0];
      if (url.includes('embed/')) return url.split('embed/')[1].split(/[?&]/)[0];
      return url;
    } catch {
      return '';
    }
  };

  // Thumbnail generator
  const getThumb = (url) => {
    const id = getYouTubeId(url);
    return id 
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` 
      : 'https://images.unsplash.com/photo-1507692049790-de58227181d0?q=80&w=1000&auto=format&fit=crop';
  };

  const formatSermonDate = (value) => {
    if (!value) return 'Recent message';

    const cleanValue = String(value).trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanValue)) {
      const [year, month, day] = cleanValue.split('-');
      const parsed = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
      return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const parsedDate = new Date(cleanValue);
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    return cleanValue;
  };

  const current = sermons.find((s) => s.id === activeId) || {
    title: live?.title || 'Sunday Service',
    preacher: live?.preacher || 'Living Faith Church Iseyin',
    date: live?.date || 'Live Broadcast',
    youtubeUrl: live?.youtubeUrl || '',
  };

  const currentDate = formatSermonDate(current?.date || live?.date);
  const currentVideoId = getYouTubeId(current?.youtubeUrl || live?.youtubeUrl);

  const handleSelectSermon = (sermonId) => {
    setActiveId(sermonId);
    setIsPlaying(false);
  };

  return (
    <section id="sermons" className="py-8 sm:py-16 lg:py-[100px] bg-slate-50 w-full overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-3.5 sm:px-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2.5 sm:gap-4 mb-5 sm:mb-8">
          <div>
            <div className="inline-flex bg-rose-50 text-winners-red px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
              Media & Messages
            </div>
            <h2 className="font-fraunces text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[42px] mt-1.5 leading-[1.15] text-slate-900 font-bold">
              Recent Sermons & Live
            </h2>
          </div>
          <a
            href={data?.church?.youtube || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 font-bold text-[13px] text-slate-800 hover:border-slate-900 transition shadow-sm shrink-0"
          >
            <span>YouTube Channel</span>
            <span className="text-[11px]">→</span>
          </a>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 sm:gap-6 lg:gap-8 items-start">
          
          {/* Main Video Player Container */}
          <div id="live" className="w-full bg-slate-900 rounded-[18px] xs:rounded-[22px] sm:rounded-[28px] p-3 xs:p-4 sm:p-5 lg:p-6 text-white relative overflow-hidden shadow-xl border border-slate-800">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(500px_at_0%_0%,rgba(225,29,72,0.2),transparent)] pointer-events-none" />

            {/* Status Indicator Bar */}
            <div className="relative flex justify-between items-center mb-2.5 sm:mb-4 gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0 ${
                    live?.isLive
                      ? 'bg-red-500 animate-pulse shadow-[0_0_0_3px_rgba(239,68,68,0.2)]'
                      : 'bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.2)]'
                  }`}
                />
                <span className="text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.1em] uppercase font-bold text-slate-200 truncate">
                  {live?.isLive ? 'LIVE NOW' : 'Now Playing'}
                </span>
              </div>
              <span className="bg-white/10 text-white/90 px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-[11px] font-medium truncate max-w-[45%] backdrop-blur-sm">
                {currentDate}
              </span>
            </div>

            {/* Video Player Box (Fixed 16:9 Aspect Ratio) */}
            <div className="relative w-full aspect-video rounded-[10px] xs:rounded-[14px] sm:rounded-[18px] overflow-hidden bg-slate-800 mb-3 sm:mb-4 shadow-inner">
              {isPlaying && currentVideoId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0`}
                  title={current?.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="relative w-full h-full group cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={getThumb(current?.youtubeUrl || live?.youtubeUrl)}
                    alt={current?.title || 'Sermon Thumbnail'}
                    className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent group-hover:bg-slate-950/30 transition-colors" />

                  {/* Centered Play Button */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 rounded-full bg-winners-red text-white grid place-items-center shadow-[0_8px_20px_rgba(225,29,72,0.4)] group-hover:scale-110 transition duration-300 text-[14px] xs:text-[16px] sm:text-[22px] pl-0.5">
                      ▶
                    </div>
                  </div>

                  {/* Overlay Tag */}
                  <div className="absolute bottom-2 left-2 right-2 xs:bottom-2.5 xs:left-2.5 xs:right-2.5 sm:bottom-3 sm:left-3 sm:right-3 bg-slate-900/85 backdrop-blur-md rounded-lg xs:rounded-xl px-2.5 py-1.5 flex justify-between items-center text-[10px] sm:text-[11px] text-white/90">
                    <span className="truncate font-medium pr-2">Tap to play inline</span>
                    <span className="shrink-0 text-winners-red font-bold text-[9px] xs:text-[10px]">PLAY ▶</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info Details */}
            <h3 className="relative font-fraunces text-[16px] xs:text-[18px] sm:text-[22px] lg:text-[24px] text-white font-bold mb-1 leading-snug line-clamp-2">
              {current?.title}
            </h3>
            <p className="relative text-[11px] xs:text-[12px] sm:text-[13px] leading-relaxed mb-3.5 flex flex-wrap items-center gap-1.5">
              <span className="uppercase tracking-[0.12em] text-rose-200/90 font-bold">Preacher</span>
              <span className="text-slate-100 font-semibold">{current?.preacher || 'Living Faith Church Iseyin'}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">{currentDate}</span>
            </p>

            {/* Action Buttons */}
            <div className="relative flex flex-col xs:flex-row gap-2 pt-2 border-t border-slate-800/80">
              <a
                href={current?.youtubeUrl || live?.youtubeUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full xs:w-auto justify-center px-4 py-2.5 rounded-full bg-winners-red text-white font-bold text-[12px] hover:bg-winners-red-dark transition flex items-center gap-1.5 text-center shrink-0"
              >
                <span>Watch on YouTube</span>
                <span className="text-[10px]">↗</span>
              </a>
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-full xs:w-auto justify-center px-4 py-2.5 rounded-full bg-white/10 text-white font-semibold text-[12px] hover:bg-white/20 transition text-center shrink-0"
              >
                {isPlaying ? 'Close Embed' : 'Inline Player'}
              </button>
            </div>
          </div>

          {/* Right Sermon Playlist Container */}
          <div className="w-full flex flex-col gap-2.5 sm:gap-3">
            
            {/* Mobile Playlist Header */}
            <div className="flex justify-between items-center sm:hidden px-1">
              <span className="text-[12px] font-bold text-slate-800 uppercase tracking-wider">
                Recent Sermons
              </span>
              <a
                href="https://www.youtube.com/@lfcww"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-winners-red font-bold flex items-center gap-1"
              >
                Channel <span>→</span>
              </a> 
            </div>

            {/* List Element (Horizontal Touch Carousel on Mobile, Vertical Stack on Desktop) */}
            <div className="w-full flex lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {sermons.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSermon(s.id)}
                    className={`flex gap-2.5 xs:gap-3 items-center rounded-xl xs:rounded-2xl p-2 xs:p-2.5 sm:p-3 border cursor-pointer transition-all duration-200 shrink-0 lg:shrink w-[82vw] xs:w-[280px] sm:w-[320px] lg:w-auto snap-start ${
                      isActive
                        ? 'border-winners-red bg-rose-50/90 shadow-sm ring-1 ring-winners-red/30'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-lg xs:rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={getThumb(s.youtubeUrl)}
                        alt={s.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 grid place-items-center">
                        <span className="w-4 h-4 xs:w-5 xs:h-5 rounded-full bg-white/90 text-slate-900 grid place-items-center text-[8px] xs:text-[9px] pl-0.5">
                          ▶
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <strong className={`block text-[12px] xs:text-[13px] sm:text-[14px] truncate leading-snug ${isActive ? 'text-winners-red' : 'text-slate-900'}`}>
                        {s.title}
                      </strong>
                      <span className="text-[10px] xs:text-[11px] sm:text-[12px] text-slate-700 font-medium truncate block mt-0.5">
                        {s.preacher || 'Living Faith Church Iseyin'}
                      </span>
                      <span className="text-[9px] xs:text-[10px] sm:text-[11px] text-slate-400 block truncate">
                        {formatSermonDate(s.date)}
                      </span>
                    </div>

                    <span className={`text-[12px] sm:text-[14px] shrink-0 pr-1 ${isActive ? 'text-winners-red font-bold' : 'text-slate-300'}`}>
                      {isActive ? '●' : '›'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Audio Podcast Footer Box */}
            <div className="w-full bg-white border border-slate-200/90 rounded-xl xs:rounded-2xl p-3.5 sm:p-4 text-center mt-1 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 font-bold text-slate-900 text-[13px] sm:text-[14px]">
                <span>🎧</span>
                <span>Audio Podcast & Messages</span>
              </div>
              <p className="text-[11px] sm:text-[12px] text-slate-500 my-1 mb-2.5">
                Listen on Spotify, Apple & Google Podcasts
              </p>
              <a
                href={data?.church?.podcastUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 text-white font-bold text-[11px] sm:text-[12px] hover:bg-slate-800 transition shadow-sm"
              >
                <span>Listen Now</span>
                <span className="text-[9px]">↗</span>
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
