import Link from "next/link";

export function Sello({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="22" cy="22" r="15.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <text x="22" y="20.2" textAnchor="middle" fontSize="6.5" fontFamily="var(--font-mono), monospace" fill="currentColor" letterSpacing="1">
        LEY
      </text>
      <text x="22" y="28.6" textAnchor="middle" fontSize="6.5" fontFamily="var(--font-mono), monospace" fill="currentColor">
        19.496
      </text>
    </svg>
  );
}

export function Logo({ href = "/", light = false }: { href?: string; light?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 ${light ? "text-white" : "text-ink"}`}>
      <Sello className={`h-10 w-10 ${light ? "text-[#FF7A8A]" : "text-sello"}`} />
      <span className="font-display text-[22px] font-semibold leading-none tracking-tight">
        Reclamo <span className="italic font-medium">Express</span>
      </span>
    </Link>
  );
}
