type Props = { message?: string | null };

export default function FormError({ message }: Props) {
  if (!message) return null;
  return (
    <div className="flex items-center space-x-2 space-x-reverse p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
      <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
      <p className="text-red-400 text-sm font-medium">{message}</p>
    </div>
  );
}


