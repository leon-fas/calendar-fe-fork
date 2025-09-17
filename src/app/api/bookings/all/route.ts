import { NextRequest, NextResponse } from "next/server";
import {
  getAllRoomsBookingsByDateRange,
  bookingsToCalendarEventsWithRoomNames
} from "@/lib/bookings";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const bookings = await getAllRoomsBookingsByDateRange(
      new Date(startDate),
      new Date(endDate)
    );

    const events = bookingsToCalendarEventsWithRoomNames(bookings);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch all rooms bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch all rooms bookings" },
      { status: 500 }
    );
  }
}