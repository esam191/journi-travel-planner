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

  const isAppPage =
    pathname === "/dashboard" || pathname.startsWith("/trips");

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={session && isAppPage ? "/dashboard" : "/"}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Journi</span>
        </Link>

        <nav className="flex items-center gap-3">
          {session ? (
            <>
              {isAppPage ? (
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
                <Link href="/sign-up">Try for free</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
