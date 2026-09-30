import EmptyState from "@/components/EmptyState";

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">گزارش روز</h1>
      <EmptyState icon="📝" title="این بخش در PHASE 10 ساخته می‌شود" />
    </div>
  );
}
