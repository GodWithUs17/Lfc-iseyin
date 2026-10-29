/**
 * Ministries Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 */
import childrenImage from '@/components/brand/children.webp';
import youthImage from '@/components/brand/youthlfc.webp';
import menImage from '@/components/brand/menWomen.webp';


const ministries = [
  { title: "Kingdom Champions", cat: "Children", desc: "Word-based classes for ages 3-12 where children encounter Jesus early.", img: childrenImage },
  { title: "Youth Alive Fellowship", cat: "Youth", desc: "Teenagers and young adults on fire for God - raising giants.", img: youthImage },
  { title: "Winners Men & Women", cat: "Family", desc: "Empowering families, strengthening marriages and godly homes.", img: menImage },
  // { title: "WOFBI & Leadership", cat: "Training", desc: "2 weeks intensive to equip you for supernatural exploits.", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop" },
  { title: "Evangelism & WSF", cat: "Outreach", desc: "Every Winner is a soul winner. Join outreaches across Iseyin.", img: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop" },
  { title: "Winners Voices Choir", cat: "Music", desc: "Anointed minstrels leading high praises and worship.", img: "https://images.unsplash.com/photo-1514320290767-862d51c16a09?q=80&w=600&auto=format&fit=crop" },
];

export default function Ministries() {
  return (
    <section id="ministries" className="py-12 sm:py-16 lg:py-[100px] bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="max-w-[720px] mx-auto text-center mb-8 sm:mb-12 lg:mb-14">
          <div className="inline-flex bg-rose-50 text-winners-red px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase mb-3">Family & Growth</div>
          <h2 className="font-fraunces text-[24px] sm:text-[32px] lg:text-[42px] leading-[1.1]">A place for everyone</h2>
          <p className="text-slate-500 text-[14px] sm:text-[16px] lg:text-[17px] mt-3 leading-relaxed">From children to youth, singles to married - vibrant ministry to nurture your faith at every stage.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-[22px]">
          {ministries.map(m => (
            <div key={m.title} className="group rounded-[16px] sm:rounded-[20px] overflow-hidden border border-slate-100 bg-[#FFFBFB] hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)] hover:bg-white transition-all duration-300">
              <div className="h-[180px] sm:h-[200px] bg-rose-100 relative overflow-hidden">
                <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent"></div>
                <span className="absolute left-3 bottom-3 bg-white/95 backdrop-blur text-slate-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide uppercase shadow-sm">{m.cat}</span>
              </div>
              <div className="p-4 sm:p-[22px]">
                <h3 className="font-fraunces text-[16px] sm:text-[18px] text-slate-900 mb-1.5 group-hover:text-winners-red transition-colors">{m.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
