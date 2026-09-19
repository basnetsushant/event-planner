"use server";
import { auth } from "@/auth";
import z from "zod";
import { prisma } from "./prisma";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  date: z.string().min(1, "Date is required."),
  location: z.string().min(1, "Location is required."),
  maxAttendees: z.string().optional(),
  isPublic: z.string().optional(),
});

export default async function createEvent(_: any, formData: FormData) {
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
