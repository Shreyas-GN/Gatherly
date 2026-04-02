'use client';

import { useEffect, useRef, useState } from 'react';

export default function DrawLine() {
  const [drawn, setDrawn] = useState(false);
  const ref = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setDrawn(true);
      },
      { threshold: 0.2 }
    );
    if (wrapRef.current) observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  // Hand-drawn zigzag path
  const pathD = 'M 80 0 C 120 60, 40 120, 80 200 C 120 280, 40 340, 80 420';
  const pathLength = 460;

  return (
    <div ref={wrapRef} className="absolute left-1/2 top-0 -translate-x-1/2 h-full hidden lg:block pointer-events-none" style={{ width: 160 }}>
      <svg width="160" height="100%" viewBox="0 0 160 420" preserveAspectRatio="none" className="overflow-visible">
        <path
          ref={ref}
          d={pathD}
          fill="none"
          stroke="#C2491D"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`8 6`}
          style={{
            strokeDashoffset: drawn ? 0 : pathLength,
            transition: drawn ? 'stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </svg>
    </div>
  );
}
