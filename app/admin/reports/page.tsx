import { createServiceClient } from "@/lib/supabase/server";

type ReportRow = {
  id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
};

const demoReports: ReportRow[] = [
  { id: "1", reason: "Suspected scam", details: "Asked to move to WhatsApp within 2 messages", status: "open", created_at: "2026-08-28" },
  { id: "2", reason: "Inappropriate messages", details: "Sent unsolicited explicit content", status: "reviewing", created_at: "2026-08-27" },
  { id: "3", reason: "Fake profile", details: "Photos appear to be stock images", status: "open", created_at: "2026-08-25" },
];

async function getReports(): Promise<ReportRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return demoReports;
  const service = createServiceClient();
  const { data } = await service
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  return data ?? [];
}

const statusStyle: Record<string, string> = {
  open: "bg-garnet/10 text-garnet dark:bg-brass/10 dark:text-brass",
  reviewing: "bg-ink-line/30 text-text-muted dark:text-text-on-ink-muted",
  resolved: "bg-green-600/10 text-green-700 dark:text-green-400",
};

export default async function AdminReportsPage() {
  const reports = await getReports();

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Reports</h1>
      <p className="mt-1.5 text-sm text-text-muted dark:text-text-on-ink-muted">
        Filed by users, reviewed by a human before any action is taken.
      </p>

      <div className="mt-6 divide-y divide-ink-line/60 rounded-2xl border border-ink-line/60 bg-paper-raised dark:bg-ink-raised">
        {reports.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{r.reason}</p>
              {r.details && (
                <p className="mt-1 text-sm text-text-muted dark:text-text-on-ink-muted">
                  {r.details}
                </p>
              )}
              <p className="mt-2 text-xs text-text-muted dark:text-text-on-ink-muted">
                {r.created_at}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle[r.status] ?? ""}`}
            >
              {r.status}
            </span>
          </div>
        ))}
        {reports.length === 0 && (
          <p className="p-5 text-sm text-text-muted dark:text-text-on-ink-muted">
            No reports filed.
          </p>
        )}
      </div>
    </div>
  );
}
