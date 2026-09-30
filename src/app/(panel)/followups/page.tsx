import EmptyState from "@/components/EmptyState";

export default function FollowUpsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">پیگیری‌ها</h1>
      <EmptyState
        icon="🔔"
        title="پیگیری‌ها در PHASE 7 ساخته می‌شود"
      />
    </div>
  );
}
