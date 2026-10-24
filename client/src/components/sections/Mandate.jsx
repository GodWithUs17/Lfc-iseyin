/**
 * Mandate Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 */
export default function Mandate() {
  const pillars = [
    { icon: "📖", bg: "bg-rose-50 text-winners-red border-rose-100", title: "The Word", desc: "Practical teaching of the Word of Faith that empowers for victorious living." },
    { icon: "🕊️", bg: "bg-amber-50 text-amber-700 border-amber-100", title: "The Supernatural", desc: "Signs, wonders and miracles as validation of the Word preached." },
    { icon: "🌍", bg: "bg-emerald-50 text-emerald-700 border-emerald-100", title: "Church Growth", desc: "Raising a people of exploits, advancing Kingdom across Iseyinland." },
    { icon: "🎓", bg: "bg-blue-50 text-blue-700 border-blue-100", title: "Leadership", desc: "Raising giants through WOFBI and mentorship for next generation." },
  ];

  return (
    <section id="about" className="bg-white py-12 sm:py-16 lg:py-[100px] border-y border-rose-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto text-center mb-8 sm:mb-12 lg:mb-14">
          <div className="inline-flex bg-rose-50 text-winners-red px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3">Our Mandate</div>
          <h2 className="font-fraunces text-[26px] sm:text-[32px] lg:text-[42px] leading-[1.1] tracking-tight text-slate-900">The Liberation Mandate delivered in an 18-hour vision</h2>
          <p className="text-slate-500 text-[14px] sm:text-[16px] lg:text-[17px] mt-3 sm:mt-4 leading-relaxed px-2 sm:px-0">On May 2nd, 1981, God said to Bishop David O. Oyedepo: "The hour has come to liberate the world from all oppressions of the devil..."</p>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {pillars.map(p => (
            <div key={p.title} className="group bg-[#FFFBFB] border border-rose-100 rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 lg:p-7 hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(196,30,58,0.15)] hover:bg-white transition-all duration-300">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] grid place-items-center mb-3 sm:mb-4 text-[18px] sm:text-xl border ${p.bg}`}>{p.icon}</div>
              <h3 className="font-fraunces text-[16px] sm:text-[18px] text-slate-900 mb-1.5 sm:mb-2 group-hover:text-winners-red transition-colors">{p.title}</h3>
              <p className="text-[13px] sm:text-[14px] text-slate-500 leading-[1.6]">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
