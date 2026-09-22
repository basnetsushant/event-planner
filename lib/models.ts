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
}

export type RSVPStatus = "GOING" | "NOT_GOING" | "MAYBE";
