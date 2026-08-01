import { useRef, useCallback } from "react";

export function useTilt(maxDeg = 10) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg)`;
    },
    [maxDeg]
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
