import { createServiceClient } from "@/lib/supabase/server";
import { CoachApplicationRow } from "@/components/admin/coach-application-row";

type ApplicationRow = {
  user_id: string;
  headline: string | null;
  bio: string | null;
  status: string;
  applied_at: string;
  profiles: { name: string } | null;
};

const demoApplications: ApplicationRow[] = [
  {
    user_id: "demo-1",
    headline: "Confidence coach, 5 years",
    bio: "Former social anxiety therapist turned dating coach.",
    status: "pending",
    applied_at: "2026-09-01",
    profiles: { name: "Alex Rivera" },
  },
];

async function getApplications(): Promise<ApplicationRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return demoApplications;
  const service = createServiceClient();
  const { data } = await service
    .from("coaches")
    .select("user_id, headline, bio, status, applied_at, profiles(name)")
    .order("applied_at", { ascending: false });
  return data ?? [];
}

export default async function AdminCoachApplicationsPage() {
  const applications = await getApplications();

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Coach applications</h1>
      <div className="mt-6 space-y-3">
        {applications.map((a) => (
          <CoachApplicationRow key={a.user_id} application={a} />
        ))}
        {applications.length === 0 && (
          <p className="text-sm text-text-muted dark:text-text-on-ink-muted">
            No applications yet.
          </p>
        )}
      </div>
    </div>
  );
}
