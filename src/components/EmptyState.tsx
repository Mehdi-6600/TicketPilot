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
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-8 text-center">
      <div className="mb-3 text-4xl">{icon}</div>
      <div className="mb-1 font-medium text-slate-700">{title}</div>
      {description && (
        <div className="text-sm text-slate-500">{description}</div>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
