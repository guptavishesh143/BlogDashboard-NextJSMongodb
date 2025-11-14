// app/dashboard/page.tsx
import { getCurrentSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from 'next/headers';

export default async function Dashboard() {

  const session = await getCurrentSession();
  console.log("Dashboard /page.tsx /// session", session);

  // If no user is logged in, redirect to logixn page
  // if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {session?.user?.name || session?.user?.email} 👋
        </h1>
        <p className="text-gray-600 mb-6">
          Logged in via{" "}
          <span className="font-semibold text-blue-600">
            {session?.type?.toUpperCase()}
          </span>
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/posts"
            className="block w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            📝 Go to Posts
          </Link>

          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded hover:bg-red-600 transition"
            >
              🚪 Logout
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
