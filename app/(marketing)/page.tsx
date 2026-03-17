"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { signOut } from "@/lib/actions/auth-actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, MapPin, FileText } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
      {/* left side */}
      <div className="flex flex-col space-y-8 w-full max-w-lg">
        <h1 className="text-7xl lg:text-6xl font-bold">
          Plan your dream <br /> trip with ease
        </h1>
        <p className="text-xl text-slate-600 max-w-md">
          Organize itineraries, manage travel documents, and discover amazing
          destinations. It&apos;s the simplest way to plan your next trip.
        </p>
        <div className="flex gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="bg-black px-8 h-12 rounded-lg text-md"
          >
            <Link href="/sign-up">
              Get started for free <ArrowRight />
            </Link>
          </Button>
          {session ? (
            <Button
              variant="outline"
              size="lg"
              className="px-8 h-12 rounded-lg text-md"
              onClick={() => {
                void handleSignOut();
              }}
            >
              Log out
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 h-12 rounded-lg text-md"
            >
              <Link href="/sign-in">Log in</Link>
            </Button>
          )}
        </div>
      </div>
      {/* right side */}
      <div className="w-full max-w-md border border-slate-200 rounded-xl shadow-sm">
        <div className="bg-black p-6 text-white">
          <div className="flex justify-between">
            <h3 className="text-2xl font-bold">Summer Europe</h3>
          </div>
          <p className="text-slate-400 text-s">Paris • Rome • Barcelona</p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-6 p-4">
            <Calendar className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-s font-bold text-slate-900">
                Arrival in Paris
              </p>
              <p className="text-xs text-slate-500">
                Check-in at Hotel Lumière • 2:00 PM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4">
            <MapPin className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-s font-bold text-slate-900">
                Louvre Museum Tour
              </p>
              <p className="text-xs text-slate-500">Main Entrance • 10:30 AM</p>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4">
            <FileText className="w-6 h-6 text-slate-400" />
            <div>
              <p className="text-s font-bold text-slate-900">Flight to Rome</p>
              <p className="text-xs text-slate-500">Terminal 2E • 10:45 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
