export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxAttendees: number | null;
  userId: string;
  user: {
    name: string | null;
    email: string;
  };
}
