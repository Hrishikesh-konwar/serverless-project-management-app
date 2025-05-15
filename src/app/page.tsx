import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import TaskDashboard from "~/app/_components/task-dashboard";
import Profile from "./profile/page";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="absolute top-4 right-4 z-10">
                {session?.user ? (
                  <Profile user={session.user ?? undefined} />
                ) : (
                  <div className="flex gap-4">
                    <Link
                      href="/api/auth/signin"
                      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/signup"
                      className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {session?.user ? (
            <TaskDashboard />
          ) : (
            <section className="from-background to-muted bg-gradient-to-b py-20 md:py-32">
              <div className="container mx-auto px-4 text-center">
                <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                  Manage projects with{" "}
                  <span className="text-primary">clarity</span> and{" "}
                  <span className="text-primary">ease</span>
                </h1>
                <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-xl">
                  TaskMaster helps teams organize, track, and manage their work
                  in one collaborative space. Boost productivity and achieve
                  your goals faster.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
