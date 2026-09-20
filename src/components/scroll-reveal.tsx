"use client";

import { useEffect } from "react";

export function ScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      'main [class*="bg-card"], main [class*="bg-paper"]'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    targets.forEach((el) => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}