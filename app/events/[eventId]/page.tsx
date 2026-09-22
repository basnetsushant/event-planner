import { auth } from "@/auth";
import EventActions from "@/components/EventActions";
import { Event } from "@/lib/models";
import { notFound } from "next/navigation";

export default async function EventPage({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = await params;
  const session = await auth();

  const eventResponse = await fetch(
    `http://localhost:3000/api/events/${eventId}`,
    { cache: "no-store" },
  );

  if (!eventResponse.ok) {
    notFound();
  }

  const event = (await eventResponse.json()) as Event;
  const isOwner = session?.user?.id === event.userId;
  console.log(event);

  return (
    <div className="card p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div>
          <div>
            <h1 className="text-4xl text-foreground font-bold mb-6">
              {event.title}
            </h1>
            <p className="text-xl text-muted">{event.description}</p>
          </div>
          {isOwner && (
            <EventActions
              eventId={event.id}
              isOwner={isOwner}
            />
          )}
        </div>
      </div>
    </div>
  );
}
