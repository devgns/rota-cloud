// Mesmo desenho do ícone "route" do lucide, com um brilho que percorre o traço de vez em quando.
const ROUTE = 'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15'

export function BrandLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={`brand-logo ${className}`} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g stroke="currentColor">
        <circle cx="6" cy="19" r="3" />
        <path d={ROUTE} />
        <circle cx="18" cy="5" r="3" />
      </g>
      <path className="brand-neon" d={ROUTE} pathLength={100} />
    </svg>
  )
}
