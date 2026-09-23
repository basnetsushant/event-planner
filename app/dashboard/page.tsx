import { auth } from "@/auth";
import { Event } from "@/lib/models";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }
  const userRsvpsResponse = await fetch(
    "http://localhost:3000/api/dashboard/rsvps",
    {
      next: { tags: ["rsvps"] },
    },
  );

  const userRSVPs = userRsvpsResponse.ok ? await userRsvpsResponse.json() : [];

  const userEventsResponse = await fetch(
    "http://localhost:3000/api/dashboard/events",
    {
      next: { tags: ["events"] },
    },
  );

  const userEvents = userEventsResponse.ok
    ? await userEventsResponse.json()
    : [];

  const now = new Date();
  const upComingEvents = userEvents.filter(
    (event: Event) => new Date(event.date) >= now,
  );
  const pastEvents = userEvents.filter(
    (event: Event) => new Date(event.date) < now,
  );
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted mt-2">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>
      {/* Quick Actions  */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            className="btn-primary"
            href={"/events/create"}
          >
            Create New Event
          </Link>
          <Link
            className="btn-secondary"
            href={"/events"}
          >
            Browse All Events
          </Link>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Total Events
          </h3>
          <p className="text-3xl font-bold text-primary">{userEvents.length}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Upcoming Events
          </h3>
          <p className="text-3xl font-bold text-primary">
            {" "}
            {upComingEvents.length}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">Past Events</h3>
          <p className="text-3xl font-bold text-primary">{pastEvents.length}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground">My RSVPs</h3>
          <p className="text-3xl font-bold text-primary">{userRSVPs.length}</p>
        </div>
      </div>
    </div>
  );
}
