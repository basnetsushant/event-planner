"use server";
import { auth } from "@/auth";
import z from "zod";
import { prisma } from "./prisma";
import { revalidateTag } from "next/cache";
import { RSVPStatus } from "./models";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  date: z.string().min(1, "Date is required."),
  location: z.string().min(1, "Location is required."),
  maxAttendees: z.string().optional(),
  isPublic: z.string().optional(),
});

export async function createEvent(_: any, formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated." };
    }

    const rawData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      location: formData.get("location"),
      maxAttendees: formData.get("maxAttendees"),
      isPublic: formData.get("isPublic"),
    };

    const validatedData = eventSchema.parse(rawData);

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,

        isPublic: validatedData.isPublic === "on",
        userId: session.user.id,
      },
    });

    return { success: true, eventId: event.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Failed to create event.", eventId: null };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not Authenticated" };
    }
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }
    const isOwner = session.user.id === existingEvent.userId;

    if (!isOwner) {
      return { success: false, error: "Not autherized to delete." };
    }
    await prisma.event.delete({
      where: { id: eventId },
    });
    revalidateTag("events", "max");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete the event." };
  }
}

export async function rsvpToEvent(eventId: string, status: RSVPStatus) {
  const session = await auth();
  try {
    if (!session?.user?.id) {
      return { success: false, error: "Not Authenticated" };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }
    if (!existingEvent.isPublic) {
      return { success: false, error: "Event is not public." };
    }
    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session?.user?.id,
          eventId: eventId,
        },
      },
    });
    if (existingRSVP) {
      await prisma.rSVP.update({
        where: {
          userId_eventId: {
            userId: session?.user?.id,
            eventId: eventId,
          },
        },
        data: {
          status,
        },
      });
    } else {
      await prisma.rSVP.create({
        data: {
          userId: session?.user?.id,
          eventId,
          status,
        },
      });
    }
    revalidateTag("events", "max");
    revalidateTag(`event-${eventId}`, "max");
    revalidateTag("rsvps", "max");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to RSVP" };
  }
}
