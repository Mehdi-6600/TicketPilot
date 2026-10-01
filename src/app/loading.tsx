export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
        <div className="text-sm text-slate-500">در حال بارگذاری...</div>
      </div>
    </div>
  );
}
