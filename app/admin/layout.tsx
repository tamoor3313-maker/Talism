import Link from "next/link";
import { ThreadMark } from "@/components/thread-mark";
import { requireAdmin } from "@/lib/require-admin";
import { LayoutDashboard, Users, Flag, CreditCard, GraduationCap } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/coach-applications", label: "Coach applications", icon: GraduationCap },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-paper text-text-strong dark:bg-ink dark:text-text-on-ink">
      <div className="flex">
        <aside className="hidden w-56 shrink-0 border-r border-ink-line/60 p-5 md:block">
          <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-1">
            <ThreadMark className="h-5 w-5 text-garnet dark:text-brass" />
            <span className="font-display text-base">TALISM Admin</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-paper-raised hover:text-text-strong dark:text-text-on-ink-muted dark:hover:bg-ink-raised dark:hover:text-text-on-ink"
                >
                  <Icon size={17} />
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 px-6 py-8 md:px-10">{children}</main>
      </div>
    </div>
  );
}
