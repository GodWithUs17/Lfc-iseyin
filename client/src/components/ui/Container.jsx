import { cn } from "@/lib/utils";

/**
 * Container - max-width wrapper with responsive padding
 */
export default function Container({ children, className = "", size = "default", ...props }) {
  const sizes = {
    default: "max-w-[1280px]",
    narrow: "max-w-[720px]",
    wide: "max-w-[1440px]",
    full: "max-w-full",
  };

  return (
    <div className={cn("mx-auto px-4 sm:px-6", sizes[size], className)} {...props}>
      {children}
    </div>
  );
}
