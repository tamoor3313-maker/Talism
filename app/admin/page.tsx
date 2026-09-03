import { createServiceClient } from "@/lib/supabase/server";

async function getStats() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { users: 1284, matches: 3902, openReports: 3, activeSubs: 214 };
  }
  const service = createServiceClient();
  const [{ count: users }, { count: matches }, { count: openReports }, { count: activeSubs }] =
    await Promise.all([
      service.from("profiles").select("*", { count: "exact", head: true }),
      service.from("matches").select("*", { count: "exact", head: true }),
      service.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
      service
        .from("subscriptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "active"),
    ]);
  return { users: users ?? 0, matches: matches ?? 0, openReports: openReports ?? 0, activeSubs: activeSubs ?? 0 };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total users", value: stats.users },
    { label: "Matches generated", value: stats.matches },
    { label: "Open reports", value: stats.openReports },
    { label: "Active TALISM+ subs", value: stats.activeSubs },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Overview</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-ink-line/60 bg-paper-raised p-5 dark:bg-ink-raised"
          >
            <p className="font-display text-3xl">{c.value.toLocaleString()}</p>
            <p className="mt-1 text-xs text-text-muted dark:text-text-on-ink-muted">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
