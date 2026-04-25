import AdminDashboard from "@/components/admin/Dashboard";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const legacySession = cookieStore.get("bcas_admin_legacy")?.value === "1";
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    session = null;
  }

  if (!session && !legacySession) {
    redirect("/admin");
  }

  return <AdminDashboard />;
}
