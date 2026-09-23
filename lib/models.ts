export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number | null;
  userId: string;
  isPublic: boolean;
  user: {
    name: string | null;
    email: string | null;
  };
  rsvps: EventRSVP[];
  _count: {
    rsvps: number;
  };
}

interface EventRSVP {
  userId: string;
  status: RSVPStatus;
  user: {
    name: string;
  };
}
export type RSVPStatus = "GOING" | "NOT_GOING" | "MAYBE";
