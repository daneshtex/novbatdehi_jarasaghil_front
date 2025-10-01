import React from 'react';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  dirLtr?: boolean;
};

export default function TextInput({ label, className = '', dirLtr = false, ...rest }: TextInputProps) {
  return (
    <div>
      {label && <label className="block mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <input
        dir={dirLtr ? 'ltr' : undefined}
        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${className}`.trim()}
        {...rest}
      />
    </div>
  );
}


