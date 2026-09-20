import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch evetns." },
      { status: 500 },
    );
  }
}
