import { useEffect } from "react";

export default function SiteMotion() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("main.page > *"));
    if (!targets.length) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    targets.forEach((element, index) => {
      element.classList.add("premium-reveal");
      element.style.setProperty("--premium-delay", `${Math.min(index * 70, 280)}ms`);
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("premium-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("premium-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -7% 0px" }
    );

    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return null;
}
