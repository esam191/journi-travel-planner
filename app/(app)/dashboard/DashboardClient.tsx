"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { signOut } from "@/lib/actions/auth-actions";

export default function DashboardClient() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return <p className="text-center mt-8 text-white">Loading...</p>;
  if (!session?.user) return <p className="text-center mt-8 text-white">Redirecting...</p>;

  const { user } = session;

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <main className="max-w-md h-screen flex items-center justify-center flex-col mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user.name || "User"}!</p>
      <p>Email: {user.email}</p>
      <button
        onClick={handleSignOut}
        className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200">
        Sign out
      </button>
    </main>
  );
}