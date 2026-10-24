import WinnersLogo from '@/components/brand/WINNER.png';

export default function Location({ data }) {
  const church = data?.church;

  return (
    <section id="location" className="bg-slate-900 overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Info */}
        <div className="px-4 sm:px-6 lg:pl-[max(16px,calc((100vw-1280px)/2+24px))] lg:pr-12 py-10 sm:py-14 lg:py-20 text-white flex flex-col justify-center order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-white/10 text-rose-200 border border-white/10 px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase w-fit">
             <img 
                            src={WinnersLogo} 
                            alt="Winners Chapel Logo" 
                            className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
                          /> Find Us
          </div>
          <h2 className="font-fraunces text-[24px] sm:text-[32px] lg:text-[42px] mt-3 sm:mt-4 mb-2 sm:mb-3 leading-[1.1]">We are in the heart of Iseyin</h2>
          <p className="text-slate-400 text-[13px] sm:text-[15px] leading-relaxed">Located along the Oyo-Iseyin express, accessible from Oja Oba, Koso, and Iseyin Township. Your family is welcome.</p>

          <div className="my-6 sm:my-8 flex flex-col gap-4 sm:gap-[18px]">
            {[
              { icon: "📍", title: "Church Address", text: church?.address || "Sawmill Area, Along Saki Road, Iseyin, Oyo State, Nigeria" },
              { icon: "🕒", title: "Office Hours", text: "Mon - Fri: 9AM - 4PM | Sat: 10AM - 2PM" },
              { icon: "📞", title: "Call / WhatsApp", text: `${church?.phone1 || '+234 803 123 4567'} • ${church?.phone2 || '+234 805 987 6543'}` },
            ].map(i => (
              <div key={i.title} className="flex gap-3 sm:gap-3.5 items-start">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 grid place-items-center shrink-0 text-[16px]">{i.icon}</div>
                <div className="min-w-0"><strong className="block text-white text-[13px] sm:text-[14px]">{i.title}</strong><span className="text-slate-400 text-[12px] sm:text-[14px] leading-relaxed block">{i.text}</span></div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <a href="https://maps.google.com/?q=Iseyin+Oyo+State" target="_blank" className="px-5 py-3 rounded-full bg-winners-red text-white font-bold text-[13px] sm:text-[14px] text-center hover:bg-winners-red-dark transition">Open in Google Maps</a>
            <a href="#contact" className="px-5 py-3 rounded-full bg-transparent border border-white/20 text-white font-bold text-[13px] sm:text-[14px] text-center hover:bg-white hover:text-slate-900 transition">Contact Us</a>
          </div>
        </div>

        <div className="bg-slate-800 relative overflow-hidden min-h-[320px] sm:min-h-[420px] lg:min-h-0 order-1 lg:order-2">
  {/* Google Maps Embed */}
  <iframe
    title="Living Faith Church Iseyin Location Map"
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.564789524185!2d3.573361174981441!3d7.989444992036124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1030bb2b15887643%3A0x2de3a18486c75d61!2sLiving%20Faith%20Church%20(Winners%20Chapel)!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
    className="absolute inset-0 w-full h-full border-0 grayscale-[20%] contrast-[1.05]"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  />

  {/* Floating Location Badge Overlay */}
  <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
    <div className="bg-white/95 backdrop-blur-md p-2.5 pr-4 sm:p-3 sm:pr-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex gap-3 items-center max-w-[90%] border border-rose-100">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-winners-red grid place-items-center p-1 shrink-0 shadow-sm">
        <img 
          src={WinnersLogo} 
          alt="Winners Chapel Logo" 
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain" 
        />
      </div>
      <div className="min-w-0">
        <strong className="block text-slate-900 text-[13px] sm:text-[14px] truncate font-bold">
          LFC Iseyin
        </strong>
        <span className="text-[11px] sm:text-[12px] text-slate-500 truncate block">
          Winners Chapel International
        </span>
      </div>
    </div>
  </div>
</div>
      </div>

      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
    </section>
  );
}
