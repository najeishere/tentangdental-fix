import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-teal-500 text-white shadow-md shadow-teal-500/20 hover:bg-teal-600',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  outline: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  danger: 'bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-11 px-4 text-xs',
  lg: 'h-12 px-6 text-sm',
};

export default function Button({ variant = 'primary', size = 'md', isLoading = false, children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {isLoading ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Memuat...</span> : children}
    </button>
  );
}
