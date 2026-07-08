"use client";

import { useEffect, useLayoutEffect, useRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Reset scroll to top instantly on route change (before paint to avoid flicker).
  // Skip if navigating to a hash fragment — let Lenis handle the smooth hash scroll.
  useLayoutEffect(() => {
    if (window.location.hash) return;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.stop();
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
