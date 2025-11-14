
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getCurrentSession();
  if (!session) redirect("/auth/login");

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome {session.user?.email}</h1>
      <p>You're logged in via {session.type.toUpperCase()}</p>
    </div>
  );
}
