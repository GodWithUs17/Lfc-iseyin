import React, { useState } from 'react';

/**
 * Events Section - Living Faith Church Iseyin
 * Fixed UTC Timezone offset bug & added 3-card limit with full expansion toggle
 */
export default function Events({ data }) {
  const [showAll, setShowAll] = useState(false);
  const eventsList = Array.isArray(data?.events) ? data.events : [];

  const events = eventsList
    .map((ev, index) => {
      if (!ev || typeof ev !== 'object') return null;

      // 1. Extract raw date string from payload
      const rawDate = ev.eventDate || ev.event_date || ev.date || ev.startDate;
      let dateObj;

      if (rawDate) {
        if (typeof rawDate === 'string') {
          // Extract purely the YYYY-MM-DD digits, ignoring UTC time component completely
          const datePart = rawDate.split('T')[0]; 
          if (datePart.includes('-')) {
            const [year, month, day] = datePart.split('-').map(Number);
            // Construct using LOCAL time parameters (month is 0-indexed in JS)
            dateObj = new Date(year, month - 1, day);
          } else {
            dateObj = new Date(rawDate);
          }
        } else {
          dateObj = new Date(rawDate);
        }
      }

      // Fallback if missing or invalid
      if (!dateObj || isNaN(dateObj.getTime())) {
        dateObj = new Date();
      }

      // 2. Format Day Number
      const day = String(dateObj.getDate()).padStart(2, '0');

      // 3. Format Month and Weekday in Local Time
      const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
      const weekday = dateObj.toLocaleString('en-US', { weekday: 'short' });

      // 4. Time Formatting
      let timeString = ev.time || ev.eventTime || ev.event_time;
      if (!timeString) {
        timeString = dateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      }

      // Construct header string cleanly
      const monthYear = `${monthName} ${dateObj.getFullYear()} • ${weekday} • ${timeString}`;
      
      const tag = ev.category || ev.tag || 'Church Event';
      const location = ev.location || 'LFC Iseyin Auditorium';
      const color = ev.color || (index % 2 === 0 ? 'dark' : 'red');
      const fallbackId = `event-${index}-${(ev.title || 'church-event').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      return {
        ...ev,
        id: ev.id || ev._id || fallbackId,
        title: ev.title || 'Church Event',
        description: ev.description || '',
        day,
        monthYear,
        tag,
        location,
        color,
      };
    })
    .filter(Boolean);

  // Show only 3 items initially unless showAll state is triggered
  const visibleEvents = showAll ? events : events.slice(0, 3);

  return (
    <section id="events" className="py-12 sm:py-16 lg:py-[100px] bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex flex-col items-start gap-2 sm:gap-2.5 max-w-xl">
            <span className="inline-block bg-rose-50 text-winners-red px-3 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
              Calendar
            </span>
            <h2 className="font-fraunces text-[28px] sm:text-[36px] lg:text-[42px] text-slate-900 leading-[1.15] font-bold tracking-tight">
              Upcoming Events
            </h2>
          </div>

          {events.length > 3 && (
            <button 
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="hidden sm:inline-flex items-center justify-center shrink-0 px-5 py-2.5 rounded-full bg-winners-red text-white font-bold text-[13px] hover:bg-winners-red-dark transition-colors shadow-sm cursor-pointer"
            >
              {showAll ? 'Show Fewer Events' : `View Full Calendar (${events.length})`}
            </button>
          )}
        </div>

        {/* Events Cards Grid */}
        {events.length === 0 ? (
          <p className="text-center text-slate-500 py-12 text-[15px]">No upcoming events scheduled right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {visibleEvents.map((ev) => (
              <div 
                key={ev.id} 
                className="group flex flex-col justify-between border border-rose-100 rounded-[16px] sm:rounded-[20px] overflow-hidden bg-white hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 hover:border-rose-200 transition-all duration-300"
              >
                {/* Dynamic Black / Red Top Banner */}
                <div className={`flex items-center gap-2.5 text-white px-4 py-3 font-bold text-[13px] sm:text-[14px] ${ev.color === 'red' ? 'bg-winners-red' : 'bg-slate-900'}`}>
                  <b className="bg-white text-slate-900 w-8 h-8 sm:w-9 sm:h-9 grid place-items-center rounded-[8px] sm:rounded-[10px] font-fraunces text-[14px] sm:text-[16px] shrink-0">
                    {ev.day}
                  </b>
                  <span className="truncate text-[12px] sm:text-[14px]">{ev.monthYear}</span>
                </div>

                {/* Card Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 mb-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-winners-red border border-rose-100">
                      {ev.tag}
                    </span>
                    <h3 className="font-fraunces text-[16px] sm:text-[18px] text-slate-900 leading-snug group-hover:text-winners-red transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-slate-500 my-2 mb-3 leading-relaxed line-clamp-3">
                      {ev.description}
                    </p>
                  </div>

                  {/* Card Footer Location */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] sm:text-[13px] font-semibold text-slate-600">
                    <span className="truncate flex items-center gap-1.5">
                      📍 {ev.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile View Full Calendar Button */}
        {events.length > 3 && (
          <div className="sm:hidden mt-6 text-center">
            <button 
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex px-6 py-3 rounded-full bg-winners-red text-white font-bold text-[14px] w-full justify-center shadow-sm cursor-pointer"
            >
              {showAll ? 'Show Fewer Events' : `View Full Calendar (${events.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}