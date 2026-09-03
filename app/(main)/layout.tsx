import { AppShellNav } from "@/components/app-shell-nav";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-text-strong dark:bg-ink dark:text-text-on-ink">
      <AppShellNav />
      <main className="pb-20 md:ml-60 md:pb-0">{children}</main>
    </div>
  );
}
