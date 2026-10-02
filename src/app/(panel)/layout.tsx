import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";
import BottomNav from "@/components/BottomNav";
import GlobalSearch from "@/components/GlobalSearch";
import Avatar from "@/components/Avatar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-surface-base/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar name={session.username} size="sm" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] text-ink-muted">خوش آمدی</span>
              <span className="text-sm font-bold text-ink">
                {session.username}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <GlobalSearch />
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-5 pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
