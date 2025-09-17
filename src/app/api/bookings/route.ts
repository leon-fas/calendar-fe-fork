import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getBookingsByDateRange,
  createBooking,
  bookingsToCalendarEvents,
  calendarEventToBooking,
  checkBookingConflict
} from "@/lib/bookings";
import type { CalendarEvent } from "@/components/event-calendar/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!roomId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const bookings = await getBookingsByDateRange(
      roomId,
      new Date(startDate),
      new Date(endDate)
    );

    const events = bookingsToCalendarEvents(bookings);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from Supabase
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.getClaims();

    if (authError || !authData?.claims) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const userId = authData.claims.sub;
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid user session" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { event, roomId } = body as { event: any; roomId: string };

    if (!event || !roomId) {
      return NextResponse.json(
        { error: "Missing event or roomId" },
        { status: 400 }
      );
    }

    // Convert serialized dates back to Date objects
    const eventWithDates: CalendarEvent = {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };

    // Note: Allowing overlapping bookings since UI handles stacking

    const bookingData = calendarEventToBooking(eventWithDates, roomId, userId);
    const newBooking = await createBooking(bookingData);

    return NextResponse.json({
      success: true,
      booking: newBooking
    });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}