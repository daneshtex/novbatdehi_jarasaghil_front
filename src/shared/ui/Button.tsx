import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  loading?: boolean;
};

export default function Button({
  children,
  className = '',
  fullWidth = true,
  loading = false,
  disabled,
  ...rest
}: ButtonProps) {
  const base = 'rounded-lg py-3 px-6 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-blue-600 disabled:opacity-60 font-medium transition-all duration-200 hover:bg-blue-700 disabled:hover:bg-blue-600';
  const width = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${base} ${width} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'لطفاً صبر کنید...' : children}
    </button>
  );
}


