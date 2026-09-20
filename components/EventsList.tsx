"use client";

import { format } from "date-fns";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number | null;
  user: {
    name: string | null;
    email: string;
  };
}

interface EventsListProps {
  events: Event[];
  searchParams: null;
  isAuthenticated: boolean;
}

export default function EventsList({
  events,
  searchParams,
  isAuthenticated,
}: EventsListProps) {
  events = [];
  return (
    <div className="space-y-6">
      {/* search and filter */}
      <div></div>
      {/* events grid */}
      {events.length === 0 && (
        <div className="text-center py-12 text-muted text-md">
          <p>No events found.</p>
          {isAuthenticated && (
            <Link
              href={"/events/create"}
              className="btn-primary mt-4 inline-block"
            >
              Create the first event.
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, key) => (
          <div
            key={key}
            className="card overflow-hidden hover:shadow-lg  transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {event.title}
              </h3>
              <p className="text-muted mb-4">{event.description} </p>

              <div className="space-y-2 text-sm text-muted">
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {event.location}
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
                  {event.maxAttendees}
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
                  by {event.user.name || "Unknown"}
                </div>
              </div>
              <div className="mt-4">
                <Link
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  href={`/events/${event.id}`}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
