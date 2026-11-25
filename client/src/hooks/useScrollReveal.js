import { useEffect } from "react";

export default function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");

    if (!elements.length) return;

    // If IntersectionObserver is unsupported, keep everything visible.
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-revealed");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((element) => {
      element.classList.add("reveal-pending");
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);
}
