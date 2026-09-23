"use client";

import { rsvpToEvent } from "@/lib/event-actions";
import { RSVPStatus } from "@/lib/models";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RSVPButtonsProps {
  eventId: string;
  currentRSVP?: RSVPStatus;
}

export default function RSVPButtons({
  eventId,
  currentRSVP,
}: RSVPButtonsProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeRSVP, setActiveRSVP] = useState<RSVPStatus | undefined>(
    currentRSVP,
  );

  function getButtonClass(status: RSVPStatus) {
    const baseClass =
      "px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 cursor-pointer";

    const isActive = activeRSVP === status;

    switch (status) {
      case "GOING":
        return `${baseClass} ${
          isActive
            ? "bg-green-600 text-white"
            : "bg-green-600/20 text-green-400 hover:bg-green-600/30"
        }`;

      case "NOT_GOING":
        return `${baseClass} ${
          isActive
            ? "bg-red-600 text-white"
            : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
        }`;

      case "MAYBE":
        return `${baseClass} ${
          isActive
            ? "bg-yellow-600 text-white"
            : "bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30"
        }`;

      default:
        return baseClass;
    }
  }

  async function handleRSVP(status: RSVPStatus) {
    setIsLoading(true);

    // Optimistically update the selected button
    setActiveRSVP(status);

    try {
      const result = await rsvpToEvent(eventId, status);

      if (!result.success) {
        // Revert if the server action fails
        setActiveRSVP(currentRSVP);
        console.error(result.error);
        return;
      }

      // Refresh Server Components with updated database data
      router.refresh();
    } catch (error) {
      setActiveRSVP(currentRSVP);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        RSVP to this event
      </h3>

      <div className="flex flex-wrap gap-3">
        <button
          className={getButtonClass("GOING")}
          onClick={() => handleRSVP("GOING")}
          disabled={isLoading}
        >
          Going
        </button>

        <button
          className={getButtonClass("MAYBE")}
          onClick={() => handleRSVP("MAYBE")}
          disabled={isLoading}
        >
          Maybe
        </button>

        <button
          className={getButtonClass("NOT_GOING")}
          onClick={() => handleRSVP("NOT_GOING")}
          disabled={isLoading}
        >
          Not Going
        </button>
      </div>
    </div>
  );
}
