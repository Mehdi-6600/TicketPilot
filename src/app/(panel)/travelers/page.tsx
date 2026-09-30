import EmptyState from "@/components/EmptyState";

export default function TravelersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">مسافران در سفر</h1>
      <EmptyState icon="✈️" title="این بخش در PHASE 8 ساخته می‌شود" />
    </div>
  );
}
