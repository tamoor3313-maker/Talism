import { createServiceClient } from "@/lib/supabase/server";

type UserRow = {
  id: string;
  name: string;
  location: string | null;
  verified: boolean;
  created_at: string;
};

const demoUsers: UserRow[] = [
  { id: "1", name: "Maya L.", location: "Oakland, CA", verified: true, created_at: "2026-06-02" },
  { id: "2", name: "Priya K.", location: "San Francisco, CA", verified: true, created_at: "2026-06-10" },
  { id: "3", name: "Elena R.", location: "Berkeley, CA", verified: false, created_at: "2026-07-01" },
  { id: "4", name: "Jordan T.", location: "San Francisco, CA", verified: true, created_at: "2026-05-14" },
];

async function getUsers(): Promise<UserRow[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return demoUsers;
  const service = createServiceClient();
  const { data } = await service
    .from("profiles")
    .select("id, name, location, verified, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return data ?? [];
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="font-display text-3xl tracking-tight">Users</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink-line/60 bg-paper-raised dark:bg-ink-raised">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-line/60 text-xs text-text-muted dark:text-text-on-ink-muted">
            <tr>
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Location</th>
              <th className="px-5 py-3 font-normal">Verified</th>
              <th className="px-5 py-3 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-line/60">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium">{u.name}</td>
                <td className="px-5 py-3 text-text-muted dark:text-text-on-ink-muted">
                  {u.location}
                </td>
                <td className="px-5 py-3">
                  {u.verified ? (
                    <span className="rounded-full bg-green-600/10 px-2.5 py-1 text-xs text-green-700 dark:text-green-400">
                      Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink-line/30 px-2.5 py-1 text-xs text-text-muted dark:text-text-on-ink-muted">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-text-muted dark:text-text-on-ink-muted">
                  {u.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
