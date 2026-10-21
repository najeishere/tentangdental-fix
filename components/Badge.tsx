// components/ui/Badge.tsx
import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'danger' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = 'success', className = '' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    // Hijau Emerald / Teal (misal: Completed, ON TRACK)
    success: 'bg-emerald-100 text-emerald-600 border-emerald-200',
    // Kuning / Amber (misal: Pending, Need review)
    warning: 'bg-amber-50 text-amber-600 border-amber-200',
    // Biru (misal: Proses)
    info: 'bg-blue-50 text-blue-600 border-blue-200',
    // Merah (misal: Batal, Belum Bayar)
    danger: 'bg-rose-50 text-rose-600 border-rose-200',
    // Abu-abu
    neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${variantStyles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {children}
    </span>
  );
}