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
      'text-[var(--primary-contrast)] bg-[var(--primary-main)] border border-[var(--primary-border)] shadow-none hover:bg-[var(--primary-strong)] active:bg-[var(--primary-deep)] active:text-white disabled:bg-[var(--primary-muted)] disabled:text-[color:rgba(74,44,26,0.55)]',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
    danger:
      'text-[var(--tone-danger-text)] bg-[var(--tone-danger-bg)] border border-[var(--tone-danger-border)] hover:bg-[color-mix(in srgb,var(--tone-danger-bg),var(--tone-danger-border) 35%)]',
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
