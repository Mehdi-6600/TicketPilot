import EmptyState from "@/components/EmptyState";

export default function BookingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">رزروها</h1>
      <EmptyState icon="🎫" title="رزروها در PHASE 9 ساخته می‌شود" />
    </div>
  );
}
