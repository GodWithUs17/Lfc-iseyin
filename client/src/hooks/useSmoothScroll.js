/**
 * useSmoothScroll - Smooth scrolling with header offset
 * Prevents jumping, accounts for sticky header
 */

import { useCallback, useEffect } from "react";

export function useSmoothScroll(offset = 80) {
  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id.replace("#", ""));
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    
    window.scrollTo({
      top,
      behavior: "smooth",
    });
  }, [offset]);

  const handleAnchorClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const id = href.slice(1);
    if (!id) return;

    e.preventDefault();
    scrollToId(id);
    
    // Update URL without jumping
    history.pushState(null, "", href);
  }, [scrollToId]);

  return { scrollToId, handleAnchorClick };
}

/**
 * Hook to enable smooth scroll for all anchor links automatically
 */
export function useGlobalSmoothScroll(offset = 80) {
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      
      const href = anchor.getAttribute("href");
      if (!href || href === "#" || href.startsWith("#admin")) return;
      
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      history.pushState(null, "", href);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [offset]);
}
