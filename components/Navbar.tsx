"use client";

import { auth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import { Button } from "./ui/button";
import { Plane } from "lucide-react";

type Session = typeof auth.$Infer.Session;

export default function Navbar({ session }: { session: Session | null }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href={session ? "/dashboard" : "/"}
            className="flex items-center space-x-3"
          >
            <div className=" bg-white  flex items-center justify-center ">
              <Plane className="w-7 h-7 text-black" />
            </div>
            <span className="text-xl font-bold text-black">Journi</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Log In
                </Link>
                <Button asChild size="lg">
                  <Link href="/sign-up">Sign up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
