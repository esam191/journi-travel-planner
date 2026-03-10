"use client";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <p className="text-center mt-8 text-white">Loading...</p>;
  if (!session?.user) return <p className="text-center mt-8 text-white">Redirecting...</p>;

  const { user } = session;

  return (
    <main className="flex items-center justify-center h-screen bg-neutral-950 text-white">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome, {user.name || "User"}!</p>
        <p>Email: {user.email}</p>
      </div>
    </main>
  );
}