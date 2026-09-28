import { auth } from "@/auth";
import { Event, EventRSVP } from "@/lib/models";
import { format } from "date-fns";
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

  const userRSVPs: EventRSVP[] = userRsvpsResponse.ok
    ? await userRsvpsResponse.json()
    : [];

  const userEventsResponse = await fetch(
    "http://localhost:3000/api/dashboard/events",
    {
      next: { tags: ["events"] },
    },
  );

  const userEvents: Event[] = userEventsResponse.ok
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
      {/* my events */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-foreground">My Events</h2>
          <Link
            className="text-primary hover:text-primary/80 transition-colors"
            href={"/events/create"}
          >
            + Create Event
          </Link>
        </div>
        {userEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3">
            {userEvents.map((event, key) => (
              <div
                key={key}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-muted mb-4">{event.description}</p>
                <div className="space-y-2 text-sm text-muted mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {format(new Date(event.date), "PPP 'at' p")}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {event._count.rsvps} RSVPs
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-muted">
            <p>You haven't created any events yet.</p>
          </div>
        )}
      </div>

      {/* My RSVPs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">My RSVPs</h2>

        {userRSVPs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6 lg:grid-cols-3">
            {userRSVPs.map((rsvp, key) => (
              <div
                key={key}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {rsvp.event?.title}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${rsvp.status === "GOING" ? "bg-green-600/20 text-green-400" : rsvp.status === "MAYBE" ? "bg-yellow-600/20 text-yellow-400 " : "bg-red-600/20 text-red-400 "}`}
                >
                  {rsvp.status}
                </span>
                <p className="mt-2 text-muted mb-4">
                  {rsvp.event?.description}
                </p>
                <div className="space-y-2 text-sm text-muted mb-4">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {format(new Date(rsvp.event!.date), "PPP 'at' p")}
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    by {rsvp.event?.user.name}
                  </div>
                </div>
                <Link
                  href={`/events/${rsvp.event?.id}`}
                  className="btn-primary w-full text-center"
                >
                  View Event
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center text-muted">
            <p>You haven't RSVP'd to any events yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
