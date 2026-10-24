import Badge from "./Badge";
import { cn } from "@/lib/utils";

/**
 * Section wrapper with consistent padding
 */
export function Section({ children, className = "", id, variant = "default", ...props }) {
  const variants = {
    default: "bg-[#FFFBFB]",
    white: "bg-white",
    dark: "bg-slate-900 text-white",
    muted: "bg-slate-50",
    gradient: "bg-gradient-to-b from-[#FFFBFB] to-[#FFF1F2]",
  };

  return (
    <section id={id} className={cn("py-12 sm:py-16 lg:py-[100px] overflow-hidden", variants[variant], className)} {...props}>
      {children}
    </section>
  );
}

export function SectionHeader({ badge, title, description, centered = false, className = "" }) {
  return (
    <div className={cn(centered ? "max-w-[720px] mx-auto text-center mb-8 sm:mb-12 lg:mb-14" : "flex flex-col lg:flex-row lg:justify-between lg:items-end gap-3 sm:gap-4 mb-6 sm:mb-8", className)}>
      <div className={centered ? "" : "flex-1"}>
        {badge && <Badge className="mb-3">{badge}</Badge>}
        <h2 className="font-fraunces text-[24px] sm:text-[32px] lg:text-[42px] leading-[1.1] tracking-tight text-slate-900 dark:text-white">{title}</h2>
      </div>
      {description && <p className={cn("text-slate-500 text-[14px] sm:text-[16px] lg:text-[17px] leading-relaxed", centered ? "mt-3 sm:mt-4" : "max-w-[460px]")}>{description}</p>}
    </div>
  );
}
