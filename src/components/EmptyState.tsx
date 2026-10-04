type Props = {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-white/60 bg-surface-soft p-8 text-center shadow-plush-inset">
      <div className="mb-3 text-4xl">{icon}</div>
      <div className="mb-1 font-semibold text-ink-soft">{title}</div>
      {description && (
        <div className="text-sm text-ink-muted">{description}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
