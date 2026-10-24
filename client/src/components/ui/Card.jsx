import { cn } from "@/lib/utils";

export function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={cn(
        "bg-white border border-rose-100 rounded-[16px] sm:rounded-[20px] p-5 sm:p-6",
        hover && "hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(15,23,42,0.12)] hover:border-rose-200 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function FeatureCard({ icon, title, description, variant = "rose", className = "" }) {
  const variants = {
    rose: "bg-rose-50 text-winners-red border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
  };

  return (
    <Card hover className={cn("bg-[#FFFBFB]", className)}>
      <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-[12px] sm:rounded-[14px] grid place-items-center mb-3 sm:mb-4 text-[18px] sm:text-xl border", variants[variant])}>
        {icon}
      </div>
      <h3 className="font-fraunces text-[16px] sm:text-[18px] text-slate-900 mb-1.5 group-hover:text-winners-red transition-colors">{title}</h3>
      <p className="text-[13px] sm:text-[14px] text-slate-500 leading-[1.6]">{description}</p>
    </Card>
  );
}
