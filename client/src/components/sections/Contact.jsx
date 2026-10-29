/**
 * Contact Section - Living Faith Church Iseyin
 * Responsive, data-driven, reusable
 */
import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '@/lib/api';

export default function Contact({ data }) {
  const [status, setStatus] = useState({ show: false, text: '', color: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const payload = {
      name: fd.get('name')?.trim(),
      phone: fd.get('phone')?.trim(),
      email: fd.get('email')?.trim(),
      type: fd.get('type'),
      message: fd.get('message')?.trim(),
      date: new Date().toISOString(),
      church: 'LFC Iseyin'
    };

    if (!payload.name || !payload.phone || !payload.message) {
      setStatus({ show: true, text: 'Please fill name, phone and message', color: 'text-red-600' });
      return;
    }

    setStatus({ show: true, text: '⏳ Sending...', color: 'text-winners-red' });

    const existing = JSON.parse(localStorage.getItem('lfc_messages') || '[]');
    existing.push(payload);
    localStorage.setItem('lfc_messages', JSON.stringify(existing));

    const formspreeUrl = data?.formSettings?.formspreeUrl;
    const sheetUrl = data?.formSettings?.googleSheetUrl;
    const whatsapp = data?.formSettings?.whatsappNumber || '2348031234567';

    const promises = [
      apiRequest('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch((error) => {
        console.error('Contact API request failed:', error);
      }),
    ];

    if (formspreeUrl) {
      promises.push(fetch(formspreeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) }).catch(() => {}));
    }
    if (sheetUrl) {
      promises.push(fetch(sheetUrl, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).catch(() => {}));
    }

    await Promise.allSettled(promises);

    setStatus({ show: true, text: `✅ Message received! Our team will contact you within 24 hours. God bless you, ${payload.name}!`, color: 'text-emerald-600' });
    form.reset();

    setTimeout(() => {
      const shouldOpenWhatsApp = window.confirm ? false : false;
      toast(
        (t) => (
          <div className="flex flex-col gap-3 min-w-[280px]">
            <p className="text-sm font-medium text-slate-800">
              Thank you {payload.name}! Your message is saved.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.dismiss(t.id);
                  const waText = `Hello LFC Iseyin,%0A%0AName: ${encodeURIComponent(payload.name)}%0APhone: ${encodeURIComponent(payload.phone)}%0AEmail: ${encodeURIComponent(payload.email)}%0AType: ${encodeURIComponent(payload.type)}%0A%0AMessage:%0A${encodeURIComponent(payload.message)}`;
                  window.open(`https://wa.me/${whatsapp}?text=${waText}`, '_blank');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm"
              >
                WhatsApp
              </button>
            </div>
          </div>
        ),
        { duration: Infinity, id: `contact-toast-${payload.phone}` }
      );
    }, 800);
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-[100px] bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12">
        <div>
          
          <div className="max-w-[720px] mx-auto text-center mb-8 sm:mb-12 lg:mb-14">
            <div className="inline-flex bg-rose-50 text-winners-red px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">Get in Touch</div>
            <h2 className="font-fraunces text-[24px] sm:text-[32px] lg:text-[42px] mt-3 mb-3 sm:mb-4 leading-[1.1]">We'd love to hear from you</h2>
            <p className="text-slate-500 text-[14px] sm:text-[15px] leading-relaxed">New in Iseyin? Need prayer? Want to serve? Fill the form or visit us. We respond within 24 hours.</p>
         </div>

          <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
            <div className="flex gap-3 items-center bg-[#FFFBFB] border border-rose-100 p-3 sm:p-4 rounded-xl sm:rounded-[14px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-rose-100 grid place-items-center text-[18px] shrink-0">🙏</div>
              <div className="min-w-0"><strong className="block text-slate-900 text-[13px] sm:text-[14px]">Prayer Requests</strong><span className="text-[11px] sm:text-[13px] text-slate-500">Confidential • Pastoral team prays daily 6AM</span></div>
            </div>
            <div className="flex gap-3 items-center bg-[#FFFBFB] border border-rose-100 p-3 sm:p-4 rounded-xl sm:rounded-[14px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-rose-100 grid place-items-center text-[18px] shrink-0">🤝</div>
              <div className="min-w-0"><strong className="block text-slate-900 text-[13px] sm:text-[14px]">First Time Visitor</strong><span className="text-[11px] sm:text-[13px] text-slate-500">We have a gift for you at Guest Services</span></div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#FFFBFB] border border-rose-100 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 lg:p-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block font-semibold text-[12px] sm:text-[13px] mb-1.5 sm:mb-2 text-slate-900">Full Name *</label><input name="name" required placeholder="Your name" className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:border-winners-red focus:ring-4 focus:ring-rose-50 text-[14px] transition" /></div>
            <div><label className="block font-semibold text-[12px] sm:text-[13px] mb-1.5 sm:mb-2 text-slate-900">Phone / WhatsApp *</label><input name="phone" required placeholder="080..." className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:border-winners-red focus:ring-4 focus:ring-rose-50 text-[14px] transition" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div><label className="block font-semibold text-[12px] sm:text-[13px] mb-1.5 sm:mb-2 text-slate-900">Email</label><input name="email" type="email" placeholder="you@example.com" className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:border-winners-red focus:ring-4 focus:ring-rose-50 text-[14px] transition" /></div>
            <div>
              <label className="block font-semibold text-[12px] sm:text-[13px] mb-1.5 sm:mb-2 text-slate-900">I am...</label>
              <select name="type" className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:border-winners-red focus:ring-4 focus:ring-rose-50 text-[14px] transition">
                <option>First Time Visitor</option><option>Member</option><option>Need Prayer</option><option>Want to Join Workforce</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-semibold text-[12px] sm:text-[13px] mb-1.5 sm:mb-2 text-slate-900">Message / Prayer Request *</label>
            <textarea name="message" required placeholder="How can we help you? Share your testimony or request..." className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl border border-rose-100 bg-white focus:outline-none focus:border-winners-red focus:ring-4 focus:ring-rose-50 text-[14px] min-h-[110px] sm:min-h-[120px] resize-y transition"></textarea>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-3 items-stretch sm:items-center">
            <button type="submit" className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-winners-red text-white font-bold text-[14px] hover:bg-winners-red-dark transition shadow-[0_8px_20px_-8px_#C41E3A]">Send Message →</button>
            <span className="text-[11px] sm:text-[13px] text-slate-500 text-center sm:text-left">We respect your privacy. No spam.</span>
          </div>

          {status.show && <div className={`mt-4 p-3 rounded-xl text-[13px] sm:text-[14px] font-medium ${status.color} bg-white border ${status.color.includes('emerald') ? 'border-emerald-100 bg-emerald-50' : status.color.includes('red') ? 'border-red-100 bg-red-50' : 'border-rose-100 bg-rose-50'}`}>{status.text}</div>}
        </form>
      </div>
    </section>
  );
}
