import { auth } from "@/auth";
import EventsList from "@/components/EventsList";
import Link from "next/link";

export default async function EventsPage() {
  const session = await auth();
  const eventsResponse = await fetch("http://localhost:3000/api/events");
  const data = eventsResponse.ok ? await eventsResponse.json() : {};
  const events = data.events ?? [];
  console.log(events);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted mt-2">
            Discover and join amazing events in your areas.
          </p>
        </div>
        {session && (
          <Link
            className="btn-primary"
            href={"/events/create"}
          >
            Create Event
          </Link>
        )}
      </div>

      <EventsList
        events={events}
        searchParams={null}
        isAuthenticated={!!session}
      />
    </div>
  );
}
