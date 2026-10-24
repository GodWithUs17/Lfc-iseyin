/**
 * Services Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 */

export default function Services({ data }) {
  const services = data?.services || [];

  return (
    <section id="services" className="py-12 sm:py-16 lg:py-[100px] bg-[#FFFBFB]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex bg-rose-50 text-winners-red px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Worship With Us</div>
            <h2 className="font-fraunces text-[26px] sm:text-[32px] lg:text-[42px] mt-2 sm:mt-3 leading-[1.1]">Service Times</h2>
          </div>
          <p className="max-w-[460px] text-slate-500 text-[13px] sm:text-[15px] leading-relaxed">Come early, come expectant. Every service is ordained for your supernatural turnaround. Covenant Hour of Prayer holds daily.</p>
        </div>

         

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {services.map(s => (
            <div key={s.id} className={`group rounded-[20px] sm:rounded-[24px] p-6 sm:p-7 lg:p-8 border shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)] transition-all duration-300 ${s.featured ? 'bg-winners-red text-white border-winners-red' : 'bg-white border-rose-100 hover:border-rose-200'}`}>
              <div className={`inline-block px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase ${s.featured ? 'bg-white/20 text-white' : 'bg-rose-50 text-winners-red'}`}>{s.tag}</div>
              <div className={`font-fraunces text-[28px] sm:text-[32px] lg:text-[36px] font-semibold mt-2 sm:mt-3 mb-1 ${s.featured ? 'text-white' : 'text-slate-900'}`}>{s.time}</div>
              <h3 className={`font-fraunces text-[16px] sm:text-[18px] leading-tight ${s.featured ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
              <p className={`text-[13px] sm:text-[14px] mt-2 leading-relaxed ${s.featured ? 'text-rose-200' : 'text-slate-500'}`}>{s.description}</p>
              <div className={`mt-4 h-px w-full ${s.featured ? 'bg-white/20' : 'bg-slate-100'} group-hover:w-full transition-all`}></div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[
            { icon: "⏰", title: "Covenant Hour of Prayer", sub: "Mon - Sat • 6:00AM - 7:00AM", bg: "bg-rose-50" },
            { icon: "👥", title: "Winners Satellite Fellowship", sub: "Saturday • 5:00PM • Home Cells", bg: "bg-amber-50" },
            { icon: "📚", title: "WOFBI Training", sub: "Monthly • Equip for Exploits", bg: "bg-emerald-50" },
          ].map(i => (
            <div key={i.title} className="bg-white border border-rose-100 rounded-xl sm:rounded-2xl p-4 flex gap-3 items-center hover:border-rose-200 hover:shadow-sm transition-all">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl grid place-items-center text-[18px] shrink-0 ${i.bg} border border-slate-100`}>{i.icon}</div>
              <div className="min-w-0"><strong className="block text-slate-900 text-[13px] sm:text-[14px] truncate">{i.title}</strong><span className="text-[11px] sm:text-[13px] text-slate-500 truncate block">{i.sub}</span></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
