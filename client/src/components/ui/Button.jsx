import { cn } from "@/lib/utils";

/**
 * Reusable Button - Winners Chapel design system
 * Variants: primary, outline, dark, ghost
 * Sizes: sm, md, lg
 */

const variants = {
  primary: "bg-winners-red text-white hover:bg-winners-red-dark shadow-[0_8px_20px_-8px_#C41E3A] hover:-translate-y-0.5",
  outline: "bg-white border border-slate-200 text-slate-900 hover:border-slate-900 hover:bg-slate-50",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
  ghost: "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50",
  gold: "bg-winners-dark text-white hover:bg-slate-800",
};

const sizes = {
  sm: "px-4 py-2 text-[12px]",
  md: "px-5 py-2.5 text-[13px]",
  lg: "px-7 py-3.5 text-[14px]",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  as: Component = "button",
  ...props
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
