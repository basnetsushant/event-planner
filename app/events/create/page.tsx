"use client";

import { createEvent } from "@/lib/event-actions";
import { useRouter } from "next/navigation";
import { useActionState } from "react";

export default function CreateEventPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(createEvent, {
    success: false,
    eventId: null,
    error: "",
  });
  if (state.success && state.eventId) {
    router.push(`/events/${state.eventId}`);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
        <p className="text-muted mt-2">
          Fill out the form below to create your event
        </p>
      </div>
      <form
        className="space-y-5"
        action={formAction}
      >
        <div>
          <label
            className="block text-sm text-foreground font-medium mb-2"
            htmlFor="title"
          >
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field"
            placeholder="Enter event title"
          />
        </div>

        <div>
          <label
            className="block text-sm text-foreground font-medium mb-2"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="input-field"
            placeholder="Enter event description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-foreground font-medium mb-2"
              htmlFor="date"
            >
              Date & Time*
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              required
              className="input-field"
            />
          </div>
          <div>
            <label
              className="block text-sm text-foreground font-medium mb-2"
              htmlFor="location"
            >
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              required
              className="input-field"
              placeholder="Enter event location"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-sm text-foreground font-medium mb-2"
              htmlFor="maxAttendees"
            >
              Max Attendees
            </label>
            <input
              type="number"
              id="maxAttendees"
              name="maxAttendees"
              min="1"
              className="input-field"
              placeholder="Leave empty for unlimited"
            />
          </div>
          <div>
            <label className="block text-sm text-foreground font-medium mb-2">
              Event Visibility
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                defaultChecked
                name="isPublic"
                className="h-4 w-4 text-primary focus:ring-primary border-slate-600 rounded bg-slate-800 "
              />
              <label
                htmlFor="isPublic"
                className="text-foreground ml-2 block text-sm"
              >
                Make this event public
              </label>
            </div>
          </div>
        </div>
        {state.error && (
          <div className="bg-red-600/10 border-red-600/30 rounded-md p-4">
            <p className="text-sm text-red-400">{state.error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn-primary"
            disabled={isPending}
          >
            {isPending ? "Creating" : " Create Event"}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
