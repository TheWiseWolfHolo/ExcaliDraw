import { useEffect } from 'react';

export default function Notification({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  autoClose = true,
  duration = 3000
}) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const toneTokens = {
    success: {
      bg: 'var(--tone-success-bg)',
      border: 'var(--tone-success-border)',
      text: 'var(--tone-success-text)',
      icon: '✓',
    },
    error: {
      bg: 'var(--tone-danger-bg)',
      border: 'var(--tone-danger-border)',
      text: 'var(--tone-danger-text)',
      icon: '✕',
    },
    warning: {
      bg: 'var(--tone-info-bg)',
      border: 'var(--tone-info-border)',
      text: 'var(--tone-info-text)',
      icon: '⚠',
    },
    info: {
      bg: 'var(--tone-neutral-bg)',
      border: 'var(--tone-neutral-border)',
      text: 'var(--tone-neutral-text)',
      icon: 'ℹ',
    },
  };

  const palette = toneTokens[type] || toneTokens.info;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25"
        onClick={onClose}
      />

      {/* Notification Content */}
      <div className="relative max-w-xs w-full min-w-0">
        <div
          className="border rounded-lg shadow-lg p-4"
          style={{
            background: palette.bg,
            borderColor: palette.border,
            color: palette.text,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <span className="text-xl flex-shrink-0" style={{ color: palette.text }}>
                {palette.icon}
              </span>
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="font-semibold text-xs break-words" style={{ color: palette.text }}>
                    {title}
                  </h3>
                )}
                {message && (
                  <p className="text-xs mt-1 whitespace-pre-wrap break-words" style={{ color: palette.text }}>
                    {message}
                  </p>
                )}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="ml-4 transition-colors"
              style={{ color: palette.text }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}