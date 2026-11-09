"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const selector =
      ".reveal-up, .reveal-left, .reveal-right, .reveal-scale, .animated-heading";

    const elements = document.querySelectorAll<HTMLElement>(selector);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return null;
}