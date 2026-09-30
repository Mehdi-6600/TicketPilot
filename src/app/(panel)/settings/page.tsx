import EmptyState from "@/components/EmptyState";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-900">تنظیمات</h1>
      <EmptyState icon="⚙️" title="تنظیمات در نسخه بعدی" />
    </div>
  );
}
