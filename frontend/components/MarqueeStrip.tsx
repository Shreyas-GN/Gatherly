'use client';

const QUOTES = [
  { text: '"I used to mass-BCC 40 people every Tuesday. Never again."', author: '— Priya, Bangalore' },
  { text: '"Saved me from a Google Sheets nightmare."', author: '— Marcus, Portland' },
  { text: '"My volunteers actually show up now."', author: '— Aisha, Nairobi' },
  { text: '"Set it up in 10 minutes. Not exaggerating."', author: '— Tomás, São Paulo' },
  { text: '"Finally, someone solved the right problem."', author: '— Ji-woo, Seoul' },
  { text: '"The RSVP tracking alone is worth it."', author: '— Amara, Lagos' },
];

function QuoteItem({ text, author }: { text: string; author: string }) {
  return (
    <span className="inline-flex items-center gap-6 px-8 whitespace-nowrap">
      <span className="italic text-[#F5F0EB]/80 text-sm">{text}</span>
      <span className="text-[#8A837A] text-xs font-medium not-italic">{author}</span>
      <span className="text-[#BFFF00] opacity-50 text-lg select-none">·</span>
    </span>
  );
}

export default function MarqueeStrip() {
  return (
    <div className="overflow-hidden">
      <div className="flex animate-marquee">
        {/* Original set */}
        {QUOTES.map((q, i) => (
          <QuoteItem key={`a-${i}`} text={q.text} author={q.author} />
        ))}
        {/* Duplicate for seamless loop */}
        {QUOTES.map((q, i) => (
          <QuoteItem key={`b-${i}`} text={q.text} author={q.author} />
        ))}
      </div>
    </div>
  );
}
