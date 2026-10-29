// src/components/admin/AdminLogin.jsx
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import WinnersLogo from "@/components/brand/WINNER.webp";

// Inline SVG Icons
function EyeIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.018 10.018 0 014.122-.963c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21f-9-9m-6-6l-3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
  );
}

function SpinnerIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function AlertTriangleIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}

export default function AdminLogin({
  email,
  setEmail,
  pass,
  setPass,
  err,
  errMessage,
  isLoading = false,
  onLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeLoading = isLoading || isSubmitting;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeLoading) return;

    if (!email || !pass) {
      toast.error("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (typeof onLogin === "function") {
        await onLogin();
        toast.success("Login successful! Welcome back.");
      }
    } catch (error) {
      toast.error(error?.message || errMessage || "Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[radial-gradient(800px_at_50%_-10%,#FFE4E6,#F8FAFC)] p-4 sm:p-6">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] p-6 sm:p-9 border border-rose-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <img
          src={WinnersLogo}
          alt="Winners Chapel Logo"
          className="w-10 h-10 sm:w-[44px] sm:h-[44px] object-contain mb-3"
        />
        <h1 className="font-fraunces text-[24px] sm:text-[28px]">LFC Iseyin Admin</h1>
        <p className="text-slate-500 text-[13px] sm:text-[14px] my-2 mb-5 leading-relaxed">
          Authorized personnel only. Enter your admin credentials to access the management dashboard.
        </p>

        {/* Dynamic UI Error Banner */}
        {err && !activeLoading && (
          <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-800 text-[13px] animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertTriangleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-snug">
              {errMessage || "Invalid email or password. Please try again."}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-[12px] sm:text-[13px] mb-2 text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lfciseyin.org"
              required
              disabled={activeLoading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 text-[14px] disabled:bg-slate-50 disabled:text-slate-400 transition-all"
            />
          </div>

          <div>
            <label className="block font-semibold text-[12px] sm:text-[13px] mb-2 text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter password"
                required
                disabled={activeLoading}
                className="w-full pl-4 pr-11 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 text-[14px] disabled:bg-slate-50 disabled:text-slate-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={activeLoading}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={activeLoading}
            className="w-full mt-2 py-3 flex items-center justify-center gap-2 font-medium text-[14px] disabled:opacity-75 disabled:cursor-not-allowed transition-all"
          >
            {activeLoading ? (
              <>
                <SpinnerIcon className="w-4 h-4 text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Unlock Dashboard →</span>
            )}
          </Button>
        </form>

        <a
          href="/"
          className="block text-center mt-6 text-[13px] text-slate-500 hover:text-slate-900 transition-colors"
        >
          ← Back to Website
        </a>
      </div>
    </div>
  );
}