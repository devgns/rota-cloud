import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'border border-transparent bg-[var(--color-navy)] text-white hover:brightness-110 dark:text-[#121820]',
  ghost: 'border border-[var(--color-line)] bg-transparent hover:border-[var(--color-navy)] hover:bg-[var(--color-amber-soft)]',
  danger: 'border border-transparent bg-[var(--color-bad)] text-white hover:brightness-110',
} as const

export function buttonClass(variant: keyof typeof variants = 'primary', className = '') {
  return `inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 aria-pressed:border-[var(--color-navy)] aria-pressed:bg-[var(--color-navy)] aria-pressed:text-white aria-pressed:hover:brightness-110 dark:aria-pressed:text-[#121820] ${variants[variant]} ${className}`
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return <button className={buttonClass(variant, className)} {...props} />
}

export function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper-raised)] p-5 ${className}`}>
      {children}
    </section>
  )
}
