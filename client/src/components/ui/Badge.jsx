import { cn } from "@/lib/utils";

const variants = {
  default: "bg-rose-50 text-winners-red border-rose-100",
  dark: "bg-white/10 text-rose-200 border-white/10",
  gold: "bg-amber-50 text-amber-800 border-amber-100",
  success: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function Badge({ children, variant = "default", className = "", withDot = false, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-[0.08em] uppercase border shadow-sm",
        variants[variant],
        className
      )}
      {...props}
    >
      {withDot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}
