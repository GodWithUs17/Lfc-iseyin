import { useState } from 'react';

/**
 * Giving Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 */
export default function Giving() {
  const [copiedAccount, setCopiedAccount] = useState('');

  // Real Account Details (UBA)
  const accounts = [
    {
      id: 'tithe',
      title: 'Tithe & Offering',
      bank: 'UBA',
      accountNumber: '1012708782',
      accountName: 'Living Faith Church Iseyin',
      tag: 'SUNDAY / MIDWEEK',
    },
    {
      id: 'project',
      title: 'Local Church Project',
      bank: 'UBA',
      accountNumber: '1022828607',
      accountName: 'Living Faith Church Iseyin',
      tag: 'BUILDING / PROJECTS',
    },
    {
      id: 'welfare',
      title: 'Kingdom Care (Welfare)',
      bank: 'UBA',
      accountNumber: '1027249698',
      accountName: 'Living Faith Church Iseyin',
      tag: 'WELFARE & CHARITY',
    },
  ];

  const handleCopy = (accNo) => {
    navigator.clipboard.writeText(accNo);
    setCopiedAccount(accNo);
    setTimeout(() => setCopiedAccount(''), 2000);
  };

  return (
    <section id="giving" className="py-10 sm:py-16 lg:py-[100px] bg-gradient-to-b from-[#FFFBFB] to-[#FFF1F2] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-5 sm:gap-8 lg:gap-12 items-center">
        
        {/* Left Info Column */}
        <div>
          <div className="inline-flex bg-rose-50 text-winners-red px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
            Kingdom Partnership
          </div>
          <h2 className="font-fraunces text-[24px] sm:text-[32px] lg:text-[42px] mt-3 mb-3 sm:mb-4 leading-[1.1]">
            Give, and it shall be given unto you
          </h2>
          <p className="text-slate-500 text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed">
            Your giving is a seed into your glorious destiny. Every gift advances the Liberation Mandate across Iseyinland and supports missions, welfare, and church projects.
          </p>

          <div className="mt-5 sm:mt-7 grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2.5 bg-white border border-rose-100 px-3 sm:px-4 py-3 rounded-xl">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-rose-50 grid place-items-center text-[14px] shrink-0">🔒</div>
              <div className="min-w-0">
                <strong className="block text-[12px] sm:text-[13px] text-slate-900 truncate">Secure & Private</strong>
                <span className="text-[10px] sm:text-[11px] text-slate-500">Verified Church Accounts</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white border border-rose-100 px-3 sm:px-4 py-3 rounded-xl">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] bg-amber-100 grid place-items-center text-[14px] shrink-0">🧾</div>
              <div className="min-w-0">
                <strong className="block text-[12px] sm:text-[13px] text-slate-900 truncate">Direct Transfer</strong>
                <span className="text-[10px] sm:text-[11px] text-slate-500">Mobile & USSD Banking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Ways To Give Card */}
        <div className="bg-white rounded-[20px] sm:rounded-[28px] p-4 sm:p-6 lg:p-8 border border-rose-100 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)] max-w-full overflow-hidden">
          <h3 className="font-fraunces text-[18px] sm:text-[22px] mb-4 sm:mb-5">Bank Accounts & Ways to Give</h3>

          {/* Account Lists */}
          <div className="space-y-3">
            {accounts.map((acc) => (
              <div key={acc.id} className="p-3 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-rose-200 transition-colors max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1.5 gap-1.5 sm:gap-2 min-w-0">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-rose-600 uppercase bg-rose-100/70 px-2 py-0.5 rounded-full w-fit">
                    {acc.tag}
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-semibold text-slate-500">
                    {acc.bank}
                  </span>
                </div>
                
                <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 mt-1 min-w-0">
                  <div className="min-w-0 max-w-full">
                    <strong className="block text-slate-900 text-[13px] sm:text-[14px] font-bold break-words">
                      {acc.title}
                    </strong>
                    <span className="text-[11px] sm:text-[12px] text-slate-500 block break-words">
                      {acc.accountName}
                    </span>
                  </div>

                  {/* Account Number & Copy Button */}
                  <div className="flex items-center justify-between gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm w-full xs:w-fit min-w-0 max-w-full shrink-0">
                    <span className="font-mono font-extrabold text-slate-900 text-[12.5px] sm:text-[15px] tracking-wide break-all min-w-0 flex-1">
                      {acc.accountNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(acc.accountNumber)}
                      className="text-[11px] font-bold text-winners-red hover:text-winners-red-dark px-2 py-0.5 bg-rose-50 rounded-lg transition-colors shrink-0"
                      title="Copy Account Number"
                    >
                      {copiedAccount === acc.accountNumber ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Online Payment Link
            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-3 py-3 px-2 border-t border-slate-100">
              <div className="min-w-0">
                <strong className="block text-slate-900 text-[13px] sm:text-[14px]">Online Card Payment</strong>
                <span className="text-[11px] sm:text-[12px] text-slate-500">Paystack / Flutterwave</span>
              </div>
              <a 
                href="#pay-online" 
                className="px-4 py-2 rounded-full bg-winners-red text-white font-bold text-[12px] text-center hover:bg-winners-red-dark transition w-full xs:w-auto shrink-0 shadow-sm"
              >
                Pay Online
              </a>
            </div> */}

            {/* In-Person Giving */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-2 px-2 border-t border-slate-100 min-w-0">
              <div className="min-w-0">
                <strong className="block text-slate-900 text-[13px] sm:text-[14px] break-words">In-Person Giving</strong>
                <span className="text-[11px] sm:text-[12px] text-slate-500 break-words">During Sunday & Midweek Services</span>
              </div>
              <span className="bg-rose-50 text-winners-red px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold shrink-0 w-fit">
                IN SERVICE
              </span>
            </div>
          </div>

          {/* Scripture Box */}
          <div className="mt-5 sm:mt-6 bg-slate-900 text-white rounded-xl sm:rounded-2xl p-4 flex gap-3 items-center max-w-full">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 grid place-items-center text-[16px] shrink-0">
              💡
            </div>
            <div className="min-w-0 text-[13px] sm:text-[14px] flex-1">
              <strong className="block break-words">Tithe & Offerings are worship</strong>
              <span className="text-slate-400 text-[11px] sm:text-[12px] block break-words">
                Malachi 3:10 — Bring ye all the tithes into the storehouse...
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}