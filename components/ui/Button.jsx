import Spinner from './Spinner';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseClasses =
    'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary-focus)] disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'text-white bg-[var(--primary-main)] shadow-[0_8px_24px_var(--primary-shadow)] hover:bg-[var(--primary-strong)] hover:shadow-[0_10px_30px_var(--primary-shadow)] active:bg-[var(--primary-deep)] disabled:bg-[var(--primary-muted)] disabled:text-white/70 disabled:shadow-none',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} flex items-center justify-center gap-2`}
    >
      {loading && <Spinner size={size === 'sm' ? 'sm' : 'md'} />}
      {children}
    </button>
  );
}
