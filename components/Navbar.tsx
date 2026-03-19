"use client";

import { auth } from "@/lib/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth-actions";
import { Button } from "./ui/button";
import { Plane, Plus } from "lucide-react";

type Session = typeof auth.$Infer.Session;

export default function Navbar({ session }: { session: Session | null }) {
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardPage = pathname === "/dashboard";
  const isAppPage = pathname === "/dashboard" || pathname.startsWith("/trips");

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="app-frame">
        <div className="surface-panel flex min-h-18 items-center justify-between gap-4 px-4 py-3 sm:px-5">
          <Link
            href={session && isAppPage ? "/dashboard" : "/"}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/25 bg-primary/12 text-primary shadow-[0_12px_30px_-20px_rgba(36,84,96,0.55)]">
              <Plane className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <span className="font-display text-2xl leading-none tracking-[-0.04em]">
                Journi
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2">
            {session ? (
              <>
                {isDashboardPage ? (
                  <Button asChild>
                    <Link href="/trips/add" className="inline-flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Trip
                    </Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link href="/dashboard">Go to trips</Link>
                  </Button>
                )}

                <Button variant="ghost" onClick={handleSignOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Log In</Link>
                </Button>

                <Button asChild>
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
