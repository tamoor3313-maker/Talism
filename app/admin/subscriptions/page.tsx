import { createServiceClient } from "@/lib/supabase/server";

type SubRow = {
  user_id: string;
  name: string;
  status: string;
  current_period_end: string;
};

const demoSubs: SubRow[] = [
  { user_id: "1", name: "Maya L.", status: "active", current_period_end: "2026-09-28" },
  { user_id: "2", name: "Priya K.", status: "active", current_period_end: "2026-09-15" },
  { user_id: "3", name: "Elena R.", status: "canceled", current_period_end: "2026-08-30" },
];

async function getSubs(): Promise<SubRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return demoSubs;
  const service = createServiceClient();
  const { data: subs } = await service
    .from("subscriptions")
    .select("user_id, status, current_period_end")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (!subs?.length) return [];
  const { data: profiles } = await service
    .from("profiles")
    .select("id, name")
    .in("id", subs.map((s: { user_id: string }) => s.user_id));
  return subs.map((s: { user_id: string; status: string; current_period_end: string }) => ({
    ...s,
    name: profiles?.find((p: { id: string; name: string }) => p.id === s.user_id)?.name ?? "Unknown",
  }));
}

const statusStyle: Record<string, string> = {
  active: "bg-green-600/10 text-green-700 dark:text-green-400",
  trialing: "bg-ink-line/30 text-text-muted dark:text-text-on-ink-muted",
  past_due: "bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass",
  canceled: "bg-ink-line/30 text-text-muted dark:text-text-on-ink-muted",
};

export default async function AdminSubscriptionsPage() {
  const subs = await getSubs();

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Subscriptions</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-line/60 bg-paper-raised dark:bg-ink-raised">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-line/60 text-xs text-text-muted dark:text-text-on-ink-muted">
            <tr>
              <th className="px-5 py-3 font-normal">User</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Renews / ended</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line/60">
            {subs.map((s) => (
              <tr key={s.user_id}>
                <td className="px-5 py-3 font-medium">{s.name}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${statusStyle[s.status] ?? ""}`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-text-muted dark:text-text-on-ink-muted">
                  {s.current_period_end}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && (
          <p className="p-5 text-sm text-text-muted dark:text-text-on-ink-muted">
            No subscriptions yet.
          </p>
        )}
      </div>
    </div>
  );
}
