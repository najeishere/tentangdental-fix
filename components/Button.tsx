// components/ui/Button.tsx
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base style
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed';

  // Sizing
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-11 px-4 text-xs',
    lg: 'h-12 px-6 text-sm',
  };

  // Variants warna sesuai UI Prototype
  const variantStyles: Record<ButtonVariant, string> = {
    // Gradient Teal Khas TentangDental
    primary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-md shadow-teal-500/20 active:scale-[0.98]',
    // Secondary abu-abu terang
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    // Outline border
    outline: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-700',
    // Ghost tanpa background
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
    // Danger merah
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Memuat...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}