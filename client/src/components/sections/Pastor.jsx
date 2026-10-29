/**
 * Pastor Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 */
import WinnersLogo from '@/components/brand/WINNER.webp';
import pastorImage from '@/components/brand/ResidentPastor.webp';

export default function Pastor() {
  return (
    <section className="bg-slate-900 text-white py-12 sm:py-16 lg:py-[110px] relative overflow-hidden">
      <div className="absolute right-[-20%] top-[-30%] w-[70%] h-[140%] bg-[radial-gradient(ellipse_at_center,rgba(196,30,58,0.25),transparent_60%)] pointer-events-none"></div>
      
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-16 items-center">
        {/* Image */}
        <div className="relative order-2 lg:order-1">
          <div className="rounded-[20px] sm:rounded-[28px] overflow-hidden aspect-[4/5] sm:aspect-[4/5] max-w-[400px] mx-auto lg:max-w-none border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] bg-slate-800">
            <img src={pastorImage} alt="Resident Pastor - LFC Iseyin" className="w-full h-full object-cover" loading="lazy" />
          </div>
          {/* Logo badge */}
          <div className="absolute -bottom-3 -right-3 sm:bottom-4 sm:right-4 lg:-right-4 bg-white rounded-2xl p-2 sm:p-3 shadow-xl border border-slate-100 hidden sm:flex">
            <img 
                src={WinnersLogo} 
                alt="Winners Chapel Logo" 
                className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
              />
          </div>
        </div>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 bg-white/10 text-rose-200 border border-white/10 px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
            <img 
                src={pastorImage} 
                alt="Winners Chapel Logo" 
                className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain group-hover:scale-105 transition-transform" 
              /> Resident Pastor
          </div>
          
          <h2 className="font-fraunces text-[26px] sm:text-[32px] lg:text-[42px] leading-[1.1] mt-3 sm:mt-4 mb-3 sm:mb-4">A shepherd after God's heart serving Iseyinland</h2>
          
          <p className="text-slate-400 text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed">We are blessed with an anointed Resident Pastor who carries the grace of this Commission with passion for souls, discipleship and community transformation.</p>

          <div className="my-5 sm:my-7 p-4 sm:p-5 border-l-[3px] border-winners-red bg-white/[0.04] rounded-r-[12px] sm:rounded-r-[16px] text-slate-200 italic text-[14px] sm:text-[15px] leading-relaxed">
            "We have seen God turn Iseyin into a city of turnaround testimonies. Every service is an encounter with destiny. Your season of settlement has come!"
            <div className="mt-2 sm:mt-3 not-italic font-bold text-white text-[13px] sm:text-[14px]">— Resident Pastor, LFC Iseyin</div>
          </div>

          <p className="text-slate-400 text-[13px] sm:text-[15px] leading-relaxed">Under the covering of Bishop David O. Oyedepo and Bishop David Abioye, we labor to see every member established in the faith and empowered for exploits.</p>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 items-start xs:items-center mt-6 sm:mt-7">
            <div className="flex gap-3 items-center">
              <img src={pastorImage} alt="Resident Pastor - LFC Iseyin" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover" />
              <div>
                <div className="text-white font-bold text-[14px]">Pst. Matthew Olajide</div>
                <div className="text-[12px] sm:text-[13px] text-slate-400">Living Faith Church, Iseyin</div>
              </div>
            </div>
            <a href="#contact" className="xs:ml-auto w-full xs:w-auto text-center px-5 py-2.5 rounded-full bg-transparent border border-white/20 text-white font-bold text-[13px] hover:bg-white hover:text-slate-900 transition">Send a Message</a>
          </div>
        </div>
      </div>
    </section>
  );
}
