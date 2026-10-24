import type { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'danger' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  danger: 'bg-rose-50 text-rose-700 border-rose-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function Badge({ children, variant = 'success', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${variants[variant]} ${className}`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  );
}
