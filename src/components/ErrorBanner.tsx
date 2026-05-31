interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner(props: ErrorBannerProps) {
  const { message, onDismiss } = props;
  return (
    <div className="animate-fade-in-up flex items-center justify-between gap-4 py-4 border-y border-wx mb-0">
      <div className="flex items-center gap-2.5">
        <span className="text-sm">⚠</span>
        <span className="text-sm font-medium font-body text-wx-base">{message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-wx-muted hover:text-wx-base cursor-pointer font-mono text-base leading-none transition-colors duration-150 shrink-0"
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
}
