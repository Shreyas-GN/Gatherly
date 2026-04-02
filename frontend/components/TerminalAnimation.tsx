'use client';

import { useEffect, useRef, useState } from 'react';

const LINES = [
  { text: '$ gatherly create-event --name "Park Cleanup" --skills landscaping,driving', delay: 0, type: 'cmd' },
  { text: '→ Scanning 847 registered volunteers...', delay: 600, type: 'info' },
  { text: '→ Found 23 matches for [landscaping]', delay: 1100, type: 'info' },
  { text: '→ Found 11 matches for [driving]', delay: 1500, type: 'info' },
  { text: '→ Cross-referencing availability...', delay: 1900, type: 'info' },
  { text: '→ 14 volunteers queued for invitation', delay: 2500, type: 'info' },
  { text: '→ Dispatching emails via n8n webhook...', delay: 3000, type: 'info' },
  { text: '→ ✓ 14/14 invitations sent in 2.3s', delay: 3900, type: 'success' },
  { text: '→ Event EVT_20260402_A3F8B1 is live.', delay: 4400, type: 'success' },
  { text: '→ Dashboard updated. Waiting for RSVPs...', delay: 4900, type: 'muted' },
];

export default function TerminalAnimation() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, i + 1));
      }, line.delay);
    });
  }, [hasStarted]);

  const getColor = (type: string) => {
    if (type === 'cmd') return 'text-[#BFFF00]';
    if (type === 'success') return 'text-emerald-400';
    if (type === 'muted') return 'text-[#8A837A]';
    return 'text-[#F5F0EB]/80';
  };

  return (
    <div ref={ref} className="font-mono text-sm leading-relaxed">
      {LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={`${getColor(line.type)} animate-fadeInLine`}
          style={{ animationDelay: '0ms' }}
        >
          {line.text}
        </div>
      ))}
      {visibleLines > 0 && visibleLines < LINES.length + 1 && (
        <span className="inline-block w-2 h-4 bg-[#BFFF00] ml-0.5 animate-blink align-middle" />
      )}
      {visibleLines >= LINES.length && (
        <span className="inline-block w-2 h-4 bg-[#BFFF00] ml-0.5 animate-blink align-middle" />
      )}
    </div>
  );
}
