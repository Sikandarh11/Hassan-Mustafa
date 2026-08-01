import { useEffect, useRef, useState } from "react";

export function useCountUp(target: string, duration = 1500) {
  const [value, setValue] = useState("0");
  const ref = useRef<HTMLDivElement>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true;
          const numMatch = target.match(/^(\d+)/);
          if (!numMatch) {
            setValue(target);
            return;
          }
          const end = parseInt(numMatch[1], 10);
          const suffix = target.slice(numMatch[1].length);
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * end);
            setValue(current + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}
